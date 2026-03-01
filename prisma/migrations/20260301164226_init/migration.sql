-- CreateTable
CREATE TABLE "lunch_records" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "amount" INTEGER NOT NULL,
    "memo" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lunch_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" SERIAL NOT NULL,
    "monthly_budget" INTEGER NOT NULL DEFAULT 200000,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
