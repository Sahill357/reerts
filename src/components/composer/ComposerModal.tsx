import React, { useState } from 'react';
import { X, Sparkles, Hash, Link as LinkIcon, Calendar, Send, Trash2 } from 'lucide-react';
import {
  MediaItem,
  PostStatus,
  PublishMode,
  SavedTimeSlot,
  ScheduledPost,
  SocialProfile,
} from '../../types/scheduler';
import { Button, Input, Textarea, ResilientMediaImage, cn } from '../ui/primitives';

interface ComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: SocialProfile[];
  mediaItems: MediaItem[];
  timeSlots: SavedTimeSlot[];
  initialMediaId?: string;
  initialScheduledAt?: string;
  initialProfileId?: string;
  editPost?: ScheduledPost;
  onSubmitPost: (payload: {
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
  }) => Promise<void>;
  onDeletePost?: (postId: string) => Promise<void>;
}

const HASHTAG_PRESETS = [
  {
    name: 'Ceramics & Craft',
    tags: '#ceramics #stoneware #wheelthrown #minimaldesign #craftsmanship',
  },
  {
    name: 'Architectural Home',
    tags: '#interiordesign #quietluxury #warmminimalism #objectdesign #studiolife',
  },
  {
    name: 'Product Launch',
    tags: '#smallbatch #handcrafted #autumncollection #portlandmaker',
  },
];

