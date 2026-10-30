# Stage 0 Notes — Mock API & Live Telemetry

---

## What we did
- Built a fake backend so we can build screens without a real server.
- It has two parts: a fake REST API (the fleet list) and a fake live socket (telemetry every 500ms).

## Where stuff lives
```
src/
├── mocks/                         ← fake backend, dev + tests only
│   ├── data/seeded-random.ts      ← random numbers that are the same every run
│   ├── data/fleet.factory.ts      ← makes 24 fake servers + their live metrics
│   ├── handlers.ts                ← "if the app calls X, answer with Y"
│   ├── browser.ts                 ← plugs the handlers into the browser
│   ├── enable-mocks.ts            ← starts mocking before the app boots (dev)
│   └── enable-mocks.prod.ts       ← does nothing (prod)
└── app/core/
    ├── models/                    ← shapes of a server node + a telemetry frame
    └── telemetry/
        ├── telemetry-socket.ts        ← the app's live connection to telemetry
        └── reconnect-with-backoff.ts  ← "connection dropped? try again, slower each time"
public/mockServiceWorker.js        ← MSW's helper script (generated, don't edit)
```

## Key points

### MSW (Mock Service Worker)
- It catches requests at the network level, so the app has no idea it's talking to a fake.
- In the browser it runs as a service worker. In tests it runs in Node. **The same handlers serve both.**
- The fake API lives at /api/v1/fleet and the fake socket at /ws/telemetry.

### Seeded random data
- It's random-looking but the same every time, so screenshots, bugs and tests stay repeatable.
- Metrics drift a little each tick instead of jumping around, which looks like a real dashboard.

### The telemetry socket
- One shared connection for the whole app, no matter how many screens listen.
- It opens when the first screen subscribes and closes when the last one leaves, so nothing leaks.

### Reconnect with backoff
- If the connection drops, it retries after 1s, then 2s, 4s, 8s… up to a 30s cap.
- **Jitter** adds ±20% randomness so 1,000 browsers don't all reconnect at the same second.
- After a good message comes through, the wait time resets.
- Gotcha: when the server closes the socket *cleanly*, RxJS treats it as "done", not "error". We handle both.

### Dev vs prod
- In dev, mocks start before Angular boots.
- In prod, angular.json swaps in the do-nothing file, so **zero MSW code ships**. We checked the build.

### Test setup
- Vitest is capped at 2 workers (vitest-base.config.mts). Each worker starts its own fake browser (jsdom), and the default of one per CPU timed out on this machine.

## Tests (18 passing)
- Fake data is the same for the same seed and stays in valid ranges.
- The fleet endpoint returns 24 nodes.
- Backoff timing is right: grows, caps, jitters, resets, and stops on unsubscribe.
- The real socket service receives live frames from the mock, about 500ms apart.
