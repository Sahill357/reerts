import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Sparkles,
  ArrowUpDown,
  PanelLeftClose,
  PanelLeftOpen,
  Send,
  Pin,
  Hash,
  Star,
  Upload,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  CalendarNote,
  MediaItem,
  Platform,
  PostStatus,
  SavedTimeSlot,
  ScheduledPost,
  SocialProfile,
} from '../../types/scheduler';
import { Button, Input, ResilientMediaImage, cn } from '../ui/primitives';

interface CalendarModuleProps {
  profiles: SocialProfile[];
  timeSlots: SavedTimeSlot[];
  calendarNotes: CalendarNote[];
  mediaItems: MediaItem[];
  posts: ScheduledPost[];
  timezone: string;
  postsLeftInCycle: number;
  onOpenComposer: (initial?: {
    mediaId?: string;
    scheduledAt?: string;
    profileId?: string;
    editPost?: ScheduledPost;
  }) => void;
  onSwapPosts: (postIdA: string, postIdB: string) => Promise<void>;
  onPublishNow: (postId: string) => Promise<void>;
  onAddCalendarNote: (payload: {
    date: string;
    hour: number;
    title: string;
    body: string;
  }) => Promise<void>;
  onDeleteCalendarNote: (id: string) => Promise<void>;
  onNavigateToMedia: () => void;
}

const WEEK_DAYS = [
  { label: '18 SUN', short: 'Sun', date: '2026-10-18', dayNum: '18', dow: 0 },
  { label: '19 MON', short: 'Mon', date: '2026-10-19', dayNum: '19', dow: 1 },
  { label: '20 TUE', short: 'Tue', date: '2026-10-20', dayNum: '20', dow: 2 },
  { label: '21 WED', short: 'Wed', date: '2026-10-21', dayNum: '21', dow: 3 },
  { label: '22 THU', short: 'Thu', date: '2026-10-22', dayNum: '22', dow: 4 },
  { label: '23 FRI', short: 'Fri', date: '2026-10-23', dayNum: '23', dow: 5 },
  { label: '24 SAT', short: 'Sat', date: '2026-10-24', dayNum: '24', dow: 6 },
];

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

const TRENDING_HASHTAGS = [
  { tag: '#warmminimalism', growth: '+142% this week', category: 'Interior & Objects' },
  { tag: '#ceramicstudio', growth: '+88% this week', category: 'Craft & Process' },
  { tag: '#slowlivingrituals', growth: '+64% this week', category: 'Lifestyle' },
  { tag: '#architecturaltableware', growth: '+51% this week', category: 'Design' },
];

