import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma";

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/retail_erp";

const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

const organizationSeed = {
  code: "MAIN",
  name: "Main Organization",
  baseCurrencyCode: "USD",
  timeZone: "Africa/Cairo",
};

const branchSeed = {
  code: "MAIN",
  name: "Main Branch",
};

const warehouseSeed = {
  code: "MAIN-WH",
  name: "Main Warehouse",
};

const accountsSeed = [
  {
    code: "1000",
    name: "Cash",
    type: "ASSET",
    normalBalance: "DEBIT",
  },
  {
    code: "1010",
    name: "Bank",
    type: "ASSET",
    normalBalance: "DEBIT",
  },
  {
    code: "1200",
    name: "Inventory",
    type: "ASSET",
    normalBalance: "DEBIT",
  },
  {
    code: "4000",
    name: "Sales Revenue",
    type: "REVENUE",
    normalBalance: "CREDIT",
  },
  {
    code: "5000",
    name: "Cost of Goods Sold",
    type: "COST_OF_SALES",
    normalBalance: "DEBIT",
  },
  {
    code: "2000",
    name: "Accounts Payable",
    type: "LIABILITY",
    normalBalance: "CREDIT",
  },
] as const;

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@123";
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@retail.local";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await db.$transaction(async (tx) => {
    const organization = await tx.organization.upsert({
      where: {
        code: organizationSeed.code,
      },
      update: {
        name: organizationSeed.name,
        baseCurrencyCode: organizationSeed.baseCurrencyCode,
        timeZone: organizationSeed.timeZone,
        isActive: true,
      },
      create: {
        ...organizationSeed,
        isActive: true,
      },
    });

    const branch = await tx.branch.upsert({
      where: {
        organizationId_code: {
          organizationId: organization.id,
          code: branchSeed.code,
        },
      },
      update: {
        name: branchSeed.name,
        status: "ACTIVE",
      },
      create: {
        organizationId: organization.id,
        code: branchSeed.code,
        name: branchSeed.name,
        status: "ACTIVE",
        isHeadOffice: true,
      },
    });

    await tx.warehouse.upsert({
      where: {
        branchId_code: {
          branchId: branch.id,
          code: warehouseSeed.code,
        },
      },
      update: {
        name: warehouseSeed.name,
        isActive: true,
      },
      create: {
        branchId: branch.id,
        code: warehouseSeed.code,
        name: warehouseSeed.name,
        type: "STOCKROOM",
        isActive: true,
      },
    });

    const accounts = new Map<string, { id: string; name: string }>();

    for (const accountSeed of accountsSeed) {
      const account = await tx.account.upsert({
        where: {
          organizationId_code: {
            organizationId: organization.id,
            code: accountSeed.code,
          },
        },
        update: {
          name: accountSeed.name,
          type: accountSeed.type,
          normalBalance: accountSeed.normalBalance,
          isPosting: true,
          allowManualEntries: true,
          isActive: true,
        },
        create: {
          organizationId: organization.id,
          code: accountSeed.code,
          name: accountSeed.name,
          type: accountSeed.type,
          normalBalance: accountSeed.normalBalance,
          isPosting: true,
          allowManualEntries: true,
          isActive: true,
        },
      });

      accounts.set(account.name, {
        id: account.id,
        name: account.name,
      });
    }

    const cashAccount = accounts.get("Cash");
    const bankAccount = accounts.get("Bank");

    if (!cashAccount || !bankAccount) {
      throw new Error("Required payment accounts were not created.");
    }

    await tx.paymentMethod.upsert({
      where: {
        organizationId_code: {
          organizationId: organization.id,
          code: "CASH",
        },
      },
      update: {
        name: "Cash",
        type: "CASH",
        accountId: cashAccount.id,
        allowChange: true,
        isActive: true,
      },
      create: {
        organizationId: organization.id,
        code: "CASH",
        name: "Cash",
        type: "CASH",
        accountId: cashAccount.id,
        allowChange: true,
        isActive: true,
      },
    });

    await tx.paymentMethod.upsert({
      where: {
        organizationId_code: {
          organizationId: organization.id,
          code: "CARD",
        },
      },
      update: {
        name: "Card",
        type: "CARD",
        accountId: bankAccount.id,
        isActive: true,
      },
      create: {
        organizationId: organization.id,
        code: "CARD",
        name: "Card",
        type: "CARD",
        accountId: bankAccount.id,
        isActive: true,
      },
    });

    await tx.paymentMethod.upsert({
      where: {
        organizationId_code: {
          organizationId: organization.id,
          code: "MOBILE_MONEY",
        },
      },
      update: {
        name: "Mobile Money",
        type: "MOBILE_WALLET",
        accountId: bankAccount.id,
        isActive: true,
      },
      create: {
        organizationId: organization.id,
        code: "MOBILE_MONEY",
        name: "Mobile Money",
        type: "MOBILE_WALLET",
        accountId: bankAccount.id,
        isActive: true,
      },
    });

    await tx.user.upsert({
      where: {
        email: adminEmail,
      },
      update: {
        organizationId: organization.id,
        fullName: "Admin",
        passwordHash,
        status: "ACTIVE",
      },
      create: {
        organizationId: organization.id,
        fullName: "Admin",
        email: adminEmail,
        passwordHash,
        status: "ACTIVE",
      },
    });
  });

  console.log("Seed completed successfully.");
  console.log(`Admin email: ${process.env.ADMIN_EMAIL ?? "admin@retail.local"}`);
  console.log(`Admin password: ${process.env.ADMIN_PASSWORD ?? "Admin@123"}`);
}

main()
  .catch((error) => {
    console.error("Seed failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
