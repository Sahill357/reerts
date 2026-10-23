import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { QueueJob, ScheduledPost, SocialProfile } from '../../types/scheduler';
import { Button, cn } from '../ui/primitives';

interface PublishingQueueModuleProps {
  queueJobs: QueueJob[];
  posts: ScheduledPost[];
  profiles: SocialProfile[];
  onPublishNow: (jobId: string) => Promise<void>;
  onRetryJob: (jobId: string) => Promise<void>;
}

export function PublishingQueueModule({
  queueJobs,
  posts,
  profiles,
  onPublishNow,
  onRetryJob,
}: PublishingQueueModuleProps) {
  const [stateFilter, setStateFilter] = useState<
    'all' | 'delayed' | 'waiting' | 'completed' | 'failed'
  >('all');

  const filteredJobs = queueJobs.filter((job) =>
    stateFilter === 'all' ? true : job.state === stateFilter
  );

  const counts = {
    delayed: queueJobs.filter((j) => j.state === 'delayed' || j.state === 'waiting').length,
    completed: queueJobs.filter((j) => j.state === 'completed').length,
    failed: queueJobs.filter((j) => j.state === 'failed').length,
  };

  return (
    <div className="space-y-6">
      {/* Top KPI Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)]">
          <p className="text-xs text-[var(--color-ink-muted)]">BullMQ Queue Name</p>
          <p className="text-base font-mono font-semibold text-[var(--color-ink)] mt-1">
            social-publishing
          </p>
          <p className="text-[11px] text-[var(--color-ink-secondary)] mt-1">
            Redis 7 AOF persistence enabled
          </p>
        </div>

        <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)]">
          <p className="text-xs text-[var(--color-ink-muted)]">Scheduled / Delayed Jobs</p>
          <p className="text-2xl font-mono font-semibold tabular-nums text-[var(--color-ink)] mt-1">
            {counts.delayed}
          </p>
          <p className="text-[11px] text-[var(--color-ink-secondary)] mt-1">
            Awaiting scheduled timestamp window
          </p>
        </div>

        <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)]">
          <p className="text-xs text-[var(--color-ink-muted)]">Completed Publishes</p>
          <p className="text-2xl font-mono font-semibold tabular-nums text-[var(--color-status-nominal)] mt-1">
            {counts.completed}
          </p>
          <p className="text-[11px] text-[var(--color-ink-secondary)] mt-1">
            Verified via platform webhook
          </p>
        </div>

        <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)]">
          <p className="text-xs text-[var(--color-ink-muted)]">Failed / Rate-Limited</p>
          <p className="text-2xl font-mono font-semibold tabular-nums text-[var(--color-status-danger)] mt-1">
            {counts.failed}
          </p>
          <p className="text-[11px] text-[var(--color-ink-secondary)] mt-1">
            Exponential backoff (5,000ms base)
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
          {(
            [
              { id: 'all', label: 'All Jobs' },
              { id: 'delayed', label: 'Delayed' },
              { id: 'waiting', label: 'Waiting' },
              { id: 'completed', label: 'Completed' },
              { id: 'failed', label: 'Failed' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStateFilter(tab.id)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] transition-colors whitespace-nowrap shrink-0 cursor-pointer',
                stateFilter === tab.id
                  ? 'bg-[var(--color-surface)] text-[var(--color-ink)]'
                  : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* High-Density Queue Job Table */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border-hairline)] bg-[var(--color-surface-subtle)] text-[11px] font-semibold text-[var(--color-ink-secondary)]">
              <th className="py-3 px-4">BullMQ Job ID</th>
              <th className="py-3 px-4">Profile</th>
              <th className="py-3 px-4">Post Caption</th>
              <th className="py-3 px-4">State</th>
              <th className="py-3 px-4 text-right">Attempts</th>
              <th className="py-3 px-4 text-right">Target Window</th>
              <th className="py-3 px-4 text-right">Worker Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-hairline)] text-xs">
            {filteredJobs.map((job) => {
              const post = posts.find((p) => p.id === job.postId);
              const profile = profiles.find((p) => p.id === job.profileId);
              return (
                <tr
                  key={job.id}
                  className="hover:bg-[var(--color-surface-hover)]/60 transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-[11px] text-[var(--color-ink-secondary)]">
                    {job.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-[var(--color-ink)]">
                    {profile?.platform} · {profile?.handle}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <p className="truncate text-[var(--color-ink)]">
                      {post?.caption || 'Scheduled post payload'}
                    </p>
                    {job.errorReason && (
                      <p className="text-[11px] text-[var(--color-status-danger)] mt-0.5">
                        {job.errorReason}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                      {job.state === 'completed' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-status-nominal)]" />
                      )}
                      {(job.state === 'delayed' || job.state === 'waiting') && (
                        <Clock className="w-3.5 h-3.5 text-[var(--color-status-warning)]" />
                      )}
                      {job.state === 'failed' && (
                        <AlertCircle className="w-3.5 h-3.5 text-[var(--color-status-danger)]" />
                      )}
                      <span>{job.state}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-[var(--color-ink-secondary)]">
                    {job.attemptsMade} / {job.maxAttempts}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-[var(--color-ink-secondary)]">
                    {job.scheduledFor.slice(0, 16).replace('T', ' ')}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {job.state === 'failed' ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onRetryJob(job.id)}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retry Job</span>
                      </Button>
                    ) : job.state !== 'completed' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPublishNow(job.id)}
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Publish Now</span>
                      </Button>
                    ) : (
                      <span className="text-[11px] font-mono text-[var(--color-ink-muted)]">
                        Dispatched
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
