import { ItemConflict } from '@/modules/vault/types/ItemConflict';

export type MergeResult = {
  entries: { added: number; updated: number; skipped: number };
  tombstones: { added: number; updated: number; skipped: number };
  conflicts: ItemConflict[];
};
