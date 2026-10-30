import { concatWith, MonoTypeOperatorFunction, retry, throwError, timer } from 'rxjs';

export interface BackoffOptions {
  /** Delay before the first reconnect attempt. */
  baseMs?: number;
  /** Upper bound for any single delay. */
  maxMs?: number;
  /** Random spread as a fraction of the delay (0.2 = ±20%), so clients don't reconnect in lockstep. */
  jitter?: number;
  /** Injectable for deterministic tests. */
  random?: () => number;
}

/** Exponential backoff: base, 2×base, 4×base, … capped at maxMs, with ± jitter. */
export function backoffDelay(attempt: number, options: BackoffOptions = {}): number {
  const { baseMs = 1_000, maxMs = 30_000, jitter = 0.2, random = Math.random } = options;
  const exponential = Math.min(maxMs, baseMs * 2 ** (attempt - 1));
  const spread = exponential * jitter;
  return Math.round(Math.min(maxMs, exponential - spread + random() * spread * 2));
}

/**
 * Keeps a long-lived stream alive: resubscribes with exponential backoff
 * whenever the source errors OR completes (a WebSocket closed by the server
 * completes rather than errors). The attempt counter resets after any value
 * arrives, so a healthy connection that later drops starts again at baseMs.
 */
export function reconnectWithBackoff<T>(options: BackoffOptions = {}): MonoTypeOperatorFunction<T> {
  return (source) =>
    source.pipe(
      concatWith(throwError(() => new Error('Stream closed'))),
      retry({
        resetOnSuccess: true,
        delay: (_error, attempt) => timer(backoffDelay(attempt, options)),
      }),
    );
}
