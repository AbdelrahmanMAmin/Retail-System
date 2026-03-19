# Handoff

## Project State

This repository is currently a backend/data foundation for a Retail ERP system. The main work completed so far is the database architecture, Prisma integration, local infrastructure setup, and master data seeding.

The project is not yet a working ERP application. There are no real UI screens, auth flows, transaction services, or report pages implemented yet.

## What Has Been Completed

### Data Model

The Prisma schema supports:

- Multi-branch organizations
- Warehouses
- Users and branch-scoped roles
- POS registers and shifts
- Sales, sale lines, and sale payments
- Purchase receipts
- Inventory balances and inventory movement ledger
- Stock transfers
- Stock adjustments
- Chart of accounts
- Fiscal periods
- Journal entries and journal lines
- Product/category accounting profiles
- Document sequencing
- Outbox events

### Required Design Decisions Already Applied

- All money and quantity fields use `Decimal`
- `InventoryMovement` includes `sourceType` and `sourceId`
- `JournalLine` includes `branchId`
- `Sale` requires `posShiftId`
- `InventoryBalance` includes `stockValue`

### Runtime Setup

- Prisma 7 client generation is configured
- Prisma client is generated into `src/generated/prisma`
- DB runtime wrapper exists in `src/lib/db.ts`
- PostgreSQL adapter is used via `@prisma/adapter-pg`

### Local Infrastructure

- `docker-compose.yml` created for PostgreSQL 16
- `.env.example` created
- `.env` created for local Docker DB

### Seed Data

The seed creates:

- `Main Organization`
- `Main Branch`
- `Main Warehouse`
- Chart of accounts:
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
- Admin user with bcrypt-hashed password

## Files To Know First

- [README.md](/d:/Programming/Retail%20System/README.md)
- [PROJECT_SETUP.md](/d:/Programming/Retail%20System/PROJECT_SETUP.md)
- [prisma/schema.prisma](/d:/Programming/Retail%20System/prisma/schema.prisma)
- [prisma/seed.ts](/d:/Programming/Retail%20System/prisma/seed.ts)
- [src/lib/db.ts](/d:/Programming/Retail%20System/src/lib/db.ts)
- [prisma.config.ts](/d:/Programming/Retail%20System/prisma.config.ts)
- [docker-compose.yml](/d:/Programming/Retail%20System/docker-compose.yml)
- [package.json](/d:/Programming/Retail%20System/package.json)

## Known Gaps

These parts are not built yet:

- Next.js app structure and pages
- Auth implementation
- JWT handling
- Role enforcement middleware
- API routes / server actions
- Sale posting service
- Inventory posting service
- Accounting journal posting service
- Reporting queries
- Test suite
- Migrations history

## Important Implementation Notes

### Prisma 7

This project is on Prisma 7, so do not assume older Prisma patterns.

Important details:

- `prisma.config.ts` is required
- Runtime uses an adapter, not just a datasource URL inside the Prisma client
- Generated client lives in `src/generated/prisma`

### Database Initialization

Current recommended DB bootstrap commands:

```powershell
docker compose up -d
npx prisma db push
npx prisma db seed
```

`db push` is being used right now because proper migrations have not been established yet.

### Business Logic Still Needed

Schema support exists, but application logic still needs to be implemented for:

- Open-shift validation before sales
- Stock movement creation from sales, purchases, transfers, and adjustments
- Weighted Average Cost recalculation rules
- Journal posting from business transactions
- Branch-level reporting

## Recommended Next Steps

1. Verify local Docker/PostgreSQL setup works on the next machine.
2. Run `npx prisma db push`.
3. Run `npx prisma db seed`.
4. Add a base Next.js app structure.
5. Add authentication and role enforcement.
6. Implement services in this order:
   - POS sale posting
   - Inventory movement posting
   - Accounting journal posting
7. Add tests around posting and costing logic.
8. Replace `db push` workflow with proper migrations.

## Risk Areas

- Prisma 7 compatibility can confuse developers expecting Prisma 5/6 patterns.
- Weighted Average Cost should not be implemented casually; inventory value consistency matters.
- POS posting, stock movement, and journal creation should be wrapped in a single transaction.
- The seed creates base operational data, but not a complete production-ready chart of accounts.

## GitHub

Repository:

- `https://github.com/AbdelrahmanMAmin/Retail-System`
