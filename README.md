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

## Project structure

```
src/
├── components/
│   ├── layout/      # App shell: sidebar, header, mobile menu
│   └── ui/          # shadcn/ui components
├── lib/             # Small shared helpers
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
