# Retail ERP System Setup

## Overview

This project is a Retail ERP foundation built with:

- Next.js App Router
- Prisma ORM
- PostgreSQL

Core functional areas included in the design:

- Multi-branch operations
- POS with cashier shifts
- Inventory with Weighted Average Cost support
- Double-entry accounting

## Files Created

### Database and Prisma

- `prisma/schema.prisma`
- `prisma/seed.ts`
- `prisma.config.ts`
- `src/generated/prisma/*`

### Application Runtime

- `src/lib/db.ts`

### Environment and Local Infrastructure

- `.env.example`
- `.env`
- `docker-compose.yml`
- `README.md`
- `HANDOFF.md`

## Prisma Schema Design

### Multi-Branch

The schema supports branch-aware operations using:

- `Organization`
- `Branch`
- `Warehouse`
- `UserRoleAssignment`

Most operational records are branch-scoped for reporting and access control.

### POS

POS is modeled with:

- `PosRegister`
- `PosShift`
- `Sale`
- `SaleLine`
- `SalePayment`

Important rule:

- `Sale.posShiftId` is required, so every sale is linked to a shift.
- The "shift must be open" rule is still enforced in application logic, not directly in Prisma schema.

### Inventory

Inventory is modeled with:

- `InventoryBalance`
- `InventoryMovement`
- `StockTransfer`
- `StockTransferLine`
- `StockAdjustment`
- `StockAdjustmentLine`

Weighted Average Cost support is represented by:

- `InventoryBalance.avgCost`
- `InventoryBalance.stockValue`
- `InventoryMovement.unitCost`
- `InventoryMovement.totalCost`
- `InventoryMovement.balanceAfterQty`
- `InventoryMovement.balanceAfterValue`

Audit support is represented by:

- `InventoryMovement.sourceType`
- `InventoryMovement.sourceId`

### Accounting

Double-entry accounting is modeled with:

- `Account`
- `FiscalPeriod`
- `JournalEntry`
- `JournalLine`
- `CategoryAccountingProfile`
- `ProductAccountingProfile`

Branch-level P&L support is represented by:

- `JournalLine.branchId`

### Decimal Usage

All money and quantity fields were modeled with `Decimal`. No `Float` fields are used in the schema.

## Prisma 7 Setup Notes

This project currently uses Prisma 7, which required a couple of setup differences:

- `prisma.config.ts` is used
- Prisma client is generated into `src/generated/prisma`
- The datasource URL is configured in `prisma.config.ts`
- Runtime database access uses the PostgreSQL driver adapter `@prisma/adapter-pg`

## Prisma Client Wrapper

File:

- `src/lib/db.ts`

What it does:

- Exports a singleton `db`
- Uses the Next.js global caching pattern
- Prevents exhausting connections during hot reload in development

## Seed Script

File:

- `prisma/seed.ts`

The seed script is idempotent and creates:

- Organization: `Main Organization`
- Branch: `Main Branch`
- Warehouse: `Main Warehouse`
- Accounts:
  - Cash
  - Bank
  - Inventory
  - Sales Revenue
  - Cost of Goods Sold
  - Accounts Payable
- Payment Methods:
  - Cash
  - Card
  - Mobile Money
- Admin user:
  - name: `Admin`
  - email default: `admin@retail.local`
  - password default: `Admin@123`

The admin password is hashed using `bcryptjs`.

Optional environment overrides supported by the seed:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Environment Files

### `.env.example`

Contains:

- `DATABASE_URL`
- `JWT_SECRET`

### `.env`

Configured for the Docker PostgreSQL setup:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/retail_erp"
JWT_SECRET="replace-with-a-long-random-secret"
```

## Docker Setup

File:

- `docker-compose.yml`

PostgreSQL container configuration:

- Image: `postgres:16`
- Database: `retail_erp`
- User: `postgres`
- Password: `postgres`
- Port mapping: `5432:5432`

## Commands To Run

Start PostgreSQL:

```powershell
docker compose up -d
```

Push schema to the database:

```powershell
npx prisma db push
```

Run the master seed:

```powershell
npx prisma db seed
```

## Current Status

Completed:

- Prisma schema created
- Prisma client generated
- Prisma DB wrapper created
- Environment files created
- Docker compose file created
- Seed script created
- Seed dependencies installed
- Root README created
- Developer handoff document created
- Repository pushed to GitHub

Blocked in this environment:

- `docker compose up -d` could not be run because `docker` is not installed or not available on the PATH in this machine
- Because PostgreSQL was not running, `npx prisma db seed` previously failed with `ECONNREFUSED`

## Next Recommended Step

Once Docker is installed and available, run:

```powershell
docker compose up -d
npx prisma db push
npx prisma db seed
```

After that, the database should be live and seeded with the base ERP master data.

## Handoff Docs

For the next developer, start here:

- `README.md`
- `HANDOFF.md`
- `PROJECT_SETUP.md`
