# Retail System

Retail ERP foundation built for:

- Multi-branch operations
- POS with cashier shifts
- Inventory with Weighted Average Cost support
- Double-entry accounting

This repository currently contains the data model and initialization layer, not a full application UI yet.

## Tech Stack

- Next.js App Router
- Prisma ORM 7
- PostgreSQL 16
- Docker Compose

## Current Scope

Implemented in this repo:

- Full Prisma schema for the ERP core
- Prisma Client generation setup
- PostgreSQL Docker setup
- Prisma singleton DB wrapper for Next.js
- Seed script for master data
- Project documentation and handoff notes

Not implemented yet:

- Next.js pages and layouts
- Authentication flow
- API routes / server actions
- POS transaction services
- Inventory posting logic
- Accounting posting services
- Reporting screens

## Important Files

- [prisma/schema.prisma](/d:/Programming/Retail%20System/prisma/schema.prisma)
- [prisma/seed.ts](/d:/Programming/Retail%20System/prisma/seed.ts)
- [src/lib/db.ts](/d:/Programming/Retail%20System/src/lib/db.ts)
- [prisma.config.ts](/d:/Programming/Retail%20System/prisma.config.ts)
- [docker-compose.yml](/d:/Programming/Retail%20System/docker-compose.yml)
- [PROJECT_SETUP.md](/d:/Programming/Retail%20System/PROJECT_SETUP.md)
- [HANDOFF.md](/d:/Programming/Retail%20System/HANDOFF.md)

## Local Setup

1. Install dependencies:

```powershell
npm install
```

2. Start PostgreSQL:

```powershell
docker compose up -d
```

3. Apply the Prisma schema:

```powershell
npx prisma db push
```

4. Seed master data:

```powershell
npx prisma db seed
```

## Environment

Create `.env` from `.env.example` or use the current Docker values:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/retail_erp"
JWT_SECRET="replace-with-a-long-random-secret"
```

Optional seed overrides:

```env
ADMIN_EMAIL="admin@retail.local"
ADMIN_PASSWORD="Admin@123"
```

## Seeded Data

The seed creates:

- `Main Organization`
- `Main Branch`
- `Main Warehouse`
- Accounts:
  - Cash
  - Bank
  - Inventory
  - Sales Revenue
  - Cost of Goods Sold
  - Accounts Payable
- Payment methods:
  - Cash
  - Card
  - Mobile Money
- Admin user:
  - email: `admin@retail.local`
  - password: `Admin@123`

## Notes for the Next Developer

- This project uses Prisma 7, so runtime DB access is adapter-based with `@prisma/adapter-pg`.
- Prisma client output is generated to `src/generated/prisma`.
- `Sale.posShiftId` is required, but "shift must be open" still needs application-level enforcement.
- Weighted Average Cost posting logic is not implemented yet; only the schema support is in place.
- Journal posting logic is not implemented yet; only the accounting schema is in place.

## Repository

GitHub:

- `https://github.com/AbdelrahmanMAmin/Retail-System`
