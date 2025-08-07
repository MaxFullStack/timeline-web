# Timeline Web

Interactive timeline visualisation built with **Next.js** and **Tailwind CSS**.

---

\## Overview

Timeline Web lets you display tasks along a date axis with lane‑based collision avoidance, zoom controls and in‑place editing.

* Responsive, accessible layout
* Smart lane assignment — no overlaps
* Zoom 100 % → 800 % with hard minimum of 100 %
* Keyboard‑friendly editing and tooltip summaries
* 100 % passing test‑suite (unit + integration)

---

\## Tech Stack

| Layer      | Stack                                      |
| ---------- | ------------------------------------------ |
| Framework  | [Next.js 14](https://nextjs.org/)          |
| Styling    | [Tailwind CSS](https://tailwindcss.com)    |
| State/Test | React Hooks · [Vitest](https://vitest.dev) |
| E2E        | [Playwright](https://playwright.dev)       |

---

\## Getting Started

```bash
# install
npm install

# dev server
npm run dev

# production build
npm run build
npm start
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

\## Available Scripts

| Command           | Purpose                                    |
| ----------------- | ------------------------------------------ |
| `dev`             | Run Next.js in development mode            |
| `build` / `start` | Production bundle & server                 |
| `lint`            | ESLint static analysis                     |
| `typecheck`       | TypeScript type‑only check                 |
| `test`            | Headless unit + integration tests (Vitest) |
| `test:ui`         | Vitest interactive UI                      |
| `test:coverage`   | Coverage report in `coverage/`             |
| `test:e2e`        | Playwright end‑to‑end tests                |
| `test:e2e:ui`     | Playwright UI mode                         |

---

\## Tests

**46 tests in 6 files** — all passing.

```bash
npm test           # run Jest‑style tests with Vitest
npm run test:ui    # interactive mode
npm run test:coverage   # generate coverage report
```

| Suite Category | File                            | Cases |
| -------------- | ------------------------------- | ----: |
| Components     | `timeline.test.tsx`             |     3 |
| Integration    | `timeline‑integration.test.tsx` |    11 |
| Timeline Item  | `timeline‑item.test.ts`         |    12 |
| Data           | `timeline‑items.test.ts`        |     9 |
| Lane Logic     | `assign‑lanes.test.ts`          |     5 |
| Colour Utils   | `colour‑utils.test.ts`          |     6 |

\### Assertions

* Empty and populated timelines render correctly
* Items are placed in lanes without overlaps
* Zoom controls obey min 100 % / max 800 %
* Item / lane / day counters and date range are accurate

---

\## Deployment

The project is deployment‑ready for **Vercel**:

1. Click **“Deploy to Vercel”** (or import the repository manually)
2. Ensure `NODE_VERSION` in **package.json** matches Vercel’s setting
3. Done — each push to `main` triggers a production build

---

\## Contributing

Pull requests are welcome! Please open an issue first to discuss any major changes.

1. Fork the repo & create your branch
2. `npm install && npm test`
3. Commit your changes (`git commit -am 'feat: add xyz'`)
4. Push to the branch & open a PR

---

\## License

[MIT](LICENSE)
