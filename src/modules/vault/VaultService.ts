import StorageService from '@/modules/storage/StorageService';
import FailedToAddEntryError from '@/modules/vault/errors/FailedToAddEntryError';
import FailedToDeleteEntryError from '@/modules/vault/errors/FailedToDeleteEntryError';
import FailedToPersistLocallyError from '@/modules/vault/errors/FailedToPersistLocallyError';
import FailedToRegisterError from '@/modules/vault/errors/FailedToRegisterError';
import FailedToUpdateEntryError from '@/modules/vault/errors/FailedToUpdateEntryError';
import InvalidCredentialsError from '@/modules/vault/errors/InvalidCredentialsError';
import ItemDoesNotExistError from '@/modules/vault/errors/ItemDoesNotExistError';
import VaultLockedError from '@/modules/vault/errors/VaultLockedError';
import VaultNotFoundError from '@/modules/vault/errors/VaultNotFoundError';
import VaultNotLoadedError from '@/modules/vault/errors/VaultNotLoadedError';
import EncryptedVault from '@/modules/vault/types/EncryptedVault';
import VaultEntry from '@/modules/vault/types/VaultEntry';
import VaultWorkerApi from '@/modules/vault/vault.worker';
import { AppError } from '@/shared/error/AppError';
import UnknownError from '@/shared/error/UnknownError';
import { releaseProxy, Remote, wrap } from 'comlink';

type VaultStatus = {
  isLocked: boolean;
  isLoading: boolean;
  error: Error | null;
};

export type VaultSnapshot = {
  status: VaultStatus;
  entries: VaultEntry[];
};

type VaultEntryDraft = Omit<
  VaultEntry,
  'itemId' | 'createdAt' | 'updatedAt' | 'type'
>;

class VaultService {
  private userId: string | null = null;
  private readonly storageService: StorageService;
  private encryptedVault: EncryptedVault | null = null;
  private worker: Worker | null = null;
  private workerApi: Remote<VaultWorkerApi> | null = null;
  private listeners: Set<(snapshot: VaultSnapshot) => void> = new Set();
  private cachedEntries: VaultEntry[] = [];
  private unlocking: boolean = false;
  private currentSnapshot: VaultSnapshot;

  private status: VaultStatus = {
    isLocked: true,
    isLoading: false,
    error: null,
  };

  constructor() {
    this.storageService = new StorageService();
    this.currentSnapshot = {
      status: { ...this.status },
      entries: [...this.cachedEntries],
    };
  }

  private mutationQueue: Promise<void> = Promise.resolve();

  private enqueue<T>(fn: () => Promise<T>): Promise<T> {
    const next = this.mutationQueue.then(fn);
    this.mutationQueue = next.then(
      () => {},
      () => {},
    );
    return next;
  }

  async load(userId: string): Promise<void> {
    this.updateStatus({ isLoading: true });
    this.notify();
    try {
      this.encryptedVault = await this.storageService.loadVault(userId);
      this.userId = userId;
      this.updateStatus({ isLoading: false });
    } catch (e) {
      this.clearUser();
      console.log(e);
      const error = new VaultNotFoundError();
      this.updateStatus({ isLoading: false, error });
      throw error;
    } finally {
      this.notify();
    }
  }

  async unlock(password: string): Promise<void> {
    if (!this.encryptedVault) throw new VaultNotLoadedError();
    if (this.unlocking) return;
    if (!this.status.isLocked) return;

    this.unlocking = true;
    this.updateStatus({ isLoading: true, error: null });
    this.notify();

    this.worker = new Worker(new URL('./vault.worker.ts', import.meta.url), {
      type: 'module',
    });
    this.workerApi = wrap<VaultWorkerApi>(this.worker);

    try {
      await this.workerApi.unlock(this.encryptedVault, password);
      this.cachedEntries = await this.workerApi.getEntries();
      this.updateStatus({ isLocked: false, isLoading: false });
      this.notify();
    } catch (e) {
      console.log(e);
      // Assume invalid credentials
      const error = new InvalidCredentialsError();
      this.updateStatus({ error });
      this.lock();
      throw error;
    } finally {
      this.unlocking = false;
    }
  }

  lock(): void {
    this.workerApi?.[releaseProxy]();
    this.worker?.terminate();
    this.workerApi = null;
    this.worker = null;
    this.cachedEntries = [];
    this.mutationQueue = Promise.resolve();
    this.updateStatus({ isLocked: true, isLoading: false });
    this.notify();
  }

  clearUser() {
    this.userId = null;
    this.updateStatus({});
    this.notify();
  }

  isUnlocked(): boolean {
    return this.workerApi !== null && !this.status.isLocked;
  }

  getStatus(): VaultStatus {
    return { ...this.status };
  }

