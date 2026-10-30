# Level 1 Notes — Modern Production Developer

---

## Stage 1.1 — Project Skeleton & Bootstrapping

### What we did
- Ran the Angular CLI → got a blank Angular 22 app. Nothing of ours in it yet.

### Folder map

```
HyperScale/
├── plan.md                 ← our roadmap (untouched)
├── package.json            ← dependencies + npm scripts (start, build, test)
├── package-lock.json       ← exact installed versions
├── angular.json            ← workspace config: build/serve/test targets, styles, assets
├── tsconfig.json           ← base TypeScript settings (strict mode on)
├── tsconfig.app.json       ← TS settings for the app build
├── tsconfig.spec.json      ← TS settings for tests
├── .editorconfig / .prettierrc   ← formatting rules
├── .gitignore
├── .vscode/                ← recommended extensions, debug + task configs
├── public/
│   └── favicon.ico         ← static files copied as-is into the build
├── node_modules/           ← installed packages (git-ignored)
└── src/
    ├── index.html          ← the single HTML page; <app-root> lives here
    ├── main.ts             ← entry point: bootstrapApplication(App, appConfig)
    ├── styles.scss         ← global styles
    └── app/
        ├── app.ts          ← root component (class App, selector app-root)
        ├── app.html        ← root template (currently the big welcome page)
        ├── app.scss        ← root component styles (empty)
        ├── app.spec.ts     ← Vitest test for the root component
        ├── app.config.ts   ← app-wide providers (router, error listeners)
        └── app.routes.ts   ← route table (empty for now)
```

### Key points
- **main.ts** is the ignition key: it boots the App component with the settings from app.config.
- **index.html** is the only HTML page. Angular takes over the app-root tag.
- **app.config.ts** is where app-wide stuff plugs in (router now, HTTP and others later).
- **angular.json** is the CLI's control panel: how to build, serve and test.

### Different from old Angular
- **No zone.js:** zoneless is the default now, and signals tell Angular what changed.
- **No NgModules**, and no "standalone: true" (it's the default).
- **Short names:** app.ts / App, not app.component.ts / AppComponent.
- **Vitest** instead of Karma/Jasmine.

### The app shell (what we built)
- The CLI's welcome page is gone. The app is now a **shell**: navbar on top, sidebar on the left, pages on the right.
- **Navbar** and **Sidebar** are their own components in app/layout/. The root App just arranges them with CSS grid.
- Pages will render inside the **router-outlet** in main. For now it shows a placeholder.
- On phones the sidebar becomes a horizontal strip under the navbar.
- The sidebar links are just text for now. They become real links in Stage 1.7.

### Theme variables
- All colours, spacing, fonts and sizes live once in styles.scss as CSS variables (the --hs-… names).
- Components use the variables instead of hard-coded colours, so changing the theme means changing one file.
- Dark mode is automatic: it follows the OS setting and just swaps the variable values.

### HTTP setup
- provideHttpClient() is in app.config. That's where interceptors go later (Stage 2.7).
- Heads up: **withFetch() is deprecated in v22** because fetch is the default now. Older tutorials still show it.

### Gotcha we hit
- Mocks start *before* Angular boots, so the app waits for MSW to say it's ready.
- If a page ever stays blank in dev, check the console for the "[MSW] Mocking enabled" message first.
