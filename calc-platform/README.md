# Calculator Platform

Minimal monorepo calculator platform using pnpm + turbo.

## Structure

- `apps/frontend`: React + Vite + TypeScript client
- `apps/backend`: NestJS + Prisma API
- `packages/shared`: shared package placeholder
- `prisma`: Prisma schema and local env template

## Run locally

### A) Prototype mode (no DB persistence required)

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start backend:

   ```bash
   pnpm --filter backend dev
   ```

3. Start frontend:

   ```bash
   pnpm --filter frontend dev
   ```

### B) Optional Prisma local persistence setup

1. Generate Prisma client:

   ```bash
   pnpm prisma:generate
   ```

2. Push schema to local database:

   ```bash
   pnpm prisma:push
   ```

Frontend: http://localhost:5173
Backend: http://localhost:3000

## API

- `POST /calculations` with `{ expression, result }`
- `GET /calculations` returns latest 20 entries
- `GET /calculations/:id`
- `DELETE /calculations`
