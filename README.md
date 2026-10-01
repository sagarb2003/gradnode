# GradNode

A Student Portal and Admin Panel built with React and TypeScript.

> This is a portfolio project. It was built to practise and show modern React
> skills. It is not a real product or client project.

## Features

**Admin Panel**

- Dashboard with student statistics, recent students and top universities
- Student table with search, status filter and pagination
- Student details page
- Create and edit students with validated forms

**Student Portal**

- Dashboard with assignments, application status and notifications
- Courses and program information
- Profile page
- Multi-step application form with step-by-step validation. Your progress is
  saved, so a page refresh doesn't lose your answers.

**Across the app**

- Responsive layout with a mobile navigation menu
- Loading, error and empty states
- Accessible forms (labels, inline errors, `aria-invalid`) and a skip link
- Pages are lazy-loaded, so each portal only downloads the code it needs

## Tech stack

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [React Router](https://reactrouter.com)
- [TanStack Query](https://tanstack.com/query) for fetching and caching data
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) for forms and validation
- [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/react) for unit and component tests
- [Playwright](https://playwright.dev) for end-to-end tests
- ESLint + Prettier

## Getting started

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Scripts

| Command              | What it does                          |
| -------------------- | ------------------------------------- |
| `npm run dev`        | Start the dev server                  |
| `npm run build`      | Type-check and build for production   |
| `npm run preview`    | Preview the production build          |
| `npm run lint`       | Run ESLint                            |
| `npm run typecheck`  | Run the TypeScript compiler           |
| `npm run format`     | Format all files with Prettier        |
| `npm test`           | Run the unit and component tests once |
| `npm run test:watch` | Run the tests in watch mode           |
| `npm run test:e2e`   | Run the Playwright end-to-end tests   |

## Testing

**Unit and component tests** (Vitest + React Testing Library) live next to the
code they test (`*.test.ts(x)`). They cover:

- Application form: step validation, step navigation, saving and restoring
  progress, the review step, and submission (success and failure)
- Creating and editing students, including form validation
- Student table: search, status filter, pagination, and empty and error states
- Admin dashboard: statistics, recent students, and the error state
- The localStorage helpers and the API update logic

`fetch` is mocked in these tests, so they don't call the real API.

**End-to-end test** (Playwright) in `e2e/`: a student fills in the whole
application, refreshes the page halfway through, submits, and sees the new
status on their dashboard. It runs against the production build, with the API
mocked.

The first time you run the e2e tests, install the browser:

```bash
npx playwright install chromium
```

## Mock API

There is no real backend. Student data comes from the free
[DummyJSON](https://dummyjson.com/docs/users) `users` API, so no API key is needed.

- **Student status:** DummyJSON users don't have an enrolment status. We give
  each student a fixed status (`active`, `pending` or `graduated`) based on
  their id, in `src/api/students.ts`.
- **Saving changes:** DummyJSON accepts create and update requests but **does
  not save them**. After a successful request, the app updates the TanStack
  Query cache, so your changes stay visible while you use the app. They reset
  when you reload the page.
- **Signed-in student:** the Student Portal shows DummyJSON user #1.
- **Courses and assignments:** DummyJSON has none, so these come from static
  demo data in `src/data/demoCourses.ts`.

## Application form

`/student/apply` is a multi-step form: Personal → Education → Program →
Additional → Review → Submit. Each step is validated before you can move on.

Your answers and current step are saved to `localStorage` as you type
(`src/lib/applicationStorage.ts`), so a refresh doesn't lose your progress.
The draft is cleared after a successful submission.

## Project structure

```
src/
├── api/             # API client, types and TanStack Query hooks
├── components/
│   ├── application/ # Multi-step application form (steps, schema)
│   ├── layout/      # App shell: sidebar, header, mobile menu
│   └── ui/          # shadcn/ui components
├── data/            # Static demo data (courses, assignments)
├── lib/             # Small shared helpers (e.g. localStorage)
├── pages/
│   ├── admin/       # Admin panel pages
│   └── student/     # Student portal pages
├── test/            # Test setup and helpers
├── App.tsx          # Routes
└── main.tsx         # Entry point
e2e/                 # Playwright end-to-end tests
```

## Routes

| Path                       | Page                |
| -------------------------- | ------------------- |
| `/`                        | Choose a portal     |
| `/admin`                   | Admin dashboard     |
| `/admin/students`          | Student list        |
| `/admin/students/new`      | Add a student       |
| `/admin/students/:id`      | Student details     |
| `/admin/students/:id/edit` | Edit a student      |
| `/student`                 | Student dashboard   |
| `/student/courses`         | Program and courses |
| `/student/profile`         | Student profile     |
| `/student/apply`           | Application form    |

## CI and deployment

- **CI:** GitHub Actions (`.github/workflows/ci.yml`) runs lint, type-check,
  unit tests, build and the Playwright tests on every pull request.
- **Deployment:** the app is a static site. `vercel.json` sends every route to
  `index.html` so client-side routing works on refresh. To deploy on Vercel,
  import the repository; the defaults work: build command `npm run build`,
  output directory `dist`.
