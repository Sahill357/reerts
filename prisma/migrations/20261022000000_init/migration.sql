-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('INSTAGRAM', 'TIKTOK', 'PINTEREST', 'LINKEDIN', 'THREADS', 'X');
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'QUEUED', 'PUBLISHED', 'FAILED');
CREATE TYPE "PublishMode" AS ENUM ('AUTO_PUBLISH', 'NOTIFICATION');
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'America/Los_Angeles',
    "plan" TEXT NOT NULL DEFAULT 'GROWTH',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SocialProfile" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "handle" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "followersCount" INTEGER NOT NULL DEFAULT 0,
    "autoPublish" BOOLEAN NOT NULL DEFAULT true,
    "connected" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SocialProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SavedTimeSlot" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "hour" INTEGER NOT NULL,
    "minute" INTEGER NOT NULL,
    "engagementScore" DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    CONSTRAINT "SavedTimeSlot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MediaItem" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "mediaType" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "aspectRatio" TEXT NOT NULL DEFAULT '1:1',
    "tags" TEXT[],
    "notes" TEXT NOT NULL DEFAULT '',
    "starred" BOOLEAN NOT NULL DEFAULT false,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MediaItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ScheduledPost" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "mediaId" TEXT,
    "caption" TEXT NOT NULL,
    "firstComment" TEXT,
    "postType" TEXT NOT NULL DEFAULT 'FEED',
    "publishMode" "PublishMode" NOT NULL DEFAULT 'AUTO_PUBLISH',
    "status" "PostStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "linkInBioUrl" TEXT,
    "bullJobId" TEXT,
    "failureReason" TEXT,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "saves" INTEGER NOT NULL DEFAULT 0,
    "bioClicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ScheduledPost_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LinkInBioPage" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'alabaster',
    "buttonRadius" TEXT NOT NULL DEFAULT 'md',
    "featuredTitle" TEXT,
    "featuredSub" TEXT,
    "featuredUrl" TEXT,
    "featuredCta" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "LinkInBioPage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LinkInBioItem" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "LinkInBioItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");
CREATE UNIQUE INDEX "Workspace_slug_key" ON "Workspace"("slug");
CREATE UNIQUE INDEX "MediaItem_objectKey_key" ON "MediaItem"("objectKey");
CREATE UNIQUE INDEX "LinkInBioPage_workspaceId_key" ON "LinkInBioPage"("workspaceId");
CREATE UNIQUE INDEX "LinkInBioPage_handle_key" ON "LinkInBioPage"("handle");
