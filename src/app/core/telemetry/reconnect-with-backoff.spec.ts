import { defer, NEVER, of, throwError } from 'rxjs';
import { backoffDelay, reconnectWithBackoff } from './reconnect-with-backoff';

describe('backoffDelay', () => {
  const noJitter = { baseMs: 1_000, maxMs: 10_000, jitter: 0 };

  it('doubles each attempt and caps at maxMs', () => {
    const delays = [1, 2, 3, 4, 5, 6].map((attempt) => backoffDelay(attempt, noJitter));
    expect(delays).toEqual([1_000, 2_000, 4_000, 8_000, 10_000, 10_000]);
  });

  it('spreads delays by ± jitter', () => {
    const opts = { baseMs: 1_000, jitter: 0.2 };
    expect(backoffDelay(1, { ...opts, random: () => 0 })).toBe(800);
    expect(backoffDelay(1, { ...opts, random: () => 0.999999 })).toBe(1_200);
  });

  it('never exceeds maxMs even with jitter', () => {
    expect(backoffDelay(10, { baseMs: 1_000, maxMs: 5_000, jitter: 0.5, random: () => 0.999 })).toBe(5_000);
  });
});

describe('reconnectWithBackoff', () => {
  const options = { baseMs: 1_000, jitter: 0 };

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('reconnects with growing delays when the connection keeps dropping', () => {
    let connections = 0;
    const flaky = defer(() => {
      connections++;
      return connections <= 2 ? throwError(() => new Error('connection dropped')) : NEVER;
    });

    const sub = flaky.pipe(reconnectWithBackoff(options)).subscribe();
    expect(connections).toBe(1);

    vi.advanceTimersByTime(999);
    expect(connections).toBe(1);
    vi.advanceTimersByTime(1);
    expect(connections).toBe(2); // 1st retry after 1s

    vi.advanceTimersByTime(1_999);
    expect(connections).toBe(2);
    vi.advanceTimersByTime(1);
    expect(connections).toBe(3); // 2nd retry after 2s

    sub.unsubscribe();
  });

  it('also reconnects when the server closes the stream cleanly', () => {
    let connections = 0;
    const closesCleanly = defer(() => {
      connections++;
      return connections === 1 ? of('frame') : NEVER;
    });

    const values: string[] = [];
    const sub = closesCleanly.pipe(reconnectWithBackoff(options)).subscribe((v) => values.push(v));

    vi.advanceTimersByTime(1_000);
    expect(connections).toBe(2);
    expect(values).toEqual(['frame']);

    sub.unsubscribe();
  });

  it('resets the backoff after a successful message', () => {
    let connections = 0;
    const source = defer(() => {
      connections++;
      if (connections === 1) return throwError(() => new Error('drop'));
      if (connections === 2) return of('frame'); // healthy, then closes
      return NEVER;
    });

    const sub = source.pipe(reconnectWithBackoff(options)).subscribe();

    vi.advanceTimersByTime(1_000);
    expect(connections).toBe(2);
    vi.advanceTimersByTime(1_000); // back to baseMs, not 2s
    expect(connections).toBe(3);

    sub.unsubscribe();
  });

  it('cancels pending reconnects on unsubscribe (no leaks)', () => {
    let connections = 0;
    const alwaysFails = defer(() => {
      connections++;
      return throwError(() => new Error('drop'));
    });

    const sub = alwaysFails.pipe(reconnectWithBackoff(options)).subscribe();
    sub.unsubscribe();

    vi.advanceTimersByTime(60_000);
    expect(connections).toBe(1);
    expect(vi.getTimerCount()).toBe(0);
  });
});
