import { TestBed } from '@angular/core/testing';
import { setupServer } from 'msw/node';
import { firstValueFrom, take, toArray } from 'rxjs';
import { handlers } from '../../../mocks/handlers';
import { TELEMETRY_WS_URL, TelemetrySocket } from './telemetry-socket';

// Same handlers the browser uses, intercepted in Node instead of a Service Worker.
const server = setupServer(...handlers);

describe('TelemetrySocket (against the MSW mock)', () => {
  beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
  afterAll(() => server.close());

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: TELEMETRY_WS_URL, useValue: 'ws://localhost/ws/telemetry' }],
    });
  });

  it('streams telemetry frames for every node, about every 500ms', async () => {
    const socket = TestBed.inject(TelemetrySocket);

    const frames = await firstValueFrom(socket.frames$.pipe(take(2), toArray()));

    expect(frames).toHaveLength(2);
    expect(frames[0].metrics.length).toBeGreaterThan(0);
    const gap = frames[1].timestamp - frames[0].timestamp;
    expect(gap).toBeGreaterThanOrEqual(400);
    expect(gap).toBeLessThan(1_000);
  });
});
