-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('IDENTITY', 'VITAL_RECORD', 'CIVIL_STATUS', 'OTHER');

-- CreateEnum
CREATE TYPE "ConfidenceLevel" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "CitationType" AS ENUM ('PROCLAMATION', 'REGULATION', 'RESEARCH_PAPER', 'REPORT');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('EXTRA_DOCUMENT', 'BRIBE_REQUEST', 'DELAY', 'GOOD_EXPERIENCE', 'OTHER');

-- CreateEnum
CREATE TYPE "ViewType" AS ENUM ('PAGE_VIEW', 'VOICE_QUERY', 'DEPENDENCY_CHECK');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CITIZEN', 'ADMIN');

-- CreateEnum
CREATE TYPE "KnowledgeType" AS ENUM ('DESCRIPTION', 'REQUIREMENT', 'PROCEDURE', 'ELIGIBILITY', 'FEE', 'PROCESSING_TIME', 'OFFICE', 'OTHER');

-- CreateEnum
CREATE TYPE "IndexingStatus" AS ENUM ('PENDING', 'INDEXED', 'FAILED');

-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('OFFICIAL_REGULATION', 'OFFICIAL_WEBSITE', 'OFFICIAL_DOCUMENT', 'RESEARCH', 'OTHER');

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameAm" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameOm" TEXT NOT NULL,
    "nameTi" TEXT NOT NULL,
    "descriptionAm" TEXT,
    "descriptionEn" TEXT,
    "descriptionOm" TEXT,
    "descriptionTi" TEXT,
    "category" "ServiceCategory" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Woreda" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Addis Ababa',
    "region" TEXT NOT NULL DEFAULT 'Addis Ababa',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Woreda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicePlaybook" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "woredaId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "confidence" "ConfidenceLevel" NOT NULL DEFAULT 'MEDIUM',
    "verifiedBy" TEXT,
    "feeOfficial" DECIMAL(12,2),
    "feeReported" DECIMAL(12,2),
    "timeOfficial" TEXT,
    "timeReported" TEXT,
    "officeLocation" TEXT,
    "officeHours" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicePlaybook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "playbookId" TEXT NOT NULL,
    "nameAm" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameOm" TEXT NOT NULL,
    "nameTi" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Step" (
    "id" TEXT NOT NULL,
    "playbookId" TEXT NOT NULL,
    "stepOrder" INTEGER NOT NULL,
    "instructionAm" TEXT NOT NULL,
    "instructionEn" TEXT NOT NULL,
    "instructionOm" TEXT NOT NULL,
    "instructionTi" TEXT NOT NULL,
    "officeLocation" TEXT,
    "estimatedTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceDependency" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "requiresServiceId" TEXT NOT NULL,
    "isBlocking" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceDependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Citation" (
    "id" TEXT NOT NULL,
    "playbookId" TEXT,
    "serviceId" TEXT,
    "documentId" TEXT,
    "type" "CitationType" NOT NULL,
    "title" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "excerpt" TEXT,
    "sourceUrl" TEXT,
    "scholarxivId" TEXT,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Citation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "reference" TEXT,
    "url" TEXT,
    "type" "SourceType" NOT NULL,
    "authority" TEXT,
    "publicationDate" TIMESTAMP(3),
    "verificationNote" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeUnit" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "sourceId" TEXT,
    "language" TEXT NOT NULL,
    "type" "KnowledgeType" NOT NULL,
    "content" TEXT NOT NULL,
    "normalizedContent" TEXT,
    "publicationStatus" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "indexingStatus" "IndexingStatus" NOT NULL DEFAULT 'PENDING',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT,
    "woredaId" TEXT,
    "feedbackType" "FeedbackType" NOT NULL,
    "voiceUrl" TEXT,
    "voiceTranscript" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT true,
    "language" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceQuery" (
    "id" TEXT NOT NULL,
    "audioUrl" TEXT,
    "transcript" TEXT NOT NULL,
    "detectedIntent" TEXT NOT NULL,
    "detectedServiceId" TEXT,
    "detectedLanguage" TEXT NOT NULL,
    "responseText" TEXT NOT NULL,
    "responseAudioUrl" TEXT,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoiceQuery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceViewModel" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "woredaId" TEXT,
    "viewType" "ViewType" NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceViewModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CITIZEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Service_category_idx" ON "Service"("category");

-- CreateIndex
CREATE INDEX "Service_isActive_idx" ON "Service"("isActive");

-- CreateIndex
CREATE INDEX "Woreda_region_idx" ON "Woreda"("region");

-- CreateIndex
CREATE INDEX "Woreda_isActive_idx" ON "Woreda"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Woreda_name_city_key" ON "Woreda"("name", "city");

-- CreateIndex
CREATE INDEX "ServicePlaybook_serviceId_idx" ON "ServicePlaybook"("serviceId");

-- CreateIndex
CREATE INDEX "ServicePlaybook_woredaId_idx" ON "ServicePlaybook"("woredaId");

-- CreateIndex
CREATE UNIQUE INDEX "ServicePlaybook_serviceId_woredaId_key" ON "ServicePlaybook"("serviceId", "woredaId");

-- CreateIndex
CREATE INDEX "Document_playbookId_idx" ON "Document"("playbookId");