  getEntries(): VaultEntry[] {
    if (!this.isUnlocked()) throw new VaultLockedError();
    return [...this.cachedEntries];
  }

  getEntry(itemId: string): VaultEntry {
    if (!this.isUnlocked()) throw new VaultLockedError();
    const entry = this.cachedEntries.find((e) => e.itemId === itemId);
    if (!entry) throw new ItemDoesNotExistError();
    return { ...entry };
  }

  async encryptForPersistence(): Promise<EncryptedVault> {
    if (!this.workerApi) throw new VaultLockedError();
    return this.workerApi.encryptVault();
  }

  subscribe(listener: (snapshot: VaultSnapshot) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot(): VaultSnapshot {
    return this.currentSnapshot;
  }

  private notify(): void {
    this.currentSnapshot = {
      status: { ...this.status },
      entries: [...this.cachedEntries],
    };
    this.listeners.forEach((listener) => listener(this.currentSnapshot));
  }

  async addEntry(entry: VaultEntryDraft): Promise<void> {
    if (!this.workerApi) throw new VaultLockedError();
    return this.enqueue(async () => {
      const item: VaultEntry = {
        ...entry,
        itemId: crypto.randomUUID(),
        type: 'entry',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      try {
        await this.workerApi!.addItem(item);
        this.cachedEntries = [...this.cachedEntries, item];
        await this.persistVault();
      } catch (e) {
        console.log(e);
        const error = new FailedToAddEntryError();
        this.updateStatus({ error });
        throw error;
      } finally {
        this.notify();
      }
    });
  }

  async updateEntry(
    itemId: string,
    updates: Partial<VaultEntry>,
  ): Promise<void> {
    if (!this.workerApi) throw new VaultLockedError();
    return this.enqueue(async () => {
      try {
        await this.workerApi!.updateItem(itemId, updates);
        this.cachedEntries = this.cachedEntries.map((e) =>
          e.itemId === itemId
            ? { ...e, ...updates, itemId, updatedAt: Date.now() }
            : e,
        );
        await this.persistVault();
      } catch (e) {
        this.cachedEntries = await this.workerApi!.getEntries();
        console.log(e);
        const error = new FailedToUpdateEntryError();
        this.updateStatus({ error });
        throw error;
      } finally {
        this.notify();
      }
    });
  }

  async deleteEntry(itemId: string): Promise<void> {
    if (!this.workerApi) throw new VaultLockedError();
    return this.enqueue(async () => {
      try {
        await this.workerApi!.deleteEntry(itemId);
        this.cachedEntries = this.cachedEntries.filter(
          (e) => e.itemId !== itemId,
        );
        await this.persistVault();
      } catch (e) {
        console.log(e);
        const error = new FailedToDeleteEntryError();
        this.updateStatus({ error });
        throw error;
      } finally {
        this.notify();
      }
    });
  }

  private async persistVault(): Promise<void> {
    try {
      const snapshot = await this.encryptForPersistence();
      await this.storageService.persistVault(snapshot);
      this.encryptedVault = snapshot;
    } catch {
      throw new FailedToPersistLocallyError();
    }
  }

  async save(): Promise<void> {
    return this.enqueue(() => this.persistVault());
  }

  async reload(password: string): Promise<void> {
    if (!this.userId) throw new VaultNotLoadedError();
    await this.mutationQueue;
    this.lock();
    await this.load(this.userId);
    await this.unlock(password);
  }

  private updateStatus(updates: Partial<VaultStatus>): void {
    this.status = { ...this.status, ...updates };
  }

  private toAppError(error: unknown): AppError {
    if (error instanceof AppError) return error;
    if (error instanceof Error)
      return new AppError({ message: error.message, code: '' });
    return new UnknownError();
  }

  async vaultExists(userId: string): Promise<boolean> {
    let ret = true;

    try {
      await this.storageService.loadVault(userId);
    } catch {
      ret = false;
    }

    return ret;
  }

  async register(userId: string, password: string): Promise<void> {
    if (!this.status.isLocked) throw new Error('Vault is already unlocked');

    this.updateStatus({ isLoading: true, error: null });
    this.notify();

    this.worker = new Worker(new URL('./vault.worker.ts', import.meta.url), {
      type: 'module',
    });
    this.workerApi = wrap<VaultWorkerApi>(this.worker);

    try {
      await this.workerApi.registerVault(userId, password);
      this.userId = userId;
      this.encryptedVault = await this.storageService.loadVault(userId);
      this.cachedEntries = await this.workerApi.getEntries();
      this.updateStatus({
        isLocked: false,
        isLoading: false,
      });
      this.notify();
    } catch (e) {
      console.log(e);
      const error = new FailedToRegisterError();
      this.updateStatus({ error });
      this.lock();
      throw error;
    }
  }

  getUserId() {
    return this.userId;
  }
}

export default VaultService;
