import { TestBed } from '@angular/core/testing';
import { Navbar } from './navbar';

describe('Navbar', () => {
  it('shows the HyperScale brand', async () => {
    const fixture = TestBed.createComponent(Navbar);
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.brand-name')?.textContent).toContain('HyperScale');
  });
});
