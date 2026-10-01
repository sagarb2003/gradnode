# GradNode

A Student Portal and Admin Panel built with React and TypeScript.

> This is a portfolio project. It was built to practise and show modern React
> skills. It is not a real product or client project.

## Tech stack

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [React Router](https://reactrouter.com)
- [TanStack Query](https://tanstack.com/query) for fetching and caching data
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) for forms and validation
- ESLint + Prettier

## Getting started

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Scripts

| Command             | What it does                        |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Start the dev server                |
| `npm run build`     | Type-check and build for production |
| `npm run preview`   | Preview the production build        |
| `npm run lint`      | Run ESLint                          |
| `npm run typecheck` | Run the TypeScript compiler         |
| `npm run format`    | Format all files with Prettier      |

## Mock API

There is no real backend. Student data comes from the free
[DummyJSON](https://dummyjson.com/docs/users) `users` API, so no API key is needed.

DummyJSON users don't have an enrolment status. We derive a fixed status
(`active`, `pending` or `graduated`) from each user's id in `src/api/students.ts`.

DummyJSON accepts create and update requests but **does not save them**. After a
successful request, the app updates the TanStack Query cache, so your changes
stay visible while you use the app. They reset when you reload the page.

The Student Portal shows DummyJSON user #1 as the signed-in student. DummyJSON has
no courses or assignments, so those come from static demo data in
`src/data/demoCourses.ts`.

## Application form

`/student/apply` is a multi-step form: Personal → Education → Program →
Additional → Review → Submit. Each step is validated before you can move on.

Your answers and current step are saved to `localStorage` as you type
(`src/lib/applicationStorage.ts`), so a refresh doesn't lose your progress.
The draft is cleared after a successful submission.

## Project structure

```
src/
├── api/             # API client, types and query hooks
├── components/
│   ├── application/ # Multi-step application form (steps, schema)
│   ├── layout/      # App shell: sidebar, header, mobile menu
│   └── ui/          # shadcn/ui components
├── data/            # Static demo data (courses, assignments)
├── lib/             # Small shared helpers (e.g. localStorage)
├── pages/
│   ├── admin/       # Admin panel pages
│   └── student/     # Student portal pages
├── App.tsx          # Routes
└── main.tsx         # Entry point
```

## Routes

| Path              | Page               |
| ----------------- | ------------------ |
| `/`               | Choose a portal    |
| `/admin`          | Admin dashboard    |
| `/admin/students` | Student management |
| `/student`        | Student dashboard  |
| `/student/apply`  | Application form   |
