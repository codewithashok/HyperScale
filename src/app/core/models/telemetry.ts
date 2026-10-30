export interface NodeMetrics {
  nodeId: string;
  /** Percent, 0–100. */
  cpu: number;
  /** Percent, 0–100. */
  memory: number;
  latencyMs: number;
  networkInKbps: number;
  networkOutKbps: number;
}

/** One message on the telemetry socket: a snapshot of every node at a point in time. */
export interface TelemetryFrame {
  /** Epoch milliseconds. */
  timestamp: number;
  metrics: NodeMetrics[];
}
