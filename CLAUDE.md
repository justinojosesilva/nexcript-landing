# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- **Dev server:** `pnpm dev` (http://localhost:3000)
- **Build:** `pnpm build`
- **Lint:** `pnpm lint` (ESLint 9 flat config with next/core-web-vitals + next/typescript)

Package manager is **pnpm**.

## Architecture

Next.js 16 App Router project using React 19, TypeScript (strict), and Tailwind CSS v4.

- `app/` — App Router: `layout.tsx` (root layout with Geist fonts), `page.tsx` (home page), `globals.css`
- `@/*` path alias maps to project root (configured in tsconfig.json)
- Tailwind CSS v4 via `@tailwindcss/postcss` (PostCSS plugin, no tailwind.config file)
- No test framework configured yet

## Key Constraints

- **Next.js 16 has breaking changes.** Always read the relevant guide in `node_modules/next/dist/docs/` before writing any Next.js code. Do not rely on training data for Next.js APIs.
