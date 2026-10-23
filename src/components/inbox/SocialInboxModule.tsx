import React, { useState, useMemo } from 'react';
import {
  Search,
  Send,
  CheckCircle2,
  MessageSquare,
  Mail,
  RotateCcw,
} from 'lucide-react';
import {
  InboxThread,
  MediaItem,
  ScheduledPost,
  SocialProfile,
} from '../../types/scheduler';
import { Button, Input, ResilientMediaImage, cn } from '../ui/primitives';

interface SocialInboxModuleProps {
  threads: InboxThread[];
  profiles: SocialProfile[];
  posts: ScheduledPost[];
  mediaItems: MediaItem[];
  onReplyThread: (threadId: string, text: string) => Promise<void>;
  onUpdateThreadStatus: (threadId: string, status: 'OPEN' | 'RESOLVED') => Promise<void>;
}

export function SocialInboxModule({
  threads,
  profiles,
  posts,
  mediaItems,
  onReplyThread,
  onUpdateThreadStatus,
}: SocialInboxModuleProps) {
  const [selectedProfileId, setSelectedProfileId] = useState<string>('ALL');
  const [modeFilter, setModeFilter] = useState<'ALL' | 'COMMENT' | 'DM'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0]?.id || '');
  const [replyText, setReplyText] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);

  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      if (selectedProfileId !== 'ALL' && t.profileId !== selectedProfileId) return false;
      if (modeFilter !== 'ALL' && t.type !== modeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.authorName.toLowerCase().includes(q) ||
          t.authorHandle.toLowerCase().includes(q) ||
          t.messages.some((m) => m.text.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [threads, selectedProfileId, modeFilter, searchQuery]);

  const activeThread =
    filteredThreads.find((t) => t.id === activeThreadId) ||
    filteredThreads[0] ||
    threads[0];

  const referencedPost = activeThread?.postId
    ? posts.find((p) => p.id === activeThread.postId)
    : undefined;

  const referencedMedia = referencedPost?.mediaId
    ? mediaItems.find((m) => m.id === referencedPost.mediaId)
    : undefined;

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || !replyText.trim()) return;
    setSending(true);
    try {
      await onReplyThread(activeThread.id, replyText.trim());
      setReplyText('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-5">
      {/* Top Profile Bar matching Social Inbox screenshot */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--color-border-hairline)]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-[var(--color-ink-secondary)] mr-1">
            Select Profiles
          </span>
          <button
            onClick={() => setSelectedProfileId('ALL')}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] border transition-colors cursor-pointer whitespace-nowrap shrink-0',
              selectedProfileId === 'ALL'
                ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)]'
                : 'bg-[var(--color-surface)] text-[var(--color-ink-secondary)] border-[var(--color-border-hairline)]'
            )}
          >
            All Profiles ({threads.length})
          </button>
          {profiles.map((prof) => (
            <button
              key={prof.id}
              onClick={() => setSelectedProfileId(prof.id)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] border transition-colors cursor-pointer whitespace-nowrap shrink-0',
                selectedProfileId === prof.id
                  ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-ink-secondary)] border-[var(--color-border-hairline)]'
              )}
            >
              {prof.platform} · {prof.handle}
            </button>
          ))}
        </div>

        <div className="text-xs text-[var(--color-ink-secondary)] font-mono tabular-nums">
          {threads.filter((t) => t.status === 'OPEN').length} open threads ·{' '}
          {threads.filter((t) => t.unread).length} unread
        </div>
      </div>

      {/* Main Split Inbox View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left Conversation List */}
        <div className="lg:col-span-4 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] p-4 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1 p-1 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
              {(
                [
                  { id: 'ALL', label: 'Inbox' },
                  { id: 'COMMENT', label: 'Comments' },
                  { id: 'DM', label: 'DMs' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setModeFilter(tab.id)}
                  className={cn(
                    'px-3 py-1 text-xs font-medium rounded-[var(--radius-sm)] transition-colors cursor-pointer whitespace-nowrap shrink-0',
                    modeFilter === tab.id
                      ? 'bg-[var(--color-surface)] text-[var(--color-ink)] shadow-2xs'
                      : 'text-[var(--color-ink-secondary)]'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <span className="text-[11px] font-mono text-[var(--color-ink-muted)]">
              Newest
            </span>
          </div>

          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 text-[var(--color-ink-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a conversation..."
              className="pl-8 py-1.5 text-xs"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
            {filteredThreads.map((thread) => {
              const selected = activeThread?.id === thread.id;
              const lastMsg = thread.messages[thread.messages.length - 1];
              return (
                <button
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={cn(
                    'w-full text-left p-3.5 rounded-[var(--radius-md)] border transition-colors cursor-pointer',
                    selected
                      ? 'bg-[var(--color-accent-soft)]/70 border-[var(--color-accent)]'
                      : 'bg-[var(--color-surface)] border-[var(--color-border-hairline)] hover:bg-[var(--color-surface-subtle)]/60'
                  )}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-[var(--color-ink)] truncate">
                      {thread.authorHandle}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--color-ink-muted)] shrink-0">
                      {thread.type === 'COMMENT' ? (
                        <MessageSquare className="w-3 h-3" />
                      ) : (
                        <Mail className="w-3 h-3" />
                      )}
                      <span>{thread.lastActivityLabel}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--color-ink-secondary)] line-clamp-2">
                    {lastMsg?.text}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Threaded Conversation Detail & Reply Box */}
        {activeThread && (
          <div className="lg:col-span-8 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] flex flex-col overflow-hidden">
            {/* Thread Header */}
            <div className="px-6 py-4 border-b border-[var(--color-border-hairline)] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-ink)]">
                  {activeThread.authorName}{' '}
                  <span className="font-normal text-[var(--color-ink-muted)]">
                    {activeThread.authorHandle}
                  </span>
                </h3>
                <p className="text-xs text-[var(--color-ink-secondary)] mt-0.5">
                  {activeThread.platform} · {activeThread.type} on{' '}
                  <strong className="text-[var(--color-ink)]">
                    {activeThread.postPreviewTitle}
                  </strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onUpdateThreadStatus(
                      activeThread.id,
                      activeThread.status === 'OPEN' ? 'RESOLVED' : 'OPEN'
                    )
                  }
                >
                  {activeThread.status === 'OPEN' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-status-nominal)]" />
                      <span>Mark Resolved</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reopen Thread</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Referenced Post Context Strip */}
            {referencedPost && (
              <div className="px-6 py-3 bg-[var(--color-surface-subtle)]/70 border-b border-[var(--color-border-hairline)] flex items-center gap-3">
                <div className="w-12 h-12 rounded-[var(--radius-sm)] overflow-hidden shrink-0 bg-[var(--color-surface)] border border-[var(--color-border-hairline)]">
                  <ResilientMediaImage
                    src={referencedMedia?.publicUrl}
                    alt={referencedPost.caption}
                    className="w-full h-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-mono text-[var(--color-ink-muted)]">
                    Referenced Post · {referencedPost.scheduledAt.slice(0, 10)}
                  </p>
                  <p className="text-xs text-[var(--color-ink)] truncate">
                    {referencedPost.caption}
                  </p>
                </div>
              </div>
            )}

            {/* Messages Timeline */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {activeThread.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'max-w-xl rounded-[var(--radius-lg)] p-4 border',
                    msg.isBrandOwner
                      ? 'ml-auto bg-[var(--color-accent-soft)]/60 border-[var(--color-accent)]/30'
                      : 'bg-[var(--color-surface-subtle)]/50 border-[var(--color-border-hairline)]'
                  )}
                >
                  <div className="flex items-center justify-between gap-4 mb-1.5 text-[11px]">
                    <span className="font-semibold text-[var(--color-ink)]">
                      {msg.senderName} ({msg.senderHandle})
                    </span>
                    <span className="font-mono text-[var(--color-ink-muted)]">
                      {msg.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-ink)] leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Reply Composer */}
            <form
              onSubmit={handleSendReply}
              className="p-4 border-t border-[var(--color-border-hairline)] bg-[var(--color-surface)] flex items-center gap-3"
            >
              <Input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply as @theaiseed to ${activeThread.authorHandle}...`}
                className="flex-1"
              />
              <Button type="submit" variant="primary" disabled={sending || !replyText.trim()}>
                <Send className="w-3.5 h-3.5" />
                <span>{sending ? 'Sending...' : 'Send Reply'}</span>
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
