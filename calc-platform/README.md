# Calculator Platform

Minimal monorepo calculator platform using pnpm + turbo.

## Structure

- `apps/frontend`: React + Vite + TypeScript client
- `apps/backend`: NestJS + Prisma API
- `packages/shared`: shared package placeholder
- `prisma`: Prisma schema and local env template

## Run locally

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Generate Prisma client:

   ```bash
   pnpm prisma:generate
   ```

3. Create local SQLite DB/migrations:

   ```bash
   pnpm prisma:migrate
   ```

4. Start both apps:

   ```bash
   pnpm dev
   ```

Frontend: http://localhost:5173
Backend: http://localhost:3000

## API

- `POST /calculations` with `{ expression, result }`
- `GET /calculations` returns latest 20 entries
- `GET /calculations/:id`
- `DELETE /calculations`
