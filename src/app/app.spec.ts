import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App shell', () => {
  let root: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    root = fixture.nativeElement as HTMLElement;
  });

  it('mounts the navbar, sidebar and main viewport', () => {
    expect(root.querySelector('app-navbar header')).toBeTruthy();
    expect(root.querySelector('app-sidebar nav[aria-label="Main"]')).toBeTruthy();
    expect(root.querySelector('main')).toBeTruthy();
  });

  it('has a router outlet inside main for pages to render into', () => {
    expect(root.querySelector('main router-outlet')).toBeTruthy();
  });
});