export function CalendarModule({
  profiles,
  timeSlots,
  calendarNotes,
  mediaItems,
  posts,
  timezone,
  postsLeftInCycle,
  onOpenComposer,
  onSwapPosts,
  onPublishNow,
  onAddCalendarNote,
  onDeleteCalendarNote,
  onNavigateToMedia,
}: CalendarModuleProps) {
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>(
    profiles.map((p) => p.id)
  );
  const [calendarMode, setCalendarMode] = useState<
    'stories' | 'preview' | 'week' | 'month' | 'list'
  >('week');
  const [mediaFilter, setMediaFilter] = useState<'unused' | 'starred' | 'all'>('all');
  const [showSideBin, setShowSideBin] = useState<boolean>(true);
  const [selectedSwapId, setSelectedSwapId] = useState<string | null>(null);
  const [showTrendingDrawer, setShowTrendingDrawer] = useState<boolean>(false);

  // Create Note Modal State
  const [noteModalSlot, setNoteModalSlot] = useState<{ date: string; hour: number } | null>(
    null
  );
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');

  const toggleProfile = (id: string) => {
    setSelectedProfileIds((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((item) => item !== id)
          : prev
        : [...prev, id]
    );
  };

  const filteredSideMedia = useMemo(() => {
    return mediaItems.filter((item) => {
      if (mediaFilter === 'unused') return item.usageCount === 0;
      if (mediaFilter === 'starred') return item.starred;
      return true;
    });
  }, [mediaItems, mediaFilter]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (!selectedProfileIds.includes(post.profileId)) return false;
      if (calendarMode === 'stories') {
        return post.postType === 'STORY' || post.postType === 'REEL';
      }
      return true;
    });
  }, [posts, selectedProfileIds, calendarMode]);

  const mediaMap = useMemo(() => {
    const map = new Map<string, MediaItem>();
    mediaItems.forEach((m) => map.set(m.id, m));
    return map;
  }, [mediaItems]);

  const profileMap = useMemo(() => {
    const map = new Map<string, SocialProfile>();
    profiles.forEach((p) => map.set(p.id, p));
    return map;
  }, [profiles]);

  const handleGridSwap = async (targetPostId: string) => {
    if (!selectedSwapId) {
      setSelectedSwapId(targetPostId);
      return;
    }
    if (selectedSwapId !== targetPostId) {
      await onSwapPosts(selectedSwapId, targetPostId);
    }
    setSelectedSwapId(null);
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteModalSlot || !noteTitle.trim()) return;
    await onAddCalendarNote({
      date: noteModalSlot.date,
      hour: noteModalSlot.hour,
      title: noteTitle.trim(),
      body: noteBody.trim(),
    });
    setNoteTitle('');
    setNoteBody('');
    setNoteModalSlot(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Row 1: Profile Selector Strip & Cycle Quota */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[var(--color-border-hairline)]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-[var(--color-ink-secondary)] mr-1">
            Select Profiles ({selectedProfileIds.length})
          </span>
          {profiles.map((prof) => {
            const active = selectedProfileIds.includes(prof.id);
            const shortPlatform =
              prof.platform === Platform.INSTAGRAM
                ? 'IG'
                : prof.platform === Platform.TIKTOK
                ? 'TT'
                : prof.platform === Platform.PINTEREST
                ? 'PIN'
                : prof.platform === Platform.LINKEDIN
                ? 'IN'
                : 'TH';
            return (
              <button
                key={prof.id}
                onClick={() => toggleProfile(prof.id)}
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] border transition-all cursor-pointer whitespace-nowrap shrink-0',
                  active
                    ? 'bg-[var(--color-surface)] text-[var(--color-ink)] border-[var(--color-ink)] shadow-2xs'
                    : 'bg-[var(--color-surface-subtle)] text-[var(--color-ink-muted)] border-transparent hover:text-[var(--color-ink)]'
                )}
              >
                <span className="font-mono text-[10px] font-semibold text-[var(--color-ink-secondary)]">
                  {shortPlatform}
                </span>
                <span>{prof.handle}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 text-xs text-[var(--color-ink-secondary)]">
          <span className="font-mono tabular-nums">
            {postsLeftInCycle} Scheduled Slots Remaining
          </span>
          <span aria-hidden="true">·</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const slot = timeSlots[0] || { hour: 10, profileId: 'prof_ig_01' };
              const hh = String(slot.hour).padStart(2, '0');
              onOpenComposer({
                profileId: slot.profileId,
                scheduledAt: `2026-10-23T${hh}:00:00.000Z`,
              });
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent)]" />
            <span>Quick Schedule Best Slot</span>
          </Button>
        </div>
      </div>

      {/* Main Split Workspace: Side Media Bin + Calendar Canvas */}
      <div className="flex flex-1 gap-5 pt-4 min-h-0">
        {/* Left Collapsible Media Bin */}
        {showSideBin && (
          <aside className="w-64 shrink-0 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] p-3.5 flex flex-col">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onNavigateToMedia}
                className="w-full"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Media</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onOpenComposer()}
                className="w-full"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Post</span>
              </Button>
            </div>

            <div className="flex items-center justify-between py-2 border-y border-[var(--color-border-hairline)] mb-3">
              <button
                onClick={() =>
                  setMediaFilter((prev) => (prev === 'starred' ? 'all' : 'starred'))
                }
                className={cn(
                  'p-1 rounded-[var(--radius-sm)] transition-colors cursor-pointer',
                  mediaFilter === 'starred'
                    ? 'text-[var(--color-status-warning)] bg-[var(--color-status-warning-bg)]'
                    : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                )}
                title="Filter Starred Media"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
              </button>

              <div className="flex items-center gap-1">
                {(['all', 'unused', 'starred'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMediaFilter(tab)}
                    className={cn(
                      'px-2 py-0.5 text-[11px] font-medium capitalize rounded-[var(--radius-xs)] transition-colors cursor-pointer whitespace-nowrap shrink-0',
                      mediaFilter === tab
                        ? 'bg-[var(--color-surface-subtle)] text-[var(--color-ink)] font-semibold'
                        : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-0.5">
              <div className="grid grid-cols-2 gap-2">
                {filteredSideMedia.map((media) => (
                  <div
                    key={media.id}
                    onClick={() => onOpenComposer({ mediaId: media.id })}
                    className="group relative aspect-square rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border-hairline)] hover:border-[var(--color-ink)] cursor-pointer bg-[var(--color-surface-subtle)]"
                  >
                    <ResilientMediaImage
                      src={media.publicUrl}
                      alt={media.filename}
                      className="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                      <span className="text-[10px] font-medium text-white truncate">
                        + Schedule
                      </span>
                      <span className="text-[9px] font-mono text-white/80 tabular-nums">
                        {media.aspectRatio}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-[11px] text-[var(--color-ink-muted)] mt-4">
                All {filteredSideMedia.length} studio assets loaded
              </p>
            </div>
          </aside>
        )}

        {/* Right Calendar Canvas */}
        <div className="flex-1 min-w-0 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] overflow-hidden flex flex-col">
          {/* Calendar Toolbar matching screenshot 1 */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[var(--color-border-hairline)]">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSideBin((v) => !v)}
                title="Toggle Media Drawer"
              >
                {showSideBin ? (
                  <PanelLeftClose className="w-4 h-4" />
                ) : (
                  <PanelLeftOpen className="w-4 h-4" />
                )}
              </Button>
              <span className="text-xs font-semibold text-[var(--color-accent)]">
                Today
              </span>
              <div className="flex items-center gap-1 text-[var(--color-ink-secondary)]">
                <ChevronLeft className="w-4 h-4" />
                <ChevronRight className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-[var(--color-ink)]">
                Oct 18 – 24, 2026
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTrendingDrawer((v) => !v)}
              >
                <Hash className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                <span>Future trending hashtags</span>
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[var(--color-ink-muted)]">
                {timezone}
              </span>

              <div className="flex items-center gap-0.5 p-1 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
                {(
                  [
                    { id: 'stories', label: 'Stories' },
                    { id: 'preview', label: 'Preview' },
                    { id: 'week', label: 'Week' },
                    { id: 'month', label: 'Month' },
                    { id: 'list', label: 'List' },
                  ] as const
                ).map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setCalendarMode(mode.id)}
                    className={cn(
                      'px-2.5 py-1 text-xs font-medium rounded-[var(--radius-sm)] transition-colors cursor-pointer whitespace-nowrap shrink-0',
                      calendarMode === mode.id
                        ? 'bg-[var(--color-surface)] text-[var(--color-ink)] shadow-2xs'
                        : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
                    )}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Trending Hashtags Drawer */}
          {showTrendingDrawer && (
            <div className="px-4 py-3 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-hairline)] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-xs font-semibold text-[var(--color-ink)]">
                  Curated High-Velocity Hashtags:
                </span>
                {TRENDING_HASHTAGS.map((item) => (
                  <button
                    key={item.tag}
                    onClick={() => {
                      onOpenComposer();
                      setShowTrendingDrawer(false);
                    }}
                    className="text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] font-mono cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <strong className="text-[var(--color-ink)]">{item.tag}</strong> ·{' '}
                    <span className="text-[var(--color-status-nominal)]">{item.growth}</span>
                  </button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTrendingDrawer(false)}
              >
                Hide
              </Button>
            </div>
          )}

          {/* MODE: WEEK OR STORIES TIME MATRIX */}
          {(calendarMode === 'week' || calendarMode === 'stories') && (
            <div className="flex-1 overflow-auto">
              <div className="min-w-[860px]">
                {/* Day Header Row */}
                <div className="grid grid-cols-8 border-b border-[var(--color-border-hairline)] bg-[var(--color-surface)] sticky top-0 z-10">
                  <div className="p-2.5 text-[11px] font-mono text-[var(--color-ink-muted)] border-r border-[var(--color-border-hairline)]">
                    GMT+5:30
                  </div>
                  {WEEK_DAYS.map((day) => {
                    const isToday = day.date === '2026-10-22';
                    return (
                      <div
                        key={day.date}
                        className={cn(
                          'p-2.5 text-center border-r border-[var(--color-border-hairline)] last:border-r-0',
                          isToday && 'bg-[var(--color-accent-soft)]/50'
                        )}
                      >
                        <span
                          className={cn(
                            'text-xs font-mono font-semibold tabular-nums tracking-tight',
                            isToday
                              ? 'text-[var(--color-accent)]'
                              : 'text-[var(--color-ink-secondary)]'
                          )}
                        >
                          {day.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Hourly Rows */}
                {HOURS.map((hour) => {
                  const hourLabel =
                    hour === 12
                      ? '12PM'
                      : hour > 12
                      ? `${hour - 12}PM`
                      : `${hour}AM`;

                  return (
                    <div
                      key={hour}
                      className="grid grid-cols-8 border-b border-[var(--color-border-hairline)] min-h-[84px]"
                    >
                      <div className="p-2 text-[11px] font-mono tabular-nums text-[var(--color-ink-muted)] border-r border-[var(--color-border-hairline)]">
                        {hourLabel}
                      </div>

                      {WEEK_DAYS.map((day) => {
                        const cellPosts = filteredPosts.filter((p) => {
                          const d = new Date(p.scheduledAt);
                          return (
                            p.scheduledAt.slice(0, 10) === day.date &&
                            d.getUTCHours() === hour
                          );
                        });

                        const cellNotes = calendarNotes.filter(
                          (n) => n.date === day.date && n.hour === hour
                        );

                        const matchingSlot = timeSlots.find(
                          (s) =>
                            s.dayOfWeek === day.dow &&
                            s.hour === hour &&
                            selectedProfileIds.includes(s.profileId)
                        );

                        const slotIso = `${day.date}T${String(hour).padStart(2, '0')}:00:00.000Z`;

                        return (
                          <div
                            key={`${day.date}-${hour}`}
                            className={cn(
                              'group relative p-1.5 border-r border-[var(--color-border-hairline)] last:border-r-0 transition-colors',
                              day.date === '2026-10-23' && 'bg-[var(--color-surface-subtle)]/35',
                              matchingSlot && 'bg-[var(--color-status-nominal-bg)]/50'
                            )}
                          >
                            {/* Best Slot Subtle Indicator */}
                            {matchingSlot && cellPosts.length === 0 && cellNotes.length === 0 && (
                              <button
                                onClick={() =>
                                  onOpenComposer({
                                    scheduledAt: slotIso,
                                    profileId: matchingSlot.profileId,
                                  })
                                }
                                className="w-full text-left px-2 py-1 rounded-[var(--radius-sm)] border border-dashed border-[var(--color-status-nominal)]/40 text-[10px] font-mono tabular-nums text-[var(--color-status-nominal)] hover:border-[var(--color-status-nominal)] cursor-pointer"
                              >
                                Peak Window · {Math.round(matchingSlot.engagementScore * 100)}%
                              </button>
                            )}

                            {/* Pinned Calendar Notes (matching Screenshot 1 'Create Note') */}
                            {cellNotes.map((note) => (
                              <div
                                key={note.id}
                                className="p-2 mb-1 rounded-[var(--radius-sm)] bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/40 text-xs"
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-semibold text-[var(--color-accent)] flex items-center gap-1 truncate">
                                    <Pin className="w-3 h-3 shrink-0" />
                                    {note.title}
                                  </span>
                                  <button
                                    onClick={() => onDeleteCalendarNote(note.id)}
                                    className="text-[var(--color-ink-muted)] hover:text-[var(--color-status-danger)] cursor-pointer"
                                    title="Delete Note"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                                {note.body && (
                                  <p className="text-[11px] text-[var(--color-ink-secondary)] mt-0.5 line-clamp-2">
                                    {note.body}
                                  </p>
                                )}
                              </div>
                            ))}

                            {/* Scheduled Posts */}
                            {cellPosts.map((post) => {
                              const media = post.mediaId ? mediaMap.get(post.mediaId) : undefined;
                              const profile = profileMap.get(post.profileId);
                              return (
                                <div
                                  key={post.id}
                                  onClick={() => onOpenComposer({ editPost: post })}
                                  className="p-2 rounded-[var(--radius-sm)] bg-[var(--color-surface)] border border-[var(--color-border-strong)] hover:border-[var(--color-ink)] transition-colors cursor-pointer mb-1 last:mb-0 shadow-2xs"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    {media && (
                                      <div className="w-7 h-7 rounded-[var(--radius-xs)] overflow-hidden shrink-0">
                                        <ResilientMediaImage
                                          src={media.publicUrl}
                                          alt={post.caption}
                                          className="w-full h-full"
                                        />
                                      </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[11px] font-semibold text-[var(--color-ink)] truncate">
                                        {profile?.handle || '@theaiseed'}
                                      </p>
                                      <p className="text-[10px] font-mono tabular-nums text-[var(--color-ink-muted)]">
                                        {post.status} · {post.postType}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-[11px] text-[var(--color-ink-secondary)] line-clamp-1">
                                    {post.caption}
                                  </p>
                                </div>
                              );
                            })}

                            {/* Empty Cell Hover Actions: Schedule Post or Create Note */}
                            {cellPosts.length === 0 && cellNotes.length === 0 && !matchingSlot && (
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between gap-1 h-full min-h-[52px] px-1">
                                <button
                                  onClick={() => onOpenComposer({ scheduledAt: slotIso })}
                                  className="flex-1 py-1.5 text-[11px] font-medium text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-sm)] cursor-pointer"
                                >
                                  + Post
                                </button>
                                <button
                                  onClick={() =>
                                    setNoteModalSlot({ date: day.date, hour })
                                  }
                                  title="Create Note"
                                  className="p-1.5 text-[var(--color-accent)] bg-[var(--color-surface)] border border-[var(--color-accent)]/40 rounded-[var(--radius-sm)] cursor-pointer"
                                >
                                  <Pin className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODE: VISUAL GRID PREVIEW */}
          {calendarMode === 'preview' && (
            <div className="p-6 flex-1 overflow-auto">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-base font-semibold text-[var(--color-ink)]">
                      Instagram & TikTok Visual Grid Preview
                    </h3>
                    <p className="text-xs text-[var(--color-ink-secondary)]">
                      Select any two tiles to swap their scheduled publishing timestamps.
                    </p>
                  </div>
                  {selectedSwapId && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedSwapId(null)}
                    >
                      Cancel Swap
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {filteredPosts.map((post) => {
                    const media = post.mediaId ? mediaMap.get(post.mediaId) : undefined;
                    const isSelectedForSwap = selectedSwapId === post.id;
                    return (
                      <div
                        key={post.id}
                        className={cn(
                          'group relative aspect-square border rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-surface-subtle)]',
                          isSelectedForSwap
                            ? 'border-2 border-[var(--color-accent)]'
                            : 'border-[var(--color-border-hairline)]'
                        )}
                      >
                        <ResilientMediaImage
                          src={media?.publicUrl}
                          alt={post.caption}
                          className="w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-3 flex flex-col justify-between text-white">
                          <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
                            <span>{post.status}</span>
                            <span>{post.scheduledAt.slice(5, 16).replace('T', ' ')}</span>
                          </div>
                          <div>
                            <p className="text-xs line-clamp-2 mb-2 text-white/95">
                              {post.caption}
                            </p>
                            <div className="flex items-center gap-1.5">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleGridSwap(post.id)}
                              >
                                <ArrowUpDown className="w-3 h-3" />
                                <span>
                                  {isSelectedForSwap
                                    ? 'Selected'
                                    : selectedSwapId
                                    ? 'Swap Here'
                                    : 'Swap Slot'}
                                </span>
                              </Button>
                              {post.status !== PostStatus.PUBLISHED && (
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => onPublishNow(post.id)}
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Publish</span>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* MODE: MONTH VIEW */}
          {calendarMode === 'month' && (
            <div className="p-5 flex-1 overflow-auto">
              <div className="grid grid-cols-7 gap-3">
                {WEEK_DAYS.map((day) => {
                  const dayPosts = filteredPosts.filter(
                    (p) => p.scheduledAt.slice(0, 10) === day.date
                  );
                  return (
                    <div
                      key={day.date}
                      className="border border-[var(--color-border-hairline)] rounded-[var(--radius-md)] p-3 min-h-[220px] flex flex-col justify-between bg-[var(--color-surface)]"
                    >
                      <div>
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--color-border-hairline)]">
                          <span className="text-xs font-medium text-[var(--color-ink-secondary)]">
                            {day.short}
                          </span>
                          <span className="text-xs font-mono font-semibold tabular-nums text-[var(--color-ink)]">
                            Oct {day.dayNum}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {dayPosts.map((post) => {
                            const profile = profileMap.get(post.profileId);
                            return (
                              <div
                                key={post.id}
                                onClick={() => onOpenComposer({ editPost: post })}
                                className="p-2 rounded-[var(--radius-sm)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
                              >
                                <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-[var(--color-ink-secondary)]">
                                  <span>{profile?.platform.slice(0, 2)}</span>
                                  <span>{post.scheduledAt.slice(11, 16)}</span>
                                </div>
                                <p className="text-xs text-[var(--color-ink)] truncate mt-1">
                                  {post.caption}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() =>
                          onOpenComposer({ scheduledAt: `${day.date}T10:00:00.000Z` })
                        }
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Post
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODE: LIST VIEW */}
          {calendarMode === 'list' && (
            <div className="p-5 flex-1 overflow-auto space-y-3">
              {filteredPosts.map((post) => {
                const media = post.mediaId ? mediaMap.get(post.mediaId) : undefined;
                const profile = profileMap.get(post.profileId);
                return (
                  <div
                    key={post.id}
                    className="p-4 border border-[var(--color-border-hairline)] rounded-[var(--radius-md)] flex items-center justify-between gap-4 hover:border-[var(--color-ink)] transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-14 h-14 rounded-[var(--radius-sm)] overflow-hidden shrink-0 bg-[var(--color-surface-subtle)]">
                        <ResilientMediaImage
                          src={media?.publicUrl}
                          alt={post.caption}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs text-[var(--color-ink-secondary)]">
                          <span className="font-semibold text-[var(--color-ink)]">
                            {profile?.platform} · {profile?.handle}
                          </span>
                          <span>·</span>
                          <span className="font-mono tabular-nums">
                            {post.scheduledAt.slice(0, 16).replace('T', ' ')}
                          </span>
                          <span>·</span>
                          <span className="font-mono">{post.status}</span>
                        </div>
                        <p className="text-xs text-[var(--color-ink)] truncate mt-1 max-w-2xl">
                          {post.caption}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenComposer({ editPost: post })}
                      >
                        Edit
                      </Button>
                      {post.status !== PostStatus.PUBLISHED && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => onPublishNow(post.id)}
                        >
                          Publish Now
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Calendar Note Modal */}
      {noteModalSlot && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveNote}
            className="bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-xl)] w-full max-w-md p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[var(--color-ink)] flex items-center gap-2">
                <Pin className="w-4 h-4 text-[var(--color-accent)]" />
                <span>Create Calendar Note</span>
              </h3>
              <span className="text-xs font-mono text-[var(--color-ink-muted)]">
                {noteModalSlot.date} · {noteModalSlot.hour}:00
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">
                Note Title
              </label>
              <Input
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="e.g. Campaign Launch Check"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">
                Details / Checklist
              </label>
              <Input
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
                placeholder="Optional campaign reminder for the team..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setNoteModalSlot(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Pin Note to Calendar
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
