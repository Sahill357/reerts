/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  Calendar,
  Image as ImageIcon,
  Inbox,
  BarChart3,
  Binoculars,
  Link2,
  Sparkles,
  Layers,
  Settings,
  Plus,
} from 'lucide-react';
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
import { Button, cn } from './components/ui/primitives';
import { CalendarModule } from './components/calendar/CalendarModule';
import { ComposerModal } from './components/composer/ComposerModal';
import { MediaLibraryModule } from './components/media/MediaLibraryModule';
import { PublishingQueueModule } from './components/queue/PublishingQueueModule';
import { LinkInBioModule } from './components/bio/LinkInBioModule';
import { AnalyticsModule } from './components/analytics/AnalyticsModule';
import { SettingsModule } from './components/settings/SettingsModule';
import { SocialInboxModule } from './components/inbox/SocialInboxModule';
import { CreatorHomeModule } from './components/creator/CreatorHomeModule';

type ActiveModule =
  | 'calendar'
  | 'media'
  | 'inbox'
  | 'analytics'
  | 'custom-analytics'
  | 'bio'
  | 'creator'
  | 'queue'
  | 'settings';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('calendar');
  const [loading, setLoading] = useState<boolean>(true);

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
    } finally {
      setLoading(false);
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

  const NAV_ITEMS: {
    id: ActiveModule;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'inbox', label: 'Social Inbox', icon: Inbox },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'custom-analytics', label: 'Custom Analytics', icon: Binoculars },
    { id: 'bio', label: 'Link in Bio', icon: Link2 },
    { id: 'creator', label: 'Creator Home', icon: Sparkles },
    { id: 'queue', label: 'Publishing Queue', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-canvas)] text-[var(--color-ink)]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="h-[var(--spacing-header)] flex items-center justify-between gap-8 px-6 bg-[var(--color-surface)] border-b border-[var(--color-border-hairline)] shrink-0">
        {/* Zone 1: Brand Logo */}
        <a
          href="#calendar"
          onClick={(e) => {
            e.preventDefault();
            setActiveModule('calendar');
          }}
          aria-label="Reerts"
          className="inline-flex items-center text-lg font-bold tracking-tight text-[var(--color-ink)] font-display whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <span className="h-10 py-0.5 inline-flex items-center justify-center shrink-0">
            <img
              src="/assets/aistudio/Reerts_4d11e25f.svg"
              alt="Reerts"
              className="h-9 w-auto max-w-[140px] object-contain transition-transform group-hover:scale-[1.03]"
            />
          </span>
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[var(--color-ink-secondary)]">
          {[
            { id: 'calendar' as const, label: 'Calendar' },
            { id: 'media' as const, label: 'Media' },
            { id: 'inbox' as const, label: 'Social Inbox' },
            { id: 'analytics' as const, label: 'Analytics' },
            { id: 'bio' as const, label: 'Link in Bio' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={cn(
                'py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer',
                activeModule === item.id
                  ? 'text-[var(--color-ink)] font-semibold underline underline-offset-8'
                  : 'hover:text-[var(--color-ink)]'
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="primary" size="md" onClick={() => handleOpenComposer()}>
            <Plus className="w-3.5 h-3.5" />
            <span>Create Post</span>
          </Button>
        </div>
      </header>

      {/* Main Workspace Container: Left Sidebar + Viewport */}
      <div className="flex-1 flex min-h-0">
        {/* Left Workspace Navigation Sidebar */}
        <aside className="hidden sm:flex w-60 shrink-0 bg-[var(--color-surface)] border-r border-[var(--color-border-hairline)] p-3.5 flex-col justify-between">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-[var(--radius-md)] transition-colors whitespace-nowrap shrink-0 cursor-pointer',
                    active
                      ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] font-semibold'
                      : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-subtle)]/70'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Access Group Footer matching screenshot bottom-left */}
          {session && (
            <div className="pt-3 border-t border-[var(--color-border-hairline)]">
              <div className="flex items-center gap-2.5 p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-subtle)] transition-colors">
                <div className="w-8 h-8 rounded-[var(--radius-sm)] border border-[var(--color-accent)] text-[var(--color-accent)] font-mono text-xs font-semibold flex items-center justify-center shrink-0">
                  MG
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[var(--color-ink)] truncate">
                    {session.workspace.groupName}
                  </p>
                  <p className="text-[11px] font-mono tabular-nums text-[var(--color-ink-muted)] truncate">
                    {profiles.length} Social Profiles
                  </p>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Active Module Viewport */}
        <main className="flex-1 p-6 overflow-y-auto min-w-0">
          {loading ? (
            <div className="space-y-4">
              <div className="h-10 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] animate-pulse" />
              <div className="h-[520px] bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] animate-pulse" />
            </div>
          ) : (
            <>
              {activeModule === 'calendar' && (
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
                  onNavigateToMedia={() => setActiveModule('media')}
                />
              )}

              {activeModule === 'media' && (
                <MediaLibraryModule
                  mediaItems={mediaItems}
                  onPresignAndUpload={handlePresignAndUpload}
                  onUpdateMedia={handleUpdateMedia}
                  onDeleteMedia={handleDeleteMedia}
                  onScheduleWithMedia={(mediaId) => handleOpenComposer({ mediaId })}
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

              {activeModule === 'analytics' && (
                <AnalyticsModule
                  key="standard-analytics"
                  dailyMetrics={dailyMetrics}
                  posts={posts}
                  profiles={profiles}
                  bioButtons={bioConfig?.buttons || []}
                  initialTab="overview"
                />
              )}

              {activeModule === 'custom-analytics' && (
                <AnalyticsModule
                  key="custom-analytics"
                  dailyMetrics={dailyMetrics}
                  posts={posts}
                  profiles={profiles}
                  bioButtons={bioConfig?.buttons || []}
                  initialTab="custom"
                />
              )}

              {activeModule === 'bio' && bioConfig && (
                <LinkInBioModule
                  config={bioConfig}
                  posts={posts}
                  mediaItems={mediaItems}
                  onUpdateConfig={handleUpdateBioConfig}
                  onUpdatePostUrl={handleUpdatePostUrl}
                  onRecordBioClick={handleRecordBioClick}
                  onNavigateToAnalytics={() => setActiveModule('analytics')}
                />
              )}

              {activeModule === 'creator' && session && (
                <CreatorHomeModule
                  session={session}
                  profiles={profiles}
                  mediaItems={mediaItems}
                  campaigns={creatorCampaigns}
                  onApplyCampaign={handleApplyCampaign}
                />
              )}

              {activeModule === 'queue' && (
                <PublishingQueueModule
                  queueJobs={queueJobs}
                  posts={posts}
                  profiles={profiles}
                  onPublishNow={handlePublishNow}
                  onRetryJob={handleRetryJob}
                />
              )}

              {activeModule === 'settings' && session && (
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
              )}
            </>
          )}
        </main>
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
