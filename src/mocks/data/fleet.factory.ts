import { Environment, NodeStatus, Region, ServerNode } from '../../app/core/models/server-node';
import { NodeMetrics, TelemetryFrame } from '../../app/core/models/telemetry';
import { between, pick, RandomFn, seededRandom } from './seeded-random';

export const DEFAULT_FLEET_SEED = 42;
export const DEFAULT_FLEET_SIZE = 24;

const REGIONS: readonly Region[] = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-south-1'];
const ENVIRONMENTS: readonly Environment[] = ['prod', 'prod', 'staging', 'dev'];
const ROLES = ['api', 'web', 'worker', 'db', 'cache', 'queue'] as const;

function statusFor(random: RandomFn): NodeStatus {
  const roll = random();
  if (roll < 0.08) return 'down';
  if (roll < 0.25) return 'warning';
  return 'healthy';
}

export function createFleet(count = DEFAULT_FLEET_SIZE, seed = DEFAULT_FLEET_SEED): ServerNode[] {
  const random = seededRandom(seed);

  return Array.from({ length: count }, (_, i) => {
    const region = pick(random, REGIONS);
    const role = pick(random, ROLES);
    const index = String(i + 1).padStart(3, '0');

    return {
      id: `node-${index}`,
      hostname: `${role}-${region}-${index}.hyperscale.internal`,
      ipAddress: `10.${REGIONS.indexOf(region)}.${Math.floor(i / 250)}.${(i % 250) + 1}`,
      region,
      environment: pick(random, ENVIRONMENTS),
      status: statusFor(random),
      cpuCores: pick(random, [4, 8, 16, 32]),
      memoryGb: pick(random, [16, 32, 64, 128]),
      uptimeSeconds: Math.floor(between(random, 3_600, 90 * 86_400)),
    };
  });
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const round1 = (value: number) => Math.round(value * 10) / 10;

/**
 * Produces telemetry frames as a random walk, so each node's metrics drift
 * smoothly instead of jumping around. Seeded, so the stream is reproducible.
 */
export function createTelemetryGenerator(fleet: ServerNode[], seed = DEFAULT_FLEET_SEED) {
  const random = seededRandom(seed);
  const state = new Map<string, NodeMetrics>(
    fleet.map((node) => [
      node.id,
      {
        nodeId: node.id,
        cpu: node.status === 'down' ? 0 : round1(between(random, 10, 70)),
        memory: node.status === 'down' ? 0 : round1(between(random, 20, 80)),
        latencyMs: round1(between(random, 5, 60)),
        networkInKbps: Math.round(between(random, 100, 5_000)),
        networkOutKbps: Math.round(between(random, 100, 5_000)),
      },
    ]),
  );

  return (timestamp: number): TelemetryFrame => {
    const metrics = fleet.map((node) => {
      const prev = state.get(node.id)!;
      const next: NodeMetrics =
        node.status === 'down'
          ? { ...prev, cpu: 0, memory: 0, networkInKbps: 0, networkOutKbps: 0 }
          : {
              nodeId: node.id,
              cpu: round1(clamp(prev.cpu + between(random, -5, 5), 1, 100)),
              memory: round1(clamp(prev.memory + between(random, -2, 2), 5, 100)),
              latencyMs: round1(clamp(prev.latencyMs + between(random, -4, 4), 1, 500)),
              networkInKbps: Math.round(clamp(prev.networkInKbps + between(random, -300, 300), 0, 20_000)),
              networkOutKbps: Math.round(clamp(prev.networkOutKbps + between(random, -300, 300), 0, 20_000)),
            };
      state.set(node.id, next);
      return next;
    });

    return { timestamp, metrics };
  };
}
