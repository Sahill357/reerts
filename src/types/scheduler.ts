export enum Platform {
  INSTAGRAM = 'INSTAGRAM',
  TIKTOK = 'TIKTOK',
  PINTEREST = 'PINTEREST',
  LINKEDIN = 'LINKEDIN',
  THREADS = 'THREADS',
  X = 'X',
  YOUTUBE = 'YOUTUBE',
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  QUEUED = 'QUEUED',
  PUBLISHED = 'PUBLISHED',
  FAILED = 'FAILED',
}

export enum PublishMode {
  AUTO_PUBLISH = 'AUTO_PUBLISH',
  NOTIFICATION = 'NOTIFICATION',
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export interface UserSession {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'OWNER' | 'EDITOR' | 'ANALYST';
    avatarUrl: string;
  };
  workspace: {
    id: string;
    name: string;
    slug: string;
    groupName: string;
    plan: string;
    timezone: string;
    postsLeftInCycle: number;
  };
}

export interface SocialProfile {
  id: string;
  platform: Platform;
  handle: string;
  displayName: string;
  followersCount: number;
  followingCount: number;
  autoPublish: boolean;
  connected: boolean;
  color: string;
}

export interface SavedTimeSlot {
  id: string;
  profileId: string;
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
  hour: number;      // 0 - 23
  minute: number;    // 0 or 30
  engagementScore: number; // 0.0 - 1.0
}

export interface CalendarNote {
  id: string;
  date: string; // YYYY-MM-DD
  hour: number; // 0 - 23
  title: string;
  body: string;
  color: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  objectKey: string;
  publicUrl: string;
  mediaType: MediaType;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16';
  tags: string[];
  notes: string;
  starred: boolean;
  usageCount: number;
  createdAt: string;
  palette: [string, string, string];
}

export interface ScheduledPost {
  id: string;
  profileId: string;
  mediaId: string | null;
  caption: string;
  firstComment: string;
  postType: 'FEED' | 'REEL' | 'CAROUSEL' | 'STORY';
  publishMode: PublishMode;
  status: PostStatus;
  scheduledAt: string; // ISO string
  publishedAt?: string | null;
  linkInBioUrl?: string;
  bullJobId?: string;
  failureReason?: string;
  impressions: number;
  reach: number;
  views: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  bioClicks: number;
}

export interface QueueJob {
  id: string;
  postId: string;
  profileId: string;
  queueName: 'social-publishing';
  state: 'delayed' | 'waiting' | 'active' | 'completed' | 'failed';
  attemptsMade: number;
  maxAttempts: number;
  scheduledFor: string;
  processedAt?: string;
  errorReason?: string;
  backoffDelayMs: number;
}

export interface LinkInBioButton {
  id: string;
  label: string;
  url: string;
  clicks: number;
  active: boolean;
  sortOrder: number;
  blockType?: 'BUTTON' | 'BANNER' | 'FEATURED_MEDIA' | 'EMAIL_CAPTURE' | 'AFFILIATE';
}

export interface LinkInBioConfig {
  handle: string;
  title: string;
  bio: string;
  avatarUrl: string;
  theme: 'light' | 'dark' | 'sherbet' | 'papaya' | 'matrix' | 'alabaster';
  buttonRadius: 'none' | 'md' | 'lg';
  pageViews: number;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  seoTitle: string;
  seoDescription: string;
  affiliateEnabled: boolean;
  featuredBanner: {
    enabled: boolean;
    title: string;
    subtitle: string;
    ctaLabel: string;
    url: string;
  };
  socialLinks: {
    platform: string;
    url: string;
    enabled: boolean;
  }[];
  buttons: LinkInBioButton[];
}

export interface DailyMetricPoint {
  date: string;
  impressions: number;
  reach: number;
  engagements: number;
  bioClicks: number;
  pageViews: number;
  instagramImpressions: number;
  threadsImpressions: number;
  tiktokImpressions: number;
  linkedinImpressions: number;
}

export interface InboxMessage {
  id: string;
  senderName: string;
  senderHandle: string;
  isBrandOwner: boolean;
  text: string;
  timestamp: string;
}

export interface InboxThread {
  id: string;
  profileId: string;
  platform: Platform;
  authorName: string;
  authorHandle: string;
  type: 'COMMENT' | 'DM';
  status: 'OPEN' | 'RESOLVED';
  postId?: string;
  postPreviewTitle: string;
  lastActivityLabel: string;
  unread: boolean;
  messages: InboxMessage[];
}

export interface CreatorCampaign {
  id: string;
  brandName: string;
  campaignTitle: string;
  category: string;
  compensation: string;
  deliverables: string;
  deadline: string;
  status: 'AVAILABLE' | 'APPLIED' | 'ACTIVE';
}
