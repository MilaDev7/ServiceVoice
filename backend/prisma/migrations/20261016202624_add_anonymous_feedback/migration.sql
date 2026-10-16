-- CreateTable
CREATE TABLE "AnonymousFeedback" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT,
    "woredaId" TEXT,
    "feedbackType" TEXT NOT NULL DEFAULT 'other',
    "content" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'am',
    "audioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnonymousFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnonymousFeedback_serviceId_idx" ON "AnonymousFeedback"("serviceId");

-- CreateIndex
CREATE INDEX "AnonymousFeedback_feedbackType_idx" ON "AnonymousFeedback"("feedbackType");

-- CreateIndex
CREATE INDEX "AnonymousFeedback_createdAt_idx" ON "AnonymousFeedback"("createdAt");
