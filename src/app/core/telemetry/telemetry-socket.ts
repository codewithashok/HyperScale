import { DOCUMENT, inject, Injectable, InjectionToken } from '@angular/core';
import { Observable, share } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { TelemetryFrame } from '../models/telemetry';
import { reconnectWithBackoff } from './reconnect-with-backoff';

export const TELEMETRY_WS_URL = new InjectionToken<string>('TELEMETRY_WS_URL', {
  providedIn: 'root',
  factory: () => {
    const { protocol, host } = inject(DOCUMENT).location;
    return `${protocol === 'https:' ? 'wss' : 'ws'}://${host}/ws/telemetry`;
  },
});

@Injectable({ providedIn: 'root' })
export class TelemetrySocket {
  private readonly url = inject(TELEMETRY_WS_URL);

  /**
   * Live telemetry frames. One socket is shared by all subscribers; it opens on
   * the first subscribe and closes when the last subscriber leaves.
   */
  readonly frames$: Observable<TelemetryFrame> = webSocket<TelemetryFrame>(this.url).pipe(
    reconnectWithBackoff(),
    share(),
  );
}
