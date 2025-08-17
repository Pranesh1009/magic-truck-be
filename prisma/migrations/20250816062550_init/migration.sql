-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "aadharNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."truckOwner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "aadharNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "GSTIN" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "truckOwner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_emailId_key" ON "public"."Customer"("emailId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_aadharNumber_key" ON "public"."Customer"("aadharNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phoneNumber_key" ON "public"."Customer"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "truckOwner_emailId_key" ON "public"."truckOwner"("emailId");

-- CreateIndex
CREATE UNIQUE INDEX "truckOwner_aadharNumber_key" ON "public"."truckOwner"("aadharNumber");

-- CreateIndex
CREATE UNIQUE INDEX "truckOwner_phoneNumber_key" ON "public"."truckOwner"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "truckOwner_GSTIN_key" ON "public"."truckOwner"("GSTIN");

-- CreateIndex
CREATE INDEX "Role_id_idx" ON "public"."Role"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phoneNumber_key" ON "public"."Users"("phoneNumber");

-- CreateIndex
CREATE INDEX "Users_id_idx" ON "public"."Users"("id");

-- CreateIndex
CREATE INDEX "Users_roleId_idx" ON "public"."Users"("roleId");

-- AddForeignKey
ALTER TABLE "public"."Users" ADD CONSTRAINT "Users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
