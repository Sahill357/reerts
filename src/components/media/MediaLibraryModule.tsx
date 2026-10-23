import React, { useState, useMemo } from 'react';
import {
  UploadCloud,
  Search,
  Star,
  CalendarPlus,
  Trash2,
  Check,
  HardDrive,
} from 'lucide-react';
import { MediaItem } from '../../types/scheduler';
import { Button, Input, Textarea, ResilientMediaImage, cn } from '../ui/primitives';

interface MediaLibraryModuleProps {
  mediaItems: MediaItem[];
  onPresignAndUpload: (payload: {
    filename: string;
    mimeType: string;
    sizeBytes: number;
    aspectRatio: '1:1' | '3:4' | '4:3' | '9:16';
    tags: string[];
    notes: string;
    dataUrl?: string;
  }) => Promise<{ presignedPutUrl: string; objectKey: string; publicReadUrl: string }>;
  onUpdateMedia: (id: string, patch: Partial<MediaItem>) => Promise<void>;
  onDeleteMedia: (id: string) => Promise<void>;
  onScheduleWithMedia: (mediaId: string) => void;
}

export function MediaLibraryModule({
  mediaItems,
  onPresignAndUpload,
  onUpdateMedia,
  onDeleteMedia,
  onScheduleWithMedia,
}: MediaLibraryModuleProps) {
  const [usageFilter, setUsageFilter] = useState<'all' | 'unused' | 'used' | 'starred'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeMediaId, setActiveMediaId] = useState<string>(mediaItems[0]?.id || '');

  // Upload Drawer State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFilename, setNewFilename] = useState('ceramic-tea-caddy-batch05.jpg');
  const [newAspectRatio, setNewAspectRatio] = useState<'1:1' | '3:4' | '4:3' | '9:16'>('1:1');
  const [newTags, setNewTags] = useState('ceramics, launch, tea');
  const [newNotes, setNewNotes] = useState('Shot with 50mm lens on travertine plinth.');
  const [uploadedDataUrl, setUploadedDataUrl] = useState<string | undefined>(undefined);
  const [lastPresignInfo, setLastPresignInfo] = useState<{
    presignedPutUrl: string;
    objectKey: string;
    publicReadUrl: string;
  } | null>(null);
  const [uploading, setUploading] = useState(false);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    mediaItems.forEach((m) => m.tags.forEach((t) => set.add(t)));
    return ['all', ...Array.from(set)];
  }, [mediaItems]);

  const filteredItems = useMemo(() => {
    return mediaItems.filter((item) => {
      if (usageFilter === 'unused' && item.usageCount > 0) return false;
      if (usageFilter === 'used' && item.usageCount === 0) return false;
      if (usageFilter === 'starred' && !item.starred) return false;
      if (selectedTag !== 'all' && !item.tags.includes(selectedTag)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.filename.toLowerCase().includes(q);
        const matchesNotes = item.notes.toLowerCase().includes(q);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        return matchesName || matchesNotes || matchesTags;
      }
      return true;
    });
  }, [mediaItems, usageFilter, selectedTag, searchQuery]);

  const activeMedia =
    mediaItems.find((m) => m.id === activeMediaId) || filteredItems[0] || mediaItems[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewFilename(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const info = await onPresignAndUpload({
        filename: newFilename,
        mimeType: 'image/jpeg',
        sizeBytes: 1740000,
        aspectRatio: newAspectRatio,
        tags: newTags
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
        notes: newNotes,
        dataUrl: uploadedDataUrl,
      });
      setLastPresignInfo(info);
      setShowUploadModal(false);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-5">
      {/* Top Filter & Upload Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--color-border-hairline)]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-[var(--color-ink-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search filename, notes, tags..."
              className="pl-8 py-1.5 text-xs"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
            {(
              [
                { id: 'all', label: 'All Media' },
                { id: 'unused', label: 'Unused' },
                { id: 'used', label: 'Used in Posts' },
                { id: 'starred', label: 'Starred' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setUsageFilter(tab.id)}
                className={cn(
                  'px-3 py-1 text-xs font-medium rounded-[var(--radius-sm)] transition-colors whitespace-nowrap shrink-0 cursor-pointer',
                  usageFilter === tab.id
                    ? 'bg-[var(--color-surface)] text-[var(--color-ink)]'
                    : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            aria-label="Filter by tag"
            className="px-3 py-1.5 text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-md)]"
          >
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag === 'all' ? 'All Tags' : `#${tag}`}
              </option>
            ))}
          </select>
        </div>

        <Button variant="primary" size="md" onClick={() => setShowUploadModal(true)}>
          <UploadCloud className="w-4 h-4" />
          <span>Upload Media to R2</span>
        </Button>
      </div>

      {/* Presigned Upload Confirmation Banner */}
      {lastPresignInfo && (
        <div className="p-3.5 bg-[var(--color-status-nominal-bg)] border border-[var(--color-status-nominal)]/30 rounded-[var(--radius-md)] flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[var(--color-ink)] flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[var(--color-status-nominal)]" />
              Cloudflare R2 Presigned Upload Completed
            </p>
            <p className="text-[11px] font-mono text-[var(--color-ink-secondary)] truncate mt-0.5">
              Key: {lastPresignInfo.objectKey} · Public URL: {lastPresignInfo.publicReadUrl}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setLastPresignInfo(null)}>
            Dismiss
          </Button>
        </div>
      )}

      {/* Main Split Grid + Right Inspector */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* 4-Column Media Grid */}
        <div className="lg:col-span-8 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => {
              const selected = activeMedia?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveMediaId(item.id)}
                  className={cn(
                    'group border rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-surface)] transition-colors cursor-pointer flex flex-col justify-between',
                    selected
                      ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/20'
                      : 'border-[var(--color-border-hairline)] hover:border-[var(--color-ink)]'
                  )}
                >
                  <div className="aspect-square w-full bg-[var(--color-surface-subtle)] overflow-hidden relative">
                    <ResilientMediaImage
                      src={item.publicUrl}
                      alt={item.filename}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-[var(--color-ink)] truncate">
                      {item.filename}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-[var(--color-ink-muted)] font-mono tabular-nums mt-1">
                      <span>{item.aspectRatio}</span>
                      <span>·</span>
                      <span>{item.usageCount === 0 ? 'Unused' : `Used ${item.usageCount}x`}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Asset Detail Inspector */}
        {activeMedia && (
          <aside className="lg:col-span-4 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-ink)] truncate">
                  Asset Inspector
                </h3>
                <button
                  onClick={() =>
                    onUpdateMedia(activeMedia.id, { starred: !activeMedia.starred })
                  }
                  className={cn(
                    'p-1.5 rounded-[var(--radius-sm)] border transition-colors cursor-pointer',
                    activeMedia.starred
                      ? 'text-[var(--color-status-warning)] border-[var(--color-status-warning)]/40 bg-[var(--color-status-warning-bg)]'
                      : 'text-[var(--color-ink-muted)] border-[var(--color-border-hairline)]'
                  )}
                  title="Toggle Starred"
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              <div className="aspect-square w-full rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-surface-subtle)] border border-[var(--color-border-hairline)]">
                <ResilientMediaImage
                  src={activeMedia.publicUrl}
                  alt={activeMedia.filename}
                  className="w-full h-full"
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-[var(--color-border-hairline)]">
                  <span className="text-[var(--color-ink-muted)]">Filename</span>
                  <span className="font-mono text-[var(--color-ink)] truncate max-w-[200px]">
                    {activeMedia.filename}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--color-border-hairline)]">
                  <span className="text-[var(--color-ink-muted)]">Dimensions & Ratio</span>
                  <span className="font-mono tabular-nums text-[var(--color-ink)]">
                    {activeMedia.width}×{activeMedia.height} ({activeMedia.aspectRatio})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--color-border-hairline)]">
                  <span className="text-[var(--color-ink-muted)]">R2 Object Key</span>
                  <span className="font-mono text-[11px] text-[var(--color-ink-secondary)] truncate max-w-[200px]">
                    {activeMedia.objectKey}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--color-border-hairline)]">
                  <span className="text-[var(--color-ink-muted)]">Post Usage</span>
                  <span className="font-mono tabular-nums text-[var(--color-ink)]">
                    {activeMedia.usageCount} scheduled/published
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">
                  Media Notes
                </label>
                <Textarea
                  rows={3}
                  value={activeMedia.notes}
                  onChange={(e) =>
                    onUpdateMedia(activeMedia.id, { notes: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">
                  Tags
                </label>
                <p className="text-xs text-[var(--color-ink-secondary)] font-mono">
                  {activeMedia.tags.map((t) => `#${t}`).join(' · ')}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[var(--color-border-hairline)] flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteMedia(activeMedia.id)}
              >
                <Trash2 className="w-3.5 h-3.5 text-[var(--color-status-danger)]" />
                <span>Delete</span>
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => onScheduleWithMedia(activeMedia.id)}
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Schedule Post with Asset</span>
              </Button>
            </div>
          </aside>
        )}
      </div>

      {/* Cloudflare R2 Presigned Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleUploadSubmit}
            className="bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-xl)] w-full max-w-lg p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[var(--color-accent)]" />
                <h3 className="text-base font-semibold text-[var(--color-ink)]">
                  Cloudflare R2 Presigned Media Upload
                </h3>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowUploadModal(false)}
              >
                Close
              </Button>
            </div>

            <p className="text-xs text-[var(--color-ink-secondary)]">
              Requests an S3-compatible presigned `PutObjectCommand` URL from `/api/media/presign` and commits the asset metadata to PostgreSQL.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">
                Select Local Image (Optional — or generate studio asset)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs text-[var(--color-ink-secondary)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">
                  Filename
                </label>
                <Input
                  value={newFilename}
                  onChange={(e) => setNewFilename(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">
                  Target Aspect Ratio
                </label>
                <select
                  value={newAspectRatio}
                  onChange={(e) =>
                    setNewAspectRatio(e.target.value as '1:1' | '3:4' | '4:3' | '9:16')
                  }
                  className="w-full px-3 py-2 text-sm bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-md)]"
                >
                  <option value="1:1">1:1 Square Feed</option>
                  <option value="3:4">3:4 Portrait Feed</option>
                  <option value="9:16">9:16 Vertical Reel/TikTok</option>
                  <option value="4:3">4:3 Landscape Editorial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">
                Tags (comma separated)
              </label>
              <Input value={newTags} onChange={(e) => setNewTags(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">
                Internal Studio Notes
              </label>
              <Textarea
                rows={2}
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={uploading}>
                {uploading ? 'Signing & Uploading...' : 'Presign & Upload Asset'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