-- CreateIndex
CREATE UNIQUE INDEX "Document_playbookId_displayOrder_key" ON "Document"("playbookId", "displayOrder");

-- CreateIndex
CREATE INDEX "Step_playbookId_idx" ON "Step"("playbookId");

-- CreateIndex
CREATE UNIQUE INDEX "Step_playbookId_stepOrder_key" ON "Step"("playbookId", "stepOrder");

-- CreateIndex
CREATE INDEX "ServiceDependency_serviceId_idx" ON "ServiceDependency"("serviceId");

-- CreateIndex
CREATE INDEX "ServiceDependency_requiresServiceId_idx" ON "ServiceDependency"("requiresServiceId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceDependency_serviceId_requiresServiceId_key" ON "ServiceDependency"("serviceId", "requiresServiceId");

-- CreateIndex
CREATE INDEX "Citation_serviceId_idx" ON "Citation"("serviceId");

-- CreateIndex
CREATE INDEX "Citation_playbookId_idx" ON "Citation"("playbookId");

-- CreateIndex
CREATE INDEX "Citation_documentId_idx" ON "Citation"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Source_reference_key" ON "Source"("reference");

-- CreateIndex
CREATE INDEX "Source_type_idx" ON "Source"("type");

-- CreateIndex
CREATE INDEX "Source_isVerified_idx" ON "Source"("isVerified");

-- CreateIndex
CREATE INDEX "KnowledgeUnit_serviceId_idx" ON "KnowledgeUnit"("serviceId");

-- CreateIndex
CREATE INDEX "KnowledgeUnit_language_idx" ON "KnowledgeUnit"("language");

-- CreateIndex
CREATE INDEX "KnowledgeUnit_type_idx" ON "KnowledgeUnit"("type");

-- CreateIndex
CREATE INDEX "KnowledgeUnit_publicationStatus_idx" ON "KnowledgeUnit"("publicationStatus");

-- CreateIndex
CREATE INDEX "KnowledgeUnit_indexingStatus_idx" ON "KnowledgeUnit"("indexingStatus");

-- CreateIndex
CREATE INDEX "KnowledgeUnit_sourceId_idx" ON "KnowledgeUnit"("sourceId");

-- CreateIndex
CREATE INDEX "KnowledgeUnit_serviceId_language_isActive_publicationStatus_idx" ON "KnowledgeUnit"("serviceId", "language", "isActive", "publicationStatus", "indexingStatus");

-- CreateIndex
CREATE INDEX "Feedback_serviceId_idx" ON "Feedback"("serviceId");

-- CreateIndex
CREATE INDEX "Feedback_woredaId_idx" ON "Feedback"("woredaId");

-- CreateIndex
CREATE INDEX "Feedback_feedbackType_idx" ON "Feedback"("feedbackType");

-- CreateIndex
CREATE INDEX "Feedback_createdAt_idx" ON "Feedback"("createdAt");

-- CreateIndex
CREATE INDEX "VoiceQuery_sessionId_idx" ON "VoiceQuery"("sessionId");

-- CreateIndex
CREATE INDEX "VoiceQuery_detectedServiceId_idx" ON "VoiceQuery"("detectedServiceId");

-- CreateIndex
CREATE INDEX "VoiceQuery_detectedLanguage_idx" ON "VoiceQuery"("detectedLanguage");

-- CreateIndex
CREATE INDEX "VoiceQuery_createdAt_idx" ON "VoiceQuery"("createdAt");

-- CreateIndex
CREATE INDEX "ServiceViewModel_serviceId_idx" ON "ServiceViewModel"("serviceId");

-- CreateIndex
CREATE INDEX "ServiceViewModel_woredaId_idx" ON "ServiceViewModel"("woredaId");

-- CreateIndex
CREATE INDEX "ServiceViewModel_date_idx" ON "ServiceViewModel"("date");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceViewModel_serviceId_woredaId_viewType_date_key" ON "ServiceViewModel"("serviceId", "woredaId", "viewType", "date");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- AddForeignKey
ALTER TABLE "ServicePlaybook" ADD CONSTRAINT "ServicePlaybook_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePlaybook" ADD CONSTRAINT "ServicePlaybook_woredaId_fkey" FOREIGN KEY ("woredaId") REFERENCES "Woreda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_playbookId_fkey" FOREIGN KEY ("playbookId") REFERENCES "ServicePlaybook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "Step_playbookId_fkey" FOREIGN KEY ("playbookId") REFERENCES "ServicePlaybook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceDependency" ADD CONSTRAINT "ServiceDependency_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceDependency" ADD CONSTRAINT "ServiceDependency_requiresServiceId_fkey" FOREIGN KEY ("requiresServiceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_playbookId_fkey" FOREIGN KEY ("playbookId") REFERENCES "ServicePlaybook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeUnit" ADD CONSTRAINT "KnowledgeUnit_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeUnit" ADD CONSTRAINT "KnowledgeUnit_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_woredaId_fkey" FOREIGN KEY ("woredaId") REFERENCES "Woreda"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceQuery" ADD CONSTRAINT "VoiceQuery_detectedServiceId_fkey" FOREIGN KEY ("detectedServiceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceViewModel" ADD CONSTRAINT "ServiceViewModel_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceViewModel" ADD CONSTRAINT "ServiceViewModel_woredaId_fkey" FOREIGN KEY ("woredaId") REFERENCES "Woreda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