export function ComposerModal({
  isOpen,
  onClose,
  profiles,
  mediaItems,
  timeSlots,
  initialMediaId,
  initialScheduledAt,
  initialProfileId,
  editPost,
  onSubmitPost,
  onDeletePost,
}: ComposerModalProps) {
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>(
    editPost
      ? [editPost.profileId]
      : initialProfileId
      ? [initialProfileId]
      : [profiles[0]?.id || 'prof_ig_01']
  );
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(
    editPost?.mediaId ?? initialMediaId ?? mediaItems[0]?.id ?? null
  );
  const [caption, setCaption] = useState<string>(
    editPost?.caption ??
      'New batch from the studio kiln — tactile stoneware forms finished in our signature matte ash glaze. #ceramics #minimaldesign'
  );
  const [firstComment, setFirstComment] = useState<string>(
    editPost?.firstComment ?? 'Explore the full release via the link in our bio.'
  );
  const [postType, setPostType] = useState<'FEED' | 'REEL' | 'CAROUSEL' | 'STORY'>(
    editPost?.postType ?? 'FEED'
  );
  const [publishMode, setPublishMode] = useState<PublishMode>(
    editPost?.publishMode ?? PublishMode.AUTO_PUBLISH
  );
  const [scheduledAt, setScheduledAt] = useState<string>(
    (editPost?.scheduledAt ?? initialScheduledAt ?? '2026-10-23T11:00:00.000Z').slice(0, 16)
  );
  const [linkInBioUrl, setLinkInBioUrl] = useState<string>(
    editPost?.linkInBioUrl ?? 'https://ateliervance.co/collections/autumn-kiln'
  );
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const selectedMedia = mediaItems.find((m) => m.id === selectedMediaId) || mediaItems[0];
  const hashtagCount = (caption.match(/#[a-zA-Z0-9_]+/g) || []).length;

  const toggleProfile = (id: string) => {
    setSelectedProfiles((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((p) => p !== id)
          : prev
        : [...prev, id]
    );
  };

  const applyBestTimeSlot = () => {
    const slot = timeSlots[0];
    const hour = slot ? String(slot.hour).padStart(2, '0') : '11';
    setScheduledAt(`2026-10-23T${hour}:00`);
  };

  const handleSave = async (targetStatus: PostStatus) => {
    setSaving(true);
    try {
      await onSubmitPost({
        id: editPost?.id,
        profileIds: selectedProfiles,
        mediaId: selectedMediaId,
        caption,
        firstComment,
        postType,
        publishMode,
        scheduledAt: new Date(`${scheduledAt}:00.000Z`).toISOString(),
        status: targetStatus,
        linkInBioUrl,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-xl)] w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-hairline)]">
          <div>
            <h2 className="text-base font-semibold text-[var(--color-ink)]">
              {editPost ? 'Edit Scheduled Post' : 'Create & Schedule Multi-Channel Post'}
            </h2>
            <p className="text-xs text-[var(--color-ink-muted)]">
              Dispatches delayed job to BullMQ social-publishing queue with automatic Link in Bio attribution
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Body: 2-Column Split (Editor Left + Live Platform Preview Right) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[var(--color-border-hairline)]">
          {/* Left Editor Column */}
          <div className="lg:col-span-7 p-6 space-y-5">
            {/* Target Profiles */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-ink)] mb-2">
                Target Social Profiles
              </label>
              <div className="flex flex-wrap gap-2">
                {profiles.map((prof) => {
                  const selected = selectedProfiles.includes(prof.id);
                  return (
                    <button
                      key={prof.id}
                      type="button"
                      onClick={() => toggleProfile(prof.id)}
                      className={cn(
                        'px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] border transition-colors whitespace-nowrap shrink-0 cursor-pointer',
                        selected
                          ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)]'
                          : 'bg-[var(--color-surface)] text-[var(--color-ink-secondary)] border-[var(--color-border-hairline)] hover:border-[var(--color-ink)]'
                      )}
                    >
                      {prof.platform} · {prof.handle}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Media Asset Picker Strip */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-ink)] mb-2">
                Attached Media Asset (Cloudflare R2 Library)
              </label>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
                {mediaItems.map((item) => {
                  const active = item.id === selectedMediaId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedMediaId(item.id)}
                      className={cn(
                        'relative w-16 h-16 rounded-[var(--radius-md)] overflow-hidden shrink-0 border-2 transition-all cursor-pointer',
                        active
                          ? 'border-[var(--color-accent)] scale-105'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      )}
                    >
                      <ResilientMediaImage
                        src={item.publicUrl}
                        alt={item.filename}
                        className="w-full h-full"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Post Format & Publishing Mode */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1.5">
                  Post Format
                </label>
                <div className="flex items-center gap-1 p-1 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
                  {(['FEED', 'REEL', 'CAROUSEL', 'STORY'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPostType(type)}
                      className={cn(
                        'flex-1 py-1 text-xs font-medium rounded-[var(--radius-sm)] transition-colors whitespace-nowrap shrink-0 cursor-pointer',
                        postType === type
                          ? 'bg-[var(--color-surface)] text-[var(--color-ink)]'
                          : 'text-[var(--color-ink-secondary)]'
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1.5">
                  Publishing Method
                </label>
                <div className="flex items-center gap-1 p-1 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
                  {(
                    [
                      { id: PublishMode.AUTO_PUBLISH, label: 'Auto-Publish' },
                      { id: PublishMode.NOTIFICATION, label: 'Mobile Reminder' },
                    ] as const
                  ).map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setPublishMode(mode.id)}
                      className={cn(
                        'flex-1 py-1 text-xs font-medium rounded-[var(--radius-sm)] transition-colors whitespace-nowrap shrink-0 cursor-pointer',
                        publishMode === mode.id
                          ? 'bg-[var(--color-surface)] text-[var(--color-ink)]'
                          : 'text-[var(--color-ink-secondary)]'
                      )}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Caption & Saved Hashtag Bank */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[var(--color-ink)]">
                  Post Caption
                </label>
                <span className="text-xs font-mono tabular-nums text-[var(--color-ink-muted)]">
                  {caption.length} / 2,200 chars · {hashtagCount} / 30 hashtags
                </span>
              </div>
              <Textarea
                rows={4}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your caption, mention collaborators, and include hashtags..."
              />
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-[11px] text-[var(--color-ink-muted)] flex items-center gap-1">
                  <Hash className="w-3 h-3" /> Insert Saved Hashtags:
                </span>
                {HASHTAG_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setCaption((prev) => `${prev.trim()} ${preset.tags}`)}
                    className="text-[11px] font-medium text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] underline underline-offset-2 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* First Comment & Link in Bio URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1.5">
                  Auto First Comment
                </label>
                <Input
                  value={firstComment}
                  onChange={(e) => setFirstComment(e.target.value)}
                  placeholder="First comment published automatically..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1.5">
                  Link in Bio Destination URL
                </label>
                <div className="relative">
                  <Input
                    value={linkInBioUrl}
                    onChange={(e) => setLinkInBioUrl(e.target.value)}
                    placeholder="https://ateliervance.co/products/..."
                  />
                </div>
              </div>
            </div>

            {/* Schedule Time & Best Slot Recommender */}
            <div className="p-3.5 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[var(--color-ink-secondary)]" />
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-ink)]">
                    Scheduled Publish Window (PST)
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="mt-1 text-xs font-mono tabular-nums bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-sm)] px-2.5 py-1"
                  />
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={applyBestTimeSlot}>
                <Sparkles className="w-3.5 h-3.5 text-[var(--color-status-nominal)]" />
                <span>Apply Best Time (96% Reach Score)</span>
              </Button>
            </div>
          </div>

          {/* Right Live Preview Column */}
          <div className="lg:col-span-5 p-6 bg-[var(--color-canvas)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[var(--color-ink)]">
                  Live Feed Card Preview
                </span>
                <span className="text-xs font-mono text-[var(--color-ink-muted)]">
                  {postType} · {selectedMedia?.aspectRatio || '1:1'}
                </span>
              </div>

              <div className="bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] overflow-hidden">
                <div className="px-4 py-3 flex items-center justify-between border-b border-[var(--color-border-hairline)]">
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-ink)]">
                      {profiles.find((p) => p.id === selectedProfiles[0])?.handle ||
                        '@ateliervance'}
                    </p>
                    <p className="text-[11px] text-[var(--color-ink-muted)]">
                      Portland, Oregon · Auto-Publish
                    </p>
                  </div>
                  <span className="text-[11px] font-mono tabular-nums text-[var(--color-ink-muted)]">
                    {scheduledAt.replace('T', ' ')}
                  </span>
                </div>

                <div className="aspect-square w-full bg-[var(--color-surface-subtle)] overflow-hidden">
                  <ResilientMediaImage
                    src={selectedMedia?.publicUrl}
                    alt={selectedMedia?.filename || 'Preview'}
                    className="w-full h-full"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-xs text-[var(--color-ink)] leading-relaxed whitespace-pre-wrap">
                    {caption || 'Write a caption to preview your post...'}
                  </p>
                  {firstComment && (
                    <div className="pt-2 border-t border-[var(--color-border-hairline)] text-[11px] text-[var(--color-ink-secondary)]">
                      <span className="font-semibold text-[var(--color-ink)]">First comment: </span>
                      {firstComment}
                    </div>
                  )}
                  {linkInBioUrl && (
                    <div className="pt-1 flex items-center gap-1.5 text-[11px] font-mono text-[var(--color-accent)] truncate">
                      <LinkIcon className="w-3 h-3 shrink-0" />
                      <span className="truncate">{linkInBioUrl}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-6 flex items-center justify-between gap-2">
              <div>
                {editPost && onDeletePost && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={async () => {
                      await onDeletePost(editPost.id);
                      onClose();
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={() => handleSave(PostStatus.DRAFT)}
                >
                  Save Draft
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={saving}
                  onClick={() => handleSave(PostStatus.PUBLISHED)}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Now</span>
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  disabled={saving}
                  onClick={() => handleSave(PostStatus.SCHEDULED)}
                >
                  {editPost ? 'Update Schedule' : 'Schedule Post'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
