const DEFAULT_ACTIVITY_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
] as const;

type InactivityWatcherOptions = {
  timeoutMs: number;
  onTimeout: () => void;
  events?: readonly string[];
  target?: EventTarget;
  onTick?: (msRemaining: number) => void;
  tickIntervalMs?: number;
};
export class InactivityWatcher {
  private readonly timeoutMs: number;
  private readonly onTimeout: () => void;
  private readonly events: readonly string[];
  private readonly explicitTarget: EventTarget | undefined;
  private target: EventTarget | null = null;

  private readonly onTick: ((msRemaining: number) => void) | undefined;
  private readonly tickIntervalMs: number;
  private tickIntervalId: ReturnType<typeof setInterval> | null = null;
  private deadline = 0;

  private timer: ReturnType<typeof setTimeout> | null = null;
  private isActive = false;
  private readonly handleActivity = () => this.reset();

  constructor(options: InactivityWatcherOptions) {
    this.timeoutMs = options.timeoutMs;
    this.onTimeout = options.onTimeout;
    this.events = options.events ?? DEFAULT_ACTIVITY_EVENTS;
    this.explicitTarget = options.target;
    this.onTick = options.onTick;
    this.tickIntervalMs = options.tickIntervalMs ?? 1000;
  }

  start(): void {
    if (this.isActive) return;
    if (typeof window === 'undefined') return; // no-op during SSR

    this.target = this.explicitTarget ?? window;
    this.isActive = true;
    this.events.forEach((event) =>
      this.target!.addEventListener(event, this.handleActivity, {
        passive: true,
      }),
    );

    if (this.onTick) {
      this.tickIntervalId = setInterval(() => {
        const msRemaining = Math.max(0, this.deadline - Date.now());
        this.onTick?.(msRemaining);
      }, this.tickIntervalMs);
    }

    this.reset();
  }

  stop(): void {
    if (!this.isActive || !this.target) return;
    this.isActive = false;
    this.events.forEach((event) =>
      this.target!.removeEventListener(event, this.handleActivity),
    );
    this.target = null;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.tickIntervalId) {
      clearInterval(this.tickIntervalId);
      this.tickIntervalId = null;
    }
  }

  reset(): void {
    if (!this.isActive) return;
    if (this.timer) clearTimeout(this.timer);
    this.deadline = Date.now() + this.timeoutMs;
    this.timer = setTimeout(() => {
      this.onTimeout();
    }, this.timeoutMs);
  }
}
