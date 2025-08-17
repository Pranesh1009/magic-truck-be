-- CreateTable
CREATE TABLE "public"."business_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."business_dealers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "gst" TEXT NOT NULL,
    "gst_doc" TEXT NOT NULL,
    "other_doc" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "identity_doc" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessTypeId" TEXT NOT NULL,

    CONSTRAINT "business_dealers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."shipment_details" (
    "id" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "pickupAddress" TEXT NOT NULL,
    "pickupLocation" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dropAddress" TEXT NOT NULL,
    "dropLocation" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "commodity" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "specialInstructions" TEXT NOT NULL,
    "pickupContactName" TEXT NOT NULL,
    "pickupContactNumber" TEXT NOT NULL,
    "dropContactName" TEXT NOT NULL,
    "dropContactNumber" TEXT NOT NULL,
    "addOns" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "pickupDate" TIMESTAMP(3),
    "dropDate" TIMESTAMP(3),
    "pickupTime" TEXT,
    "dropTime" TEXT,
    "truckOption" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipment_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "business_types_id_idx" ON "public"."business_types"("id");

-- CreateIndex
CREATE UNIQUE INDEX "business_dealers_email_key" ON "public"."business_dealers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "business_dealers_phoneNumber_key" ON "public"."business_dealers"("phoneNumber");

-- CreateIndex
CREATE INDEX "business_dealers_id_idx" ON "public"."business_dealers"("id");

-- CreateIndex
CREATE INDEX "business_dealers_businessTypeId_idx" ON "public"."business_dealers"("businessTypeId");

-- CreateIndex
CREATE INDEX "shipment_details_id_idx" ON "public"."shipment_details"("id");

-- AddForeignKey
ALTER TABLE "public"."business_dealers" ADD CONSTRAINT "business_dealers_businessTypeId_fkey" FOREIGN KEY ("businessTypeId") REFERENCES "public"."business_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
