import { getResponse } from 'msw';
import { ServerNode } from '../app/core/models/server-node';
import { DEFAULT_FLEET_SIZE } from './data/fleet.factory';
import { httpHandlers } from './handlers';

describe('mock HTTP handlers', () => {
  it('serves the fleet at /api/v1/fleet', async () => {
    const response = await getResponse(httpHandlers, new Request('http://localhost/api/v1/fleet'));

    expect(response?.status).toBe(200);
    const fleet = (await response!.json()) as ServerNode[];
    expect(fleet).toHaveLength(DEFAULT_FLEET_SIZE);
    expect(fleet[0].id).toBe('node-001');
  });

  it('leaves unknown endpoints unhandled', async () => {
    const response = await getResponse(httpHandlers, new Request('http://localhost/api/v1/nope'));
    expect(response).toBeUndefined();
  });
});
