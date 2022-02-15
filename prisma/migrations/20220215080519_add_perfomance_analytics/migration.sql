-- CreateTable
CREATE TABLE "PerfomanceAnalytic" (
    "id" SERIAL NOT NULL,
    "operationName" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "variables" TEXT NOT NULL,
    "time" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerfomanceAnalytic_pkey" PRIMARY KEY ("id")
);
