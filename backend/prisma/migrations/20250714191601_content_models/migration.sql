-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" REAL,
    "rating" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StoreLocation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AboutPage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "heroImage" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "stats" TEXT NOT NULL,
    "manufacturingExcellence" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TeamProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "aboutPageId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    CONSTRAINT "TeamProfile_aboutPageId_fkey" FOREIGN KEY ("aboutPageId") REFERENCES "AboutPage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DistributorPage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "infoSections" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "supportServices" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DistributorStory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "distributorPageId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    CONSTRAINT "DistributorStory_distributorPageId_fkey" FOREIGN KEY ("distributorPageId") REFERENCES "DistributorPage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
