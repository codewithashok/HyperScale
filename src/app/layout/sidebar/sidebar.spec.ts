import { TestBed } from '@angular/core/testing';
import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  it('lists the main sections', async () => {
    const fixture = TestBed.createComponent(Sidebar);
    await fixture.whenStable();

    const items = [...(fixture.nativeElement as HTMLElement).querySelectorAll('.nav-item')].map((i) =>
      i.textContent?.trim(),
    );
    expect(items).toEqual(['Fleet', 'Alerts', 'Telemetry']);
  });
});
