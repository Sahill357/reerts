/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  CalendarNote,
  CreatorCampaign,
  DailyMetricPoint,
  InboxThread,
  LinkInBioConfig,
  MediaItem,
  PostStatus,
  PublishMode,
  QueueJob,
  SavedTimeSlot,
  ScheduledPost,
  SocialProfile,
  UserSession,
} from './types/scheduler';
import { cn } from './components/ui/primitives';
import { CalendarModule } from './components/calendar/CalendarModule';
import { ComposerModal } from './components/composer/ComposerModal';
import { MediaLibraryModule } from './components/media/MediaLibraryModule';
import { PublishingQueueModule } from './components/queue/PublishingQueueModule';
import { LinkInBioModule } from './components/bio/LinkInBioModule';
import { AnalyticsModule } from './components/analytics/AnalyticsModule';
import { SettingsModule } from './components/settings/SettingsModule';
import { SocialInboxModule } from './components/inbox/SocialInboxModule';
import { CreatorHomeModule } from './components/creator/CreatorHomeModule';
import { ZoractDashboardModule } from './components/dashboard/ZoractDashboardModule';

export type ActiveModule =
  | 'dashboard'
  | 'feeds'
  | 'tasks'
  | 'publishing'
  | 'inbox'
  | 'people'
  | 'reviews'
  | 'calendar'
  | 'media'
  | 'analytics'
  | 'custom-analytics'
  | 'bio'
  | 'creator'
  | 'queue'
  | 'settings';

/* Exact Pixel-Matched Outline Icons for Zoract Sidebar & Header */

function ZoractLogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M11.35 1.45a1.2 1.2 0 0 1 1.3 0l9.85 6.85a1.15 1.15 0 0 1 0 1.9L12.65 17.05a1.2 1.2 0 0 1-1.3 0L1.5 10.2a1.15 1.15 0 0 1 0-1.9l9.85-6.85Z"
        fill="#111111"
      />
      <path
        d="M2.1 15.2 11.35 21.6a1.2 1.2 0 0 0 1.3 0l9.25-6.4"
        stroke="#111111"
        strokeWidth="3.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BellNotificationIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M13.5 6.75a4.5 4.5 0 1 0-9 0c0 4.5-2 5.75-2 5.75h13s-2-1.25-2-5.75" />
      <path d="M10.3 15.2a1.5 1.5 0 0 1-2.6 0" />
    </svg>
  );
}

function DashboardGridIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2.2" y="2.2" width="4.6" height="4.6" rx="1" />
      <rect x="9.2" y="2.2" width="4.6" height="4.6" rx="1" />
      <rect x="2.2" y="9.2" width="4.6" height="4.6" rx="1" />
      <rect x="9.2" y="9.2" width="4.6" height="4.6" rx="1" />
    </svg>
  );
}

function FeedsBarsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="3" y1="4.5" x2="7.5" y2="4.5" />
      <line x1="3" y1="8" x2="12.5" y2="8" />
      <line x1="3" y1="11.5" x2="10" y2="11.5" />
    </svg>
  );
}

function TasksPinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5.2 2.2h5.6l-.55 3.5 1.75 1.85v1.15H4V7.55l1.75-1.85L5.2 2.2z" />
      <path d="M8 8.7v5.1" />
    </svg>
  );
}

function PublishingSendIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14.2 1.8 7.3 8.7" />
      <path d="m14.2 1.8-4.4 12.4-2.5-5.5-5.5-2.5 12.4-4.4z" />
    </svg>
  );
}

function InboxBubbleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 7.7a6 6 0 0 1-9.1 5.1L2 13.7l.9-2.7A6 6 0 1 1 14 7.7z" />
      <circle cx="5.8" cy="7.7" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="8" cy="7.7" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="10.2" cy="7.7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PeopleUserIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="8" cy="5.2" r="2.7" />
      <path d="M3.2 13.5c0-2.4 2.15-4.1 4.8-4.1s4.8 1.7 4.8 4.1" />
    </svg>
  );
}

function ReviewsStarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="8 2 9.85 5.75 14 6.35 11 9.25 11.7 13.4 8 11.45 4.3 13.4 5 9.25 2 6.35 6.15 5.75 8 2" />
    </svg>
  );
}

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [peopleSubTab, setPeopleSubTab] = useState<'creator' | 'bio'>('creator');
  const [reviewsSubTab, setReviewsSubTab] = useState<
    'analytics' | 'custom-analytics' | 'settings'
  >('analytics');

  const [session, setSession] = useState<UserSession | null>(null);
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);
  const [timeSlots, setTimeSlots] = useState<SavedTimeSlot[]>([]);
  const [calendarNotes, setCalendarNotes] = useState<CalendarNote[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [queueJobs, setQueueJobs] = useState<QueueJob[]>([]);
  const [bioConfig, setBioConfig] = useState<LinkInBioConfig | null>(null);
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetricPoint[]>([]);
  const [inboxThreads, setInboxThreads] = useState<InboxThread[]>([]);
  const [creatorCampaigns, setCreatorCampaigns] = useState<CreatorCampaign[]>([]);

  const [composerOpen, setComposerOpen] = useState(false);
  const [composerInit, setComposerInit] = useState<{
    mediaId?: string;
    scheduledAt?: string;
    profileId?: string;
    editPost?: ScheduledPost;
  }>({});

  const fetchAllWorkspaceData = useCallback(async () => {
    try {
      const [
        authRes,
        profRes,
        mediaRes,
        postsRes,
        bioRes,
        analyticsRes,
        inboxRes,
        creatorRes,
      ] = await Promise.all([
        fetch('/api/auth/session'),
        fetch('/api/profiles'),
        fetch('/api/media'),
        fetch('/api/posts'),
        fetch('/api/link-in-bio'),
        fetch('/api/analytics'),
        fetch('/api/inbox'),
        fetch('/api/creator'),
      ]);

      const [
        authData,
        profData,
        mediaData,
        postsData,
        bioData,
        analyticsData,
        inboxData,
        creatorData,
      ] = await Promise.all([
        authRes.json(),
        profRes.json(),
        mediaRes.json(),
        postsRes.json(),
        bioRes.json(),
        analyticsRes.json(),
        inboxRes.json(),
        creatorRes.json(),
      ]);

      setSession(authData);
      setProfiles(profData.profiles || []);
      setTimeSlots(profData.savedTimeSlots || []);
      setCalendarNotes(profData.calendarNotes || []);
      setMediaItems(mediaData.media || []);
      setPosts(postsData.posts || []);
      setQueueJobs(postsData.queueJobs || []);
      setBioConfig(bioData.config);
      setDailyMetrics(analyticsData.dailyMetrics || []);
      setInboxThreads(inboxData.threads || []);
      setCreatorCampaigns(creatorData.campaigns || []);
    } catch {
      // Keep UI responsive even if initial fetch is delayed
    }
  }, []);

  useEffect(() => {
    fetchAllWorkspaceData();
  }, [fetchAllWorkspaceData]);

  const handleOpenComposer = (initial?: {
    mediaId?: string;
    scheduledAt?: string;
    profileId?: string;
    editPost?: ScheduledPost;
  }) => {
    setComposerInit(initial || {});
    setComposerOpen(true);
  };

  const handleSubmitPost = async (payload: {
    id?: string;
    profileIds: string[];
    mediaId: string | null;
    caption: string;
    firstComment: string;
    postType: 'FEED' | 'REEL' | 'CAROUSEL' | 'STORY';
    publishMode: PublishMode;
    scheduledAt: string;
    status: PostStatus;
    linkInBioUrl: string;
  }) => {
    if (payload.id) {
      await fetch(`/api/posts/${payload.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    await fetchAllWorkspaceData();
  };

  const handleDeletePost = async (postId: string) => {
    await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    await fetchAllWorkspaceData();
  };

  const handleSwapPosts = async (postIdA: string, postIdB: string) => {
    await fetch('/api/posts/swap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postIdA, postIdB }),
    });
    await fetchAllWorkspaceData();
  };

  const handlePublishNow = async (jobOrPostId: string) => {
    await fetch(`/api/queue/${encodeURIComponent(jobOrPostId)}/publish-now`, {
      method: 'POST',
    });
    await fetchAllWorkspaceData();
  };

  const handleRetryJob = async (jobId: string) => {
    await fetch(`/api/queue/${encodeURIComponent(jobId)}/retry`, {
      method: 'POST',
    });
    await fetchAllWorkspaceData();
  };

  const handleAddCalendarNote = async (payload: {
    date: string;
    hour: number;
    title: string;
    body: string;
  }) => {
    await fetch('/api/calendar-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    await fetchAllWorkspaceData();
  };

  const handleDeleteCalendarNote = async (id: string) => {
    await fetch(`/api/calendar-notes/${id}`, { method: 'DELETE' });
    await fetchAllWorkspaceData();
  };

  const handlePresignAndUpload = async (payload: {
    filename: string;
    mimeType: string;
    sizeBytes: number;
    aspectRatio: '1:1' | '3:4' | '4:3' | '9:16';
    tags: string[];
    notes: string;
    dataUrl?: string;
  }) => {
    const presignRes = await fetch('/api/media/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: payload.filename,
        mimeType: payload.mimeType,
        sizeBytes: payload.sizeBytes,
      }),
    });
    const presignData = await presignRes.json();

    await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: payload.filename,
        objectKey: presignData.objectKey,
        publicUrl: payload.dataUrl || presignData.publicReadUrl,
        mimeType: payload.mimeType,
        sizeBytes: payload.sizeBytes,
        aspectRatio: payload.aspectRatio,
        tags: payload.tags,
        notes: payload.notes,
      }),
    });

    await fetchAllWorkspaceData();
    return presignData;
  };

  const handleUpdateMedia = async (id: string, patch: Partial<MediaItem>) => {
    await fetch(`/api/media/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    await fetchAllWorkspaceData();
  };

  const handleDeleteMedia = async (id: string) => {
    await fetch(`/api/media/${id}`, { method: 'DELETE' });
    await fetchAllWorkspaceData();
  };

  const handleUpdateBioConfig = async (next: LinkInBioConfig) => {
    setBioConfig(next);
    await fetch('/api/link-in-bio', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    });
  };

  const handleUpdatePostUrl = async (postId: string, linkInBioUrl: string) => {
    await fetch(`/api/posts/${postId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkInBioUrl }),
    });
    await fetchAllWorkspaceData();
  };

  const handleRecordBioClick = async (payload: {
    buttonId?: string;
    postId?: string;
  }) => {
    await fetch('/api/link-in-bio/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    await fetchAllWorkspaceData();
  };

  const handleReplyThread = async (threadId: string, text: string) => {
    await fetch(`/api/inbox/${threadId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    await fetchAllWorkspaceData();
  };

  const handleUpdateThreadStatus = async (
    threadId: string,
    status: 'OPEN' | 'RESOLVED'
  ) => {
    await fetch(`/api/inbox/${threadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    await fetchAllWorkspaceData();
  };

  const handleApplyCampaign = async (campaignId: string) => {
    await fetch(`/api/creator/${campaignId}/apply`, { method: 'POST' });
    await fetchAllWorkspaceData();
  };

  /* Exact 7 Zoract Sidebar Navigation Items in Exact Reference Order */
  const ZORACT_NAV_ITEMS: {
    id: ActiveModule;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardGridIcon },
    { id: 'feeds', label: 'Feeds', icon: FeedsBarsIcon },
    { id: 'tasks', label: 'Tasks', icon: TasksPinIcon },
    { id: 'publishing', label: 'Publishing', icon: PublishingSendIcon },
    { id: 'inbox', label: 'Inbox', icon: InboxBubbleIcon },
    { id: 'people', label: 'People', icon: PeopleUserIcon },
    { id: 'reviews', label: 'Reviews', icon: ReviewsStarIcon },
  ];

  const isSidebarItemActive = (itemId: ActiveModule) => {
    if (activeModule === itemId) return true;
    if (itemId === 'feeds' && activeModule === 'media') return true;
    if (itemId === 'tasks' && activeModule === 'calendar') return true;
    if (itemId === 'publishing' && activeModule === 'queue') return true;
    if (itemId === 'people' && (activeModule === 'creator' || activeModule === 'bio'))
      return true;
    if (
      itemId === 'reviews' &&
      (activeModule === 'analytics' ||
        activeModule === 'custom-analytics' ||
        activeModule === 'settings')
    )
      return true;
    return false;
  };

  return (
    /* Full-bleed pure white application background */
    <div className="min-h-screen w-full bg-white flex flex-col font-sans text-[#171717]">
      {/* White Application Canvas */}
      <div className="flex-1 flex flex-col bg-white w-full overflow-hidden">
        {/* Top Navigation Bar (54px tall) */}
        <header className="h-[54px] flex items-center justify-between pl-[20px] pr-[24px] bg-white border-b border-[#F4F4F6] shrink-0">
          {/* Left: Black geometric stacked layers logo mark + "Zoract" */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="sm:hidden p-1.5 rounded-md text-[#171717] hover:bg-[#F7F7F8]"
            >
              <FeedsBarsIcon className="w-5 h-5" />
            </button>

            <a
              href="#dashboard"
              onClick={(e) => {
                e.preventDefault();
                setActiveModule('dashboard');
              }}
              aria-label="Reerts"
              className="inline-flex items-center focus:outline-none"
            >
              <img
                src="/assets/aistudio/Reerts.svg"
                alt="Reerts"
                className="h-9 w-auto max-w-[140px] object-contain shrink-0"
              />
            </a>
          </div>

          {/* Right: Notification Bell with red dot + Circular User Avatar + "Albert Cook" */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setActiveModule('inbox')}
              aria-label="Notifications"
              className="relative p-1 text-[#85858F] hover:text-[#171717] transition-colors cursor-pointer"
            >
              <BellNotificationIcon className="w-[16px] h-[16px]" />
              <span
                aria-hidden="true"
                className="absolute top-[3px] right-[3px] w-[5px] h-[5px] rounded-full bg-[#FF5A5A] ring-1 ring-white"
              />
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveModule('reviews');
                setReviewsSubTab('settings');
              }}
              className="flex items-center ml-[22px] cursor-pointer focus:outline-none"
            >
              <img
                src="/assets/zoract/avatar-albert.png"
                alt="Albert Cook"
                className="w-[34px] h-[34px] rounded-full object-cover shrink-0"
              />
              <span className="text-[12px] font-semibold text-[#171717] ml-[9px] tracking-[-0.01em] whitespace-nowrap">
                Albert Cook
              </span>
            </button>
          </div>
        </header>

        {/* Main Workspace Container: Left Sidebar + Dashboard Canvas */}
        <div className="flex-1 flex min-h-0 relative">
          {/* Left Sidebar Navigation (174px wide inside white canvas -> 195px from left viewport edge) */}
          <aside
            className={cn(
              'w-[174px] shrink-0 bg-white border-r border-[#F3F3F5] px-[10px] pt-[15px] pb-4 flex-col justify-between',
              mobileMenuOpen
                ? 'flex absolute inset-y-0 left-0 z-30 shadow-xl sm:static sm:shadow-none'
                : 'hidden sm:flex'
            )}
          >
            <nav aria-label="Main Navigation" className="flex flex-col">
              {ZORACT_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isSidebarItemActive(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveModule(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      'w-full h-[39px] flex items-center gap-[10px] px-[11px] rounded-[8px] text-[12px] transition-colors cursor-pointer whitespace-nowrap',
                      active
                        ? 'bg-[#FFFF00] text-[#171717] font-semibold'
                        : 'text-[#85858F] font-medium hover:text-[#171717] hover:bg-[#F7F7F8]'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-[15px] h-[15px] shrink-0',
                        active ? 'text-[#171717]' : 'text-[#85858F]'
                      )}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Dashboard / Module Content Area */}
          <main className="flex-1 min-w-0 bg-white pt-[15px] pl-[18px] pr-[16px] pb-[17px] overflow-y-auto">
            {activeModule === 'dashboard' && (
              <ZoractDashboardModule
                onCreatePost={() => handleOpenComposer()}
                onNavigateToSchedule={() => setActiveModule('tasks')}
                onNavigateToApprovals={() => setActiveModule('publishing')}
              />
            )}

            {(activeModule === 'feeds' || activeModule === 'media') && (
              <MediaLibraryModule
                mediaItems={mediaItems}
                onPresignAndUpload={handlePresignAndUpload}
                onUpdateMedia={handleUpdateMedia}
                onDeleteMedia={handleDeleteMedia}
                onScheduleWithMedia={(mediaId) => handleOpenComposer({ mediaId })}
              />
            )}

            {(activeModule === 'tasks' || activeModule === 'calendar') && (
              <CalendarModule
                profiles={profiles}
                timeSlots={timeSlots}
                calendarNotes={calendarNotes}
                mediaItems={mediaItems}
                posts={posts}
                timezone={session?.workspace.timezone || 'Asia/Calcutta'}
                postsLeftInCycle={session?.workspace.postsLeftInCycle || 24}
                onOpenComposer={handleOpenComposer}
                onSwapPosts={handleSwapPosts}
                onPublishNow={handlePublishNow}
                onAddCalendarNote={handleAddCalendarNote}
                onDeleteCalendarNote={handleDeleteCalendarNote}
                onNavigateToMedia={() => setActiveModule('feeds')}
              />
            )}

            {(activeModule === 'publishing' || activeModule === 'queue') && (
              <PublishingQueueModule
                queueJobs={queueJobs}
                posts={posts}
                profiles={profiles}
                onPublishNow={handlePublishNow}
                onRetryJob={handleRetryJob}
              />
            )}

            {activeModule === 'inbox' && (
              <SocialInboxModule
                threads={inboxThreads}
                profiles={profiles}
                posts={posts}
                mediaItems={mediaItems}
                onReplyThread={handleReplyThread}
                onUpdateThreadStatus={handleUpdateThreadStatus}
              />
            )}

            {(activeModule === 'people' ||
              activeModule === 'creator' ||
              activeModule === 'bio') && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-[#ECECF0] pb-2">
                  <button
                    type="button"
                    onClick={() => setPeopleSubTab('creator')}
                    className={cn(
                      'px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer',
                      peopleSubTab === 'creator'
                        ? 'bg-[#FFFF00] text-[#171717]'
                        : 'text-[#85858F] hover:text-[#171717]'
                    )}
                  >
                    Creator Directory
                  </button>
                  <button
                    type="button"
                    onClick={() => setPeopleSubTab('bio')}
                    className={cn(
                      'px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer',
                      peopleSubTab === 'bio'
                        ? 'bg-[#FFFF00] text-[#171717]'
                        : 'text-[#85858F] hover:text-[#171717]'
                    )}
                  >
                    Link in Bio
                  </button>
                </div>

                {peopleSubTab === 'bio' && bioConfig ? (
                  <LinkInBioModule
                    config={bioConfig}
                    posts={posts}
                    mediaItems={mediaItems}
                    onUpdateConfig={handleUpdateBioConfig}
                    onUpdatePostUrl={handleUpdatePostUrl}
                    onRecordBioClick={handleRecordBioClick}
                    onNavigateToAnalytics={() => {
                      setActiveModule('reviews');
                      setReviewsSubTab('analytics');
                    }}
                  />
                ) : (
                  session && (
                    <CreatorHomeModule
                      session={session}
                      profiles={profiles}
                      mediaItems={mediaItems}
                      campaigns={creatorCampaigns}
                      onApplyCampaign={handleApplyCampaign}
                    />
                  )
                )}
              </div>
            )}

            {(activeModule === 'reviews' ||
              activeModule === 'analytics' ||
              activeModule === 'custom-analytics' ||
              activeModule === 'settings') && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-[#ECECF0] pb-2">
                  <button
                    type="button"
                    onClick={() => setReviewsSubTab('analytics')}
                    className={cn(
                      'px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer',
                      reviewsSubTab === 'analytics'
                        ? 'bg-[#FFFF00] text-[#171717]'
                        : 'text-[#85858F] hover:text-[#171717]'
                    )}
                  >
                    Performance Reviews
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewsSubTab('custom-analytics')}
                    className={cn(
                      'px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer',
                      reviewsSubTab === 'custom-analytics'
                        ? 'bg-[#FFFF00] text-[#171717]'
                        : 'text-[#85858F] hover:text-[#171717]'
                    )}
                  >
                    Custom Reports
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewsSubTab('settings')}
                    className={cn(
                      'px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer',
                      reviewsSubTab === 'settings'
                        ? 'bg-[#FFFF00] text-[#171717]'
                        : 'text-[#85858F] hover:text-[#171717]'
                    )}
                  >
                    Workspace Settings
                  </button>
                </div>

                {reviewsSubTab === 'settings' && session ? (
                  <SettingsModule
                    session={session}
                    profiles={profiles}
                    timeSlots={timeSlots}
                    onToggleProfileAutoPublish={async (profileId, nextVal) => {
                      await fetch(`/api/profiles/${profileId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ autoPublish: nextVal }),
                      });
                      await fetchAllWorkspaceData();
                    }}
                    onAddTimeSlot={async (slot) => {
                      await fetch('/api/time-slots', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(slot),
                      });
                      await fetchAllWorkspaceData();
                    }}
                    onDeleteTimeSlot={async (id) => {
                      await fetch(`/api/time-slots/${id}`, { method: 'DELETE' });
                      await fetchAllWorkspaceData();
                    }}
                    onUpdateWorkspace={async (ws) => {
                      await fetch('/api/auth/workspace', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(ws),
                      });
                      await fetchAllWorkspaceData();
                    }}
                  />
                ) : (
                  <AnalyticsModule
                    key={reviewsSubTab}
                    dailyMetrics={dailyMetrics}
                    posts={posts}
                    profiles={profiles}
                    bioButtons={bioConfig?.buttons || []}
                    initialTab={
                      reviewsSubTab === 'custom-analytics' ? 'custom' : 'overview'
                    }
                  />
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Multi-Platform Post Composer Modal */}
      {composerOpen && (
        <ComposerModal
          isOpen={composerOpen}
          onClose={() => setComposerOpen(false)}
          profiles={profiles}
          mediaItems={mediaItems}
          timeSlots={timeSlots}
          initialMediaId={composerInit.mediaId}
          initialScheduledAt={composerInit.scheduledAt}
          initialProfileId={composerInit.profileId}
          editPost={composerInit.editPost}
          onSubmitPost={handleSubmitPost}
          onDeletePost={handleDeletePost}
        />
      )}
    </div>
  );
}
