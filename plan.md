# HyperScale: Modern Angular Mastery Roadmap (Modern Architecture Edition)

**Target Application:** HyperScale — Cloud Fleet Control Plane & Observability Engine  
**Tooling & Runtime:** Modern Angular (v18–v22), Standalone, Zoneless by default, Vitest, MSW, Vite/esbuild.

---

## 🗺️ Curriculum Blueprint Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ STAGE 0: Groundwork - Mock API & Real-Time Data                             │
│  0   MSW mock HTTP API, RxJS webSocket() telemetry stream, deterministic    │
│      mock data generators, Vitest setup                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ LEVEL 1: Modern Production Developer (Clean Core Architecture)              │
│  1.1  Workspace & bootstrap: angular.json, tsconfig, bootstrapApplication,  │
│       app.config.ts, zoneless setup                                         │
│  1.2  Components & bindings: interpolation, property/event binding,         │
│       template refs, class/style bindings                                   │
│  1.3  Control flow: @if/@for/@switch/@empty, ng-container, ng-template,     │
│       legacy *ngIf/*ngFor/ngSwitch + migration schematic                    │
│  1.4  Communication: input()/output()/model(), viewChild/contentChild,      │
│       ng-content slots, legacy @Input/@Output/@ViewChild                    │
│  1.4b Lifecycle: all hooks in order, SimpleChanges, constructor vs          │
│       ngOnInit, ngOnDestroy vs DestroyRef, afterNextRender                  │
│  1.5  Pipes: built-in, chained & parameterized, custom pure pipes           │
│  1.6  DI: providedIn root, inject(), injector tree, providers vs            │
│       viewProviders, InjectionToken                                         │
│  1.7  Routing: lazy loadComponent, child routes, routerLink,                │
│       withComponentInputBinding, legacy ActivatedRoute                      │
│  1.8  Forms: template-driven ngModel, typed reactive forms,                 │
│       NonNullableFormBuilder, Signal Forms                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ LEVEL 2: Senior Enterprise Engineer (Reactivity, Async, SSR)                │
│  2.1  Signals: signal, computed, effect, linkedSignal, untracked            │
│  2.2  RxJS: switch/merge/concat/exhaustMap, combineLatest, forkJoin,        │
│       debounce, WebSocket streams, takeUntilDestroyed                       │
│  2.3  Interop & resources: toSignal/toObservable, resource(),               │
│       rxResource(), httpResource()                                          │
│  2.4  Advanced forms: custom sync/async validators, cross-field rules,      │
│       dynamic FormArray rows                                                │
│  2.5  Guards & resolvers: CanActivateFn, CanMatchFn, CanDeactivateFn,       │
│       ResolveFn                                                             │
│  2.6  Directives: attribute & structural directives, host metadata,         │
│       TemplateRef/ViewContainerRef, Renderer2                               │
│  2.7  HTTP: provideHttpClient(withFetch), functional interceptors,          │
│       error normalization, retry, HttpContext                               │
│  2.8  SSR/SSG: @angular/ssr, hydration + event replay, RenderMode           │
│       per route, platform-safe browser code                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ LEVEL 3: Lead Frontend Architect (Scale, Performance, Systems Design)       │
│  3.1  Change detection: Zone.js internals vs zoneless, signal-driven        │
│       scheduling, ADR on trade-offs                                         │
│  3.2  Virtualization: CDK virtual scroll, 100k+ live rows at 60 FPS         │
│  3.3  Web Workers: off-main-thread compute, postMessage, Transferables      │
│  3.4  Canvas: requestAnimationFrame loops, high-frequency rendering,        │
│       leak-free teardown                                                    │
│  3.5  @defer: triggers, prefetch, placeholders, bundle analysis & budgets   │
│  3.6  State: NgRx SignalStore, withEntities, custom store features,         │
│       optimistic updates                                                    │
│  3.7  Security & observability: XSS, DomSanitizer, CSP, global              │
│       ErrorHandler and crash telemetry                                      │
│  3.8  Accessibility: WCAG, CDK a11y, focus trapping, LiveAnnouncer          │
│  3.9  Nx monorepo & DDD: feature/ui/data-access/util libs, module           │
│       boundaries, Native Federation micro-frontends                         │
│  3.10 Testing strategy: CDK component harnesses, Playwright E2E,            │
│       visual regression                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Stage 0: Groundwork — Mock API & Real-Time WebSocket Infrastructure
*Build the data layer once so you never have to invent mock state during UI development.*

* **Concepts:** 
  - Mock Service Worker (MSW) for declarative HTTP network interception.
  - RxJS `webSocket()` subject with heartbeat pings, auto-reconnect, and exponential backoff retry logic.
  - Generating deterministic cluster telemetry mocks (CPU, Memory, Latency, Network I/O).
* **Hands-on Task:** Initialize MSW to intercept `/api/v1/fleet` and configure an RxJS WebSocket pipeline streaming a telemetry event every 500ms.
* **Testing:** Write a unit test verifying that the WebSocket reconnects with backoff when a connection drops.
* **AI Challenge & Review Prompt:**
  > "Review my MSW setup and RxJS WebSocket service. Show me how to implement an exponential backoff reconnect strategy using `retry({ delay: ... })` with jitter, and challenge my implementation on memory leak prevention when the client disconnects."
* **Interview Check:** *Why use Mock Service Worker over an Angular HttpInterceptor for local development?* (Answer: MSW intercepts at the browser network layer, ensuring native `fetch`, Web Workers, and SSR behave identically to production).

---

## LEVEL 1: Modern Production Developer (Clean Core Architecture)
*Objective: Build robust, type-safe components, templates, clean service layers, and core navigation using modern Angular defaults.*

### Stage 1.1: Project Skeleton & Bootstrapping
* **Concepts:** 
  - Workspace configuration: `angular.json` build targets, assets, SCSS styles, and `tsconfig.json` path mappings.
  - Bootstrapping: `bootstrapApplication(AppComponent, appConfig)` without `NgModule`.
  - Modern `app.config.ts`: `provideRouter`, `provideHttpClient(withFetch())`, and `provideZonelessChangeDetection()`.
* **Hands-on Task:** Initialize the HyperScale workspace. Clean out boilerplate, set up a global layout shell (Navbar, Sidebar, Main Viewport), and configure global theme variables.
* **Testing:** Write a root component test in Vitest confirming the application shell mounts.
* **AI Challenge & Review Prompt:**
  > "Inspect my `app.config.ts` and `main.ts`. Explain line-by-line how Angular boots up in a zoneless environment without `zone.js` and verify my configuration follows modern best practices."
* **Interview Check:** *What changes in the browser runtime when `zone.js` is completely removed?*

---

### Stage 1.2: Modern Components & Template Bindings
* **Concepts:**
  - Standalone component structure (no need for `standalone: true`).
  - Interpolation `{{ }}`, property binding `[ ]`, event binding `( )`, and template reference variables (`#cardRef`).
  - Class and style bindings: `[class.active]`, `[style.width.%]`.
* **Hands-on Task:** Build a `ServerNodeCardComponent` displaying hostnames, status pills (Healthy, Warning, Down), and IP addresses with an action trigger.
* **Testing:** Write a component spec testing that clicking the action button emits the event and applies the correct dynamic CSS class.
* **AI Challenge & Review Prompt:**
  > "Review my `ServerNodeCardComponent`. Critique my use of class and style bindings versus template expressions. Show me how to test DOM event emissions using Vitest."
* **Interview Check:** *Why are function calls inside template bindings discouraged, and how do Signals solve this?*

---

### Stage 1.3: Built-in Control Flow & Structural Utilities
* **Concepts:**
  - Modern built-in blocks: `@if`, `@else if`, `@else`, `@switch`, `@case`, `@default`.
  - Looping: `@for` with mandatory `track` expression, and the `@empty` fallback block.
  - Structural grouping: `<ng-container>` (DOM-less container) and `<ng-template>` (inert template blueprint).
  - **Legacy equivalents (still common in production code):** `*ngIf` (with `else` template), `*ngFor` with `trackBy`, `[ngSwitch]` / `*ngSwitchCase` / `*ngSwitchDefault`, and the `CommonModule` / `NgIf` / `NgFor` imports they require.
  - Automated migration: `ng generate @angular/core:control-flow`.
* **Hands-on Task:** Build the Fleet Grid. Render a dynamic list of server nodes with `@for (node of nodes(); track node.id)`, render an `@empty` state card, and switch status badges using `@switch`. Then build a `LegacyFleetGridComponent` with `*ngFor` + `trackBy`, `*ngIf; else`, and `[ngSwitch]`, and convert it back to modern syntax using the control-flow migration schematic.
* **Testing:** Verify with Vitest that the `@empty` block renders when the array is empty, and list items update correctly when array references change. Run the same spec against the legacy version to confirm identical behavior.
* **AI Challenge & Review Prompt:**
  > "Compare my `@for` loop track expression with legacy `*ngFor` and `trackBy`. What are the DOM diffing performance implications of tracking by array index versus unique IDs?"
* **Interview Check:** *Why does Angular make the `track` expression mandatory in `@for`, and what happens in `*ngFor` when `trackBy` is omitted?*

---

### Stage 1.4: Signal-Based Component Communication & Content Projection
* **Concepts:**
  - Signal inputs: `input()` and `input.required()`.
  - Modern outputs: `output()` function.
  - Two-way signal synchronization: `model()`.
  - Queries: `viewChild()` and `contentChild()`.
  - Projection: Single-slot and multi-slot projection via `<ng-content select="...">`.
  - **Legacy equivalents (still common in production code):** `@Input()` (including setters/getters and `{ required: true }`), `@Output()` with `EventEmitter<T>`, the `[(x)]` + `xChange` two-way convention, and `@ViewChild()` / `@ViewChildren()` / `@ContentChild()` / `@ContentChildren()` with `QueryList`.
  - Automated migration: `ng generate @angular/core:signal-input-migration`, `output-migration`, and `signal-queries-migration`.
* **Hands-on Task:** Build a reusable `MetricCardComponent` with multi-slot projection for header, sparkline, and footer, using `input.required<number>()` for telemetry values and `model<boolean>()` for expanded card state. Then write a `LegacyMetricCardComponent` with `@Input()` setters, `@Output()` + `EventEmitter`, and `@ViewChild`, and migrate it to signals using the schematics.
* **Testing:** Test parent-child signal input propagation and verify projected content in Vitest. Write the same test for the legacy version and note how setting inputs differs (`fixture.componentRef.setInput()` works for both).
* **AI Challenge & Review Prompt:**
  > "Review my use of `model()` vs. paired `input()` and `output()`. How does `model()` simplify two-way data binding without two-way event loop bugs?"
* **Interview Check:** *What is the fundamental difference between decorator `@Input()` and signal `input()` regarding lifecycle timing and reactivity?*

---

### Stage 1.4b: Component Lifecycle Hooks & Cleanup
* **Concepts:**
  - Full lifecycle order: `constructor` → `ngOnChanges` → `ngOnInit` → `ngDoCheck` → `ngAfterContentInit` → `ngAfterContentChecked` → `ngAfterViewInit` → `ngAfterViewChecked` → `ngOnDestroy`.
  - `ngOnChanges` and `SimpleChanges` (`previousValue`, `currentValue`, `firstChange`) — and why it only fires for decorator `@Input()` changes set by a parent.
  - Constructor vs. `ngOnInit`: what is (and isn't) available at each point.
  - Why `@ViewChild` is `undefined` before `ngAfterViewInit`, and the `ExpressionChangedAfterItHasBeenCheckedError`.
  - Cleanup: `ngOnDestroy` vs. modern `DestroyRef.onDestroy()` and `takeUntilDestroyed()`.
  - Modern render hooks: `afterNextRender()` and `afterEveryRender()`, and how signals (`computed()`, `effect()`) replace many `ngOnChanges` / `ngDoCheck` use cases.
* **Hands-on Task:** Build a `NodeInspectorComponent` that implements every lifecycle hook and logs its name, order, and current input values. Toggle it with `@if`, change its inputs from the parent, and record the exact sequence. Add a polling `setInterval` and clean it up first with `ngOnDestroy`, then refactor to `DestroyRef`.
* **Testing:** Spy on the hooks in Vitest and assert their call order; assert the interval is cleared after the component is destroyed (`fixture.destroy()`).
* **AI Challenge & Review Prompt:**
  > "Review my `NodeInspectorComponent` lifecycle log. Explain why each hook fired in that order, which hooks I could replace with signals or `DestroyRef` in modern Angular, and which ones (like `ngOnInit` and `ngAfterViewInit`) still have a valid place."
* **Interview Check:** *What is the difference between the constructor and `ngOnInit`, and when does `ngOnChanges` run relative to `ngOnInit`?*

---

### Stage 1.5: Built-in & Custom Pure Pipes
* **Concepts:**
  - Built-in pipes: `DatePipe`, `DecimalPipe`, `PercentPipe`, `JsonPipe`.
  - Parameterized and chained pipe expressions.
  - Custom pure pipes: `PipeTransform` interface.
  - Reference purity: Why pure pipes only re-evaluate when primitive values or object references change.
* **Hands-on Task:** Build `BytesToSizePipe` (`1073741824` → `1.00 GB`) and `UptimeDurationPipe` (`3661` → `1h 1m 1s`). Display real-time fleet bandwidth metrics.
* **Testing:** Write isolated unit tests for `BytesToSizePipe` covering zero, negative values, and rounding edge cases.
* **AI Challenge & Review Prompt:**
  > "Inspect my custom `BytesToSizePipe`. Explain why creating an impure pipe for formatting frequent numbers causes performance degradation, and how Angular caches pure pipe transforms."
* **Interview Check:** *How does Angular optimize pure pipe calls compared to template methods or getters?*

---

### Stage 1.6: Modern Dependency Injection & Service Layer
* **Concepts:**
  - `@Injectable({ providedIn: 'root' })`.
  - Functional `inject()` API versus constructor injection.
  - Element Injector vs. Environment Injector tree (`providers` vs. `viewProviders`).
  - `InjectionToken<T>` for app configuration and environment settings.
* **Hands-on Task:** Create a `FleetDataService` using `inject(HttpClient)` to fetch server nodes from Stage 0's MSW endpoint. Create an `APP_CONFIG` injection token for environment URLs.
* **Testing:** Test `FleetDataService` with Vitest by mocking `HttpClient`.
* **AI Challenge & Review Prompt:**
  > "Review my service architecture. Show an example where scoping a service in a component's `providers` creates isolated state versus a root singleton, and explain when to use `viewProviders`."
* **Interview Check:** *What are the architectural benefits of the functional `inject()` API over traditional constructor parameter injection?*

---

### Stage 1.7: Modern Functional Routing & Child Outlets
* **Concepts:**
  - Route configurations using `provideRouter()`.
  - Lazy loading components with `loadComponent: () => import(...)`.
  - Component Input Binding: `withComponentInputBinding()` to map route params directly to `input()`.
  - Child routes with `<router-outlet>`, `routerLink`, and `routerLinkActive`.
  - **Legacy equivalent (still common in production code):** injecting `ActivatedRoute` and reading `paramMap` / `queryParamMap` / `snapshot`, plus programmatic navigation with `Router.navigate()` and `navigateByUrl()`.
* **Hands-on Task:** Set up routes for `/fleet`, `/fleet/:nodeId` (node details), and `/alerts`. Pass `:nodeId` directly into `NodeDetailComponent` as `nodeId = input.required<string>()`. Then implement the same page reading `:nodeId` via `ActivatedRoute.paramMap`, and observe why `snapshot` goes stale when navigating between nodes on the same route.
* **Testing:** Write a routing integration test verifying navigation to `/fleet/node-123` binds the input correctly.
* **AI Challenge & Review Prompt:**
  > "Review my router configuration. Challenge my setup on 404 wildcard routes, redirects, and whether `withComponentInputBinding()` introduces any coupling between the router and component."
* **Interview Check:** *How does `withComponentInputBinding()` replace injecting `ActivatedRoute`?*

---

### Stage 1.8: Template-Driven Forms, Typed Reactive Forms & Signal Forms
* **Concepts:**
  - Template-driven forms: `FormsModule`, `[(ngModel)]`, `name` attributes, `#form="ngForm"`, `ngModelGroup`, and validation attributes (`required`, `minlength`, `pattern`).
  - `ReactiveFormsModule`, strictly typed `FormControl<T>`, `FormGroup`, and `FormArray`.
  - `NonNullableFormBuilder`.
  - Modern Signal Forms primitives and integration.
  - Validation state indicators: `touched`, `dirty`, `valid`, `invalid`.
* **Hands-on Task:** Build a simple "Rename Node" dialog with template-driven forms and `[(ngModel)]`. Then build a "Provision Server Node" form with Typed Reactive Forms: fields for Node Name, IP Address, Region (Dropdown), and Tag array. Validate required fields and IP format regex.
* **Testing:** Test form validity states when inputs are blank, invalid, and correctly filled. For the template-driven form, note that `ngModel` updates asynchronously — `await fixture.whenStable()` before asserting.
* **AI Challenge & Review Prompt:**
  > "Review my Typed Reactive Form. Show how to model this same form using modern Signal-based form patterns, highlighting the differences in reactivity and validation."
* **Interview Check:** *When would you choose template-driven forms over reactive forms, and what safety advantages do Typed Forms introduce over untyped forms?*

---

## LEVEL 2: Senior Enterprise Engineer (Advanced Reactivity, SSR & Async)
*Objective: Master fine-grained Signal primitives, advanced RxJS pipelines, custom directives, security, accessibility, and SSR/SSG.*

### Stage 2.1: Advanced Signals & Derived State
* **Concepts:**
  - Writable `signal()` (`set`, `update`, `asReadonly`).
  - `computed()`: Automatic dependency tracking, glitch-free execution, and memoization.
  - `effect()`: Side-effect handling and `onCleanup` registration.
  - `linkedSignal()`: Dependent state resets when a source signal changes.
  - Bypassing tracking with `untracked()`.
* **Hands-on Task:** Build a cluster filter bar: search query, status dropdown, region multi-select. Compute active filters, filtered nodes, and fleet health percentage using `computed()`. Use `linkedSignal()` to reset selected node when the cluster region changes.
* **Testing:** Test that computed signals recalculate accurately and do not re-run when irrelevant signals change.
* **AI Challenge & Review Prompt:**
  > "Critique my signal architecture. Explain the role of `linkedSignal()` versus writing to a signal inside an `effect()`. Why does Angular restrict setting signals inside effects by default?"
* **Interview Check:** *What is a 'diamond dependency problem' in reactive programming, and how does Angular's push/pull Signal algorithm eliminate glitches?*

---

### Stage 2.2: Advanced RxJS Orchestration & WebSockets
* **Concepts:**
  - Observables vs. Signals (When to use which).
  - Flattening operators: `switchMap` (search/cancel), `mergeMap` (parallel), `concatMap` (sequential), `exhaustMap` (submit guard).
  - Combination operators: `combineLatest`, `forkJoin`, `withLatestFrom`.
  - Teardown handling with `takeUntilDestroyed()`.
* **Hands-on Task:** Build a real-time Fleet Command Console. Pipe the search input through `debounceTime(300)` and `distinctUntilChanged()`, cancel previous calls via `switchMap`, and merge live WebSocket telemetry updates.
* **Testing:** Test operator pipeline timing using Vitest fake timers (`vi.useFakeTimers()`).
* **AI Challenge & Review Prompt:**
  > "Analyze my RxJS pipeline for memory leaks. Explain how `takeUntilDestroyed()` automatically infers cleanup context and contrast `exhaustMap` with `switchMap` in an incident triage workflow."
* **Interview Check:** *Explain the exact differences between `switchMap`, `mergeMap`, `concatMap`, and `exhaustMap` with real-world enterprise use cases.*

---

### Stage 2.3: Modern Signal & RxJS Interop + Async Resources
* **Concepts:**
  - `@angular/core/rxjs-interop`: `toSignal()` and `toObservable()`.
  - Modern data-fetching primitives: `resource()`, `rxResource()`, and `httpResource()`.
  - Managing loading, error, and resolved states declaratively without manual subscription flags.
* **Hands-on Task:** Refactor node data-fetching using `httpResource()` or `rxResource()` to fetch server telemetry based on an active node ID signal.
* **Testing:** Test loading, error, and success states produced by the resource primitive.
* **AI Challenge & Review Prompt:**
  > "Review my `resource()` implementation. How do `resource()` and `httpResource()` streamline asynchronous UI states compared to traditional `Observable` + `AsyncPipe` patterns?"
* **Interview Check:** *When should an enterprise application choose `toSignal()` versus `resource()`?*

---

### Stage 2.4: Complex Form Validation & Cross-Field Rules
* **Concepts:**
  - Custom synchronous validators (`ValidatorFn`).
  - Asynchronous validators (`AsyncValidatorFn`) with debounce.
  - Cross-field validation (e.g., Min Threshold < Max Threshold).
  - Dynamic FormArrays with add/remove row capability.
* **Hands-on Task:** Build an "Alert Policy Rule Editor" where users configure dynamic threshold rules (Metric, Condition, Value, Severity) with an async validator checking for rule name uniqueness against the backend.
* **Testing:** Write specs for the custom synchronous and asynchronous validators.
* **AI Challenge & Review Prompt:**
  > "Review my custom async validator. How do we ensure that rapid keystrokes do not spam the backend validation endpoint using RxJS operators inside an `AsyncValidatorFn`?"
* **Interview Check:** *How do cross-field validators work at the `FormGroup` level versus field-level validators?*

---

### Stage 2.5: Functional Route Guards & Resolvers
* **Concepts:**
  - Functional guards: `CanActivateFn`, `CanDeactivateFn`, `CanMatchFn`.
  - `CanMatchFn` for feature flags and bundle prevention.
  - `CanDeactivateFn` for dirty form confirmations.
  - Data pre-fetching using `ResolveFn`.
* **Hands-on Task:** Implement an `authGuard` checking token presence, a `pendingChangesGuard` warning users before leaving dirty alert configurations, and a `nodeResolver` preloading critical node metrics.
* **Testing:** Test route guard returns (boolean or `UrlTree`) in Vitest.
* **AI Challenge & Review Prompt:**
  > "Review my functional guards. What is the execution difference between `CanActivateFn` and `CanMatchFn` when considering code splitting and bundle downloading?"
* **Interview Check:** *Why did Angular deprecate class-based guards in favor of functional guards, and how do you inject services into functional guards?*

---

### Stage 2.6: Custom Directives & Modern Host Bindings
* **Concepts:**
  - Attribute Directives with modern `host: { ... }` metadata.
  - Structural Directives using `TemplateRef` and `ViewContainerRef`.
  - `Renderer2` and `ElementRef` for safe DOM manipulation.
* **Hands-on Task:** Build an `[appPulseStatus]` attribute directive that dynamically pulses colors based on node health, and a structural `*appHasRole="'SRE'"` directive that conditionally renders admin controls.
* **Testing:** Test directive instantiation and DOM manipulation via `TestBed`.
* **AI Challenge & Review Prompt:**
  > "Review my directives. Why is modern `host: { ... }` preferred over `@HostBinding` and `@HostListener`, and why should direct access to `ElementRef.nativeElement` be wrapped in `Renderer2`?"
* **Interview Check:** *How does a structural directive manipulate the DOM tree behind the scenes?*

---

### Stage 2.7: Production HTTP Client & Functional Interceptors
* **Concepts:**
  - Modern `provideHttpClient(withFetch(), withInterceptors([...]))`.
  - Functional interceptor pipeline: `HttpInterceptorFn`.
  - Auth token injection, logging, global error normalization, retry with backoff.
* **Hands-on Task:** Build a chained interceptor chain:
  1. `authInterceptor`: Clones request and attaches Bearer token.
  2. `timingInterceptor`: Records API latency.
  3. `errorInterceptor`: Catches HTTP errors, logs to a centralized service, and triggers notifications.
* **Testing:** Test interceptor chaining using `HttpTestingController`.
* **AI Challenge & Review Prompt:**
  > "Inspect my functional interceptors. Show how to bypass specific interceptors for public endpoints (like `/status`) using `HttpContext` and `HttpContextToken`."
* **Interview Check:** *How does the modern `HttpInterceptorFn` pipeline compare to legacy `HttpInterceptor` class implementations?*

---

### Stage 2.8: Server-Side Rendering (SSR), SSG & Client Hydration
* **Concepts:**
  - `@angular/ssr` architecture with Node/Express engine.
  - Non-destructive client hydration with event replay: `provideClientHydration(withEventReplay())`.
  - Route rendering manifest (`app.routes.server.ts`): `RenderMode.Prerender`, `RenderMode.Server`, `RenderMode.Client`.
  - Server safety: `isPlatformBrowser`, `isPlatformServer`, `afterNextRender()`, and `afterEveryRender()`.
* **Hands-on Task:** Configure HyperScale with `@angular/ssr`. Prerender the public `/status` page at build time (SSG), dynamically render `/fleet/:id` on the server (SSR), and keep `/admin/**` client-side. Safely isolate `localStorage` calls.
* **Testing:** Write tests verifying browser-only code does not execute during server-side execution.
* **AI Challenge & Review Prompt:**
  > "Review my `app.routes.server.ts` and hydration setup. Explain how `withEventReplay()` captures user interactions before client JS loads, and diagnose potential hydration mismatch errors."
* **Interview Check:** *What causes DOM hydration mismatches in Angular, and how do you diagnose and resolve them?*

---

## LEVEL 3: Lead Frontend Architect (Scale, Performance & Systems Design)
*Objective: Scale the system to 100k+ real-time records, eliminate change-detection overhead, enforce strict enterprise boundaries, and secure the platform.*

### Stage 3.1: Change Detection Internals & Zoneless Architecture
* **Concepts:**
  - How Zone.js monkey-patches async APIs vs. how Signals notify the framework directly.
  - Modern `provideZonelessChangeDetection()`.
  - Signal dirty-marking, microtask scheduling, and targeted DOM updates.
* **Hands-on Task:** Benchmark and verify the zoneless execution model in HyperScale. Build a high-frequency counter component and inspect dirty checks using Angular DevTools.
* **ADR Required:** Document the architectural trade-offs of running Zoneless vs. Zone.js in an enterprise system.
* **Testing:** Test zoneless component updates using `await fixture.whenStable()`.
* **AI Challenge & Review Prompt:**
  > "Examine my zoneless component tree. Explain how Angular schedules DOM updates when a Signal changes without `zone.js` intercepting microtasks."
* **Interview Check:** *Explain how Angular's change detection engine works in a zoneless application compared to Zone.js-driven change detection.*

---

### Stage 3.2: High-Volume Virtualization (CDK Virtual Scroll)
* **Concepts:**
  - DOM node count bottlenecks and memory overhead.
  - Angular CDK Virtual Scroll (`ScrollingModule`).
  - Fixed size vs. dynamic size virtual scroll strategies.
* **Hands-on Task:** Build the "Cluster Audit Log Streamer". Render 100,000+ real-time log records at a fluid 60 FPS using `<cdk-virtual-scroll-viewport>`, supporting search highlighting and auto-scroll to bottom.
* **ADR Required:** Document why virtual scrolling was selected over client-side pagination for real-time telemetry logs.
* **Testing:** Test viewport element recycling and rendering calculations.
* **AI Challenge & Review Prompt:**
  > "Review my virtual scroll implementation. How do we implement dynamic item sizing and buffer tuning for logs of varying line lengths without stuttering during rapid scrolling?"
* **Interview Check:** *How does virtual scrolling maintain 60 FPS performance when displaying hundreds of thousands of complex records?*

---

### Stage 3.3: Multithreading with Web Workers
* **Concepts:**
  - JavaScript main-thread limitations and frame budgeting (16.6ms).
  - Angular CLI Web Worker integration (`ng generate web-worker`).
  - Web Worker communication via `postMessage`, `onmessage`, and structured clone algorithms.
* **Hands-on Task:** Generate a telemetry worker. Offload complex statistical computations (95th percentile latency calculations, moving-average smoothing, and anomaly scoring over 50,000 data points) to the background worker.
* **Testing:** Test worker message dispatching and response handling.
* **AI Challenge & Review Prompt:**
  > "Review my Web Worker integration. What data structures can be transferred using `Transferable Objects` (e.g., `ArrayBuffer`) to eliminate memory copy overhead between the worker and main thread?"
* **Interview Check:** *When should an Angular architect offload logic to a Web Worker, and what are the architectural trade-offs?*

---

### Stage 3.4: High-Frequency Canvas Graphics (Zoneless Rendering)
* **Concepts:**
  - High-frequency UI updates and rendering frame rates.
  - `requestAnimationFrame` loops coupled with direct HTML5 Canvas 2D/WebGL rendering.
  - Why zoneless execution prevents high-frequency canvas loops from triggering unwanted framework overhead.
* **Hands-on Task:** Build a high-velocity Sparkline Chart rendering 60 updates/sec for active server CPU telemetry on an HTML5 canvas.
* **Testing:** Test canvas mount, lifecycle unmount, and animation loop termination.
* **AI Challenge & Review Prompt:**
  > "Review my Canvas sparkline component. Contrast how this runs in our zoneless app versus an old Zone.js app requiring `NgZone.runOutsideAngular()`. How do we prevent memory leaks when the component unmounts?"
* **Interview Check:** *How do you integrate high-frequency animations or third-party charting libraries into Angular without performance degradation?*

---

### Stage 3.5: Deferrable Views (`@defer`) & Bundle Optimization
* **Concepts:**
  - Deferrable views: `@defer`, `@placeholder`, `@loading`, `@error`.
  - Triggers: `on idle`, `on viewport`, `on interaction`, `on hover`, `on timer`, `when condition`.
  - Prefetching triggers: `prefetch on idle`.
  - Bundle analysis using `source-map-explorer` and setting build budgets in `angular.json`.
* **Hands-on Task:** Wrap heavy cluster topology maps and charting widgets in `@defer (on viewport; prefetch on idle)`. Configure strict bundle budgets (initial < 200 KB) in `angular.json`.
* **Testing:** Test deferred view resolution and placeholder rendering.
* **AI Challenge & Review Prompt:**
  > "Analyze my bundle report from `source-map-explorer`. Guide me through optimizing my `@defer` strategies and removing accidental large dependencies from the initial entry bundle."
* **Interview Check:** *How do `@defer` blocks improve Core Web Vitals (specifically LCP and INP), and what is the difference between the defer trigger and the prefetch trigger?*

---

### Stage 3.6: Enterprise State Management (NgRx SignalStore)
* **Concepts:**
  - Local state vs. Shared domain state vs. Global client cache.
  - Modern `@ngrx/signals`: `signalStore()`, `withState()`, `withComputed()`, `withMethods()`, `withHooks()`.
  - Custom store features and optimistic mutations.
* **Hands-on Task:** Build `FleetStore` using NgRx SignalStore. Manage active clusters, node selection, filter states, and async loading states with full immutability and zero boilerplate actions/reducers.
* **ADR Required:** Document the decision to use NgRx SignalStore over traditional Redux/NgRx Store or plain service-based signals.
* **Testing:** Write isolated unit tests for `FleetStore` methods, selectors, and computed values.
* **AI Challenge & Review Prompt:**
  > "Review my `FleetStore`. Show how to create a reusable custom store feature (e.g., `withCallState()` or `withEntities()`) to standardize loading and error handling across multiple stores."
* **Interview Check:** *How does NgRx SignalStore eliminate the boilerplate of traditional Redux (Actions, Reducers, Effects) while maintaining architectural discipline?*

---

### Stage 3.7: Security, Sanitization & Frontend Observability
* **Concepts:**
  - XSS mitigation and Angular's built-in contextual encoding.
  - Safe bypassing with `DomSanitizer` (`bypassSecurityTrustHtml`, etc.) and when it is forbidden.
  - Content Security Policy (CSP) headers and trusted types.
  - Custom `ErrorHandler` for centralizing frontend crash logging and telemetry dispatch.
* **Hands-on Task:** Implement a custom `GlobalErrorHandler` that captures unhandled exceptions, enriches them with active route and fleet state, and dispatches an alert payload to a monitoring endpoint. Safely sanitize dynamic SVG cluster topology labels.
* **Testing:** Test that thrown errors are caught by `GlobalErrorHandler` without crashing the application.
* **AI Challenge & Review Prompt:**
  > "Audit my app for frontend security vulnerabilities. Explain the security risks of `DomSanitizer` and review my `GlobalErrorHandler` implementation for unhandled promise rejections."
* **Interview Check:** *How does Angular handle cross-site scripting (XSS) automatically, and what are the strict guidelines for using `DomSanitizer`?*

---

### Stage 3.8: Accessibility (WCAG 2.1 AA) & Design System A11y
* **Concepts:**
  - Semantic HTML and ARIA roles for complex dashboard widgets.
  - Focus management, keyboard navigation trapping (`@angular/cdk/a11y`).
  - Screen reader announcements (`LiveAnnouncer`).
* **Hands-on Task:** Make the Fleet Control Panel fully accessible: keyboard navigable server cards, focus trap on modals, and real-time screen reader announcements when a server node crashes.
* **Testing:** Test keyboard focus trapping and aria-attributes using Vitest.
* **AI Challenge & Review Prompt:**
  > "Review my components for WCAG 2.1 AA compliance. Critique my use of `FocusTrap` and `LiveAnnouncer` on high-frequency status changes."
* **Interview Check:** *How do you manage keyboard navigation and screen reader announcements in high-frequency real-time dashboard applications?*

---

### Stage 3.9: Monorepo Architecture (Nx) & Domain-Driven Design (DDD)
* **Concepts:**
  - Nx Monorepos and Domain-Driven Design (DDD).
  - Library classifications: `feature-*`, `ui-*`, `data-access-*`, `util-*`.
  - Lint boundary enforcement rules (`@nx/enforce-module-boundaries`).
  - Micro-Frontends using Native Module Federation with standalone Angular components.
* **Hands-on Task:** Organize the HyperScale codebase into an Nx workspace with strict domain boundaries (`fleet`, `telemetry`, `alerts`). Configure lint rules to prevent `ui` libraries from importing `data-access` directly.
* **ADR Required:** Document the architectural separation between libraries and the strategy for Micro-Frontend federation.
* **Testing:** Run `@nx/enforce-module-boundaries` lint checks and verify boundaries.
* **AI Challenge & Review Prompt:**
  > "Audit my Nx monorepo library dependency graph. Show how to configure module boundary tags in `.eslintrc.json` to prevent architectural leakage between features and shared libraries."
* **Interview Check:** *What are the architectural advantages of Domain-Driven Design in enterprise frontend monorepos, and how do you enforce them automatically?*

---

### Stage 3.10: Enterprise Testing Strategy & Component Test Harnesses
* **Concepts:**
  - Component Test Harnesses (`@angular/cdk/testing`) for stable, decoupled test selectors.
  - End-to-End (E2E) testing with Playwright.
  - Visual regression and integration testing across critical paths.
* **Hands-on Task:** Build a Component Test Harness for `ServerNodeCardComponent`. Write a Playwright E2E test covering the full user flow: login -> filter fleet -> triage incident -> acknowledge alert.
* **Testing:** Run full Playwright test suite in headless mode.
* **AI Challenge & Review Prompt:**
  > "Review my Component Test Harness and Playwright E2E spec. Why are CDK Test Harnesses superior to raw `fixture.debugElement.query(By.css(...))` selectors in long-term enterprise test maintenance?"
* **Interview Check:** *How do Component Test Harnesses decouple unit tests from DOM implementation details?*
