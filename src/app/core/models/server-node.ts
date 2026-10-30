export type NodeStatus = 'healthy' | 'warning' | 'down';

export type Region = 'us-east-1' | 'us-west-2' | 'eu-west-1' | 'ap-south-1';

export type Environment = 'prod' | 'staging' | 'dev';

export interface ServerNode {
  id: string;
  hostname: string;
  ipAddress: string;
  region: Region;
  environment: Environment;
  status: NodeStatus;
  cpuCores: number;
  memoryGb: number;
  /** Seconds since the node last booted. */
  uptimeSeconds: number;
}
