import { createFleet, createTelemetryGenerator } from './fleet.factory';

describe('createFleet', () => {
  it('is deterministic for the same seed', () => {
    expect(createFleet(10, 7)).toEqual(createFleet(10, 7));
  });

  it('differs for a different seed', () => {
    expect(createFleet(10, 7)).not.toEqual(createFleet(10, 8));
  });

  it('creates the requested number of nodes with unique ids and IPs', () => {
    const fleet = createFleet(50);
    expect(fleet).toHaveLength(50);
    expect(new Set(fleet.map((n) => n.id)).size).toBe(50);
    expect(new Set(fleet.map((n) => n.ipAddress)).size).toBe(50);
  });
});

describe('createTelemetryGenerator', () => {
  const fleet = createFleet(20);

  it('emits one metric per node, stamped with the given time', () => {
    const frame = createTelemetryGenerator(fleet)(1_000);
    expect(frame.timestamp).toBe(1_000);
    expect(frame.metrics.map((m) => m.nodeId)).toEqual(fleet.map((n) => n.id));
  });

  it('keeps percentages within 0–100 over many frames', () => {
    const next = createTelemetryGenerator(fleet);
    for (let t = 0; t < 500; t++) {
      for (const m of next(t).metrics) {
        expect(m.cpu).toBeGreaterThanOrEqual(0);
        expect(m.cpu).toBeLessThanOrEqual(100);
        expect(m.memory).toBeGreaterThanOrEqual(0);
        expect(m.memory).toBeLessThanOrEqual(100);
      }
    }
  });

  it('reports zero load for nodes that are down', () => {
    const down = fleet.filter((n) => n.status === 'down').map((n) => n.id);
    const frame = createTelemetryGenerator(fleet)(0);
    for (const m of frame.metrics.filter((m) => down.includes(m.nodeId))) {
      expect(m.cpu).toBe(0);
      expect(m.networkInKbps).toBe(0);
    }
  });
});
