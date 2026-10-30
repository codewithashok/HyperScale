/**
 * Dev builds: start MSW before Angular boots so the very first request is mocked.
 * Production builds swap this file for enable-mocks.prod.ts (see angular.json
 * fileReplacements), so MSW never ships to users.
 */
export async function enableMocks(): Promise<void> {
  const { worker } = await import('./browser');
  // Anything we don't mock (dev-server HMR socket, fonts, …) goes to the real network.
  await worker.start({ onUnhandledFrame: 'bypass' });
}
