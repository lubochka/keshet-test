-- CreateTable
CREATE TABLE "Invoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "client" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL
);
