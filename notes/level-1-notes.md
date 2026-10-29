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
