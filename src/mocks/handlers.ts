import { delay, http, HttpResponse, ws } from 'msw';
import { createFleet, createTelemetryGenerator } from './data/fleet.factory';

export const TELEMETRY_INTERVAL_MS = 500;

const fleet = createFleet();

// Matches ws://<any host>/ws/telemetry, so it works on any dev-server port.
const telemetry = ws.link(/\/ws\/telemetry$/);

export const httpHandlers = [
  http.get('*/api/v1/fleet', async () => {
    await delay(300); // feel like a real network
    return HttpResponse.json(fleet);
  }),
];

export const wsHandlers = [
  telemetry.addEventListener('connection', ({ client }) => {
    const nextFrame = createTelemetryGenerator(fleet);
    const timer = setInterval(() => {
      client.send(JSON.stringify(nextFrame(Date.now())));
    }, TELEMETRY_INTERVAL_MS);

    client.addEventListener('close', () => clearInterval(timer));
  }),
];

export const handlers = [...httpHandlers, ...wsHandlers];
