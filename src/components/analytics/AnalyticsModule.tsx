import React, { useState, useMemo } from 'react';
import { Download, Calendar } from 'lucide-react';
import {
  DailyMetricPoint,
  LinkInBioButton,
  ScheduledPost,
  SocialProfile,
} from '../../types/scheduler';
import { Button, cn } from '../ui/primitives';

interface AnalyticsModuleProps {
  dailyMetrics: DailyMetricPoint[];
  posts: ScheduledPost[];
  profiles: SocialProfile[];
  bioButtons: LinkInBioButton[];
  initialTab?:
    | 'overview'
    | 'audience'
    | 'posts'
    | 'reels'
    | 'stories'
    | 'hashtags'
    | 'linkinbio'
    | 'custom';
}

const HEATMAP_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const HEATMAP_HOURS = [
  '12AM',
  '2AM',
  '4AM',
  '6AM',
  '8AM',
  '10AM',
  '12PM',
  '2PM',
  '4PM',
  '6PM',
  '8PM',
  '10PM',
];

export function AnalyticsModule({
  dailyMetrics,
  posts,
  profiles,
  bioButtons,
  initialTab = 'overview',
}: AnalyticsModuleProps) {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'audience'
    | 'posts'
    | 'reels'
    | 'stories'
    | 'hashtags'
    | 'linkinbio'
    | 'custom'
  >(initialTab);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    profiles[0]?.id || 'ALL'
  );

  const selectedProfile =
    profiles.find((p) => p.id === selectedProfileId) || profiles[0];

  const filteredPosts = useMemo(() => {
    const byProfile =
      selectedProfileId === 'ALL'
        ? posts
        : posts.filter((p) => p.profileId === selectedProfileId);
    if (activeTab === 'reels') {
      return byProfile.filter((p) => p.postType === 'REEL');
    }
    return byProfile;
  }, [posts, selectedProfileId, activeTab]);

  const totals = useMemo(() => {
    const impressions = dailyMetrics.reduce((acc, m) => acc + m.impressions, 0);
    const reach = dailyMetrics.reduce((acc, m) => acc + m.reach, 0);
    const engagements = dailyMetrics.reduce((acc, m) => acc + m.engagements, 0);
    const bioClicks = dailyMetrics.reduce((acc, m) => acc + m.bioClicks, 0);
    const pageViews = dailyMetrics.reduce((acc, m) => acc + m.pageViews, 0);
    const engagementRate =
      reach > 0 ? ((engagements / reach) * 100).toFixed(2) : '6.95';
    return { impressions, reach, engagements, bioClicks, pageViews, engagementRate };
  }, [dailyMetrics]);

  const handleExportCsv = () => {
    const headers = [
      'Post ID',
      'Platform',
      'Format',
      'Status',
      'Scheduled At',
      'Impressions',
      'Reach',
      'Views',
      'Likes',
      'Comments',
      'Saves',
      'Bio Clicks',
    ];
    const rows = filteredPosts.map((p) => {
      const prof = profiles.find((pr) => pr.id === p.profileId);
      return [
        p.id,
        prof?.platform || 'INSTAGRAM',
        p.postType,
        p.status,
        p.scheduledAt,
        p.impressions,
        p.reach,
        p.views,
        p.likes,
        p.comments,
        p.saves,
        p.bioClicks,
      ].join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reerts-analytics-${activeTab}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Row 1: Breadcrumb + Profile Switcher + Date Range + CSV Export */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">Analytics</h2>
          <span className="text-[var(--color-ink-muted)]">/</span>
          <select
            value={selectedProfileId}
            onChange={(e) => setSelectedProfileId(e.target.value)}
            aria-label="Select profile for analytics"
            className="px-3 py-1.5 text-xs font-semibold bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-md)]"
          >
            <option value="ALL">All Connected Profiles</option>
            {profiles.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.handle} ({prof.platform})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-[var(--color-ink-secondary)] bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-md)]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Oct 16, 2026 – Oct 23, 2026</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportCsv}>
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Row 2: Sub-Navigation Tabs matching Analytics screenshots */}
      <div className="flex items-center gap-1 p-1 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] overflow-x-auto">
        {(
          [
            { id: 'overview', label: 'Overview' },
            { id: 'audience', label: 'Audience' },
            { id: 'posts', label: 'Post Performance' },
            { id: 'reels', label: 'Reel Performance' },
            { id: 'stories', label: 'Story Performance' },
            { id: 'hashtags', label: 'Hashtag Analytics' },
            { id: 'linkinbio', label: 'Reerts.bio Analytics' },
            { id: 'custom', label: 'Custom Analytics' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-3.5 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] transition-colors cursor-pointer whitespace-nowrap shrink-0',
              activeTab === tab.id
                ? 'bg-[var(--color-surface)] text-[var(--color-accent)] font-semibold shadow-2xs'
                : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW (matching screenshot 10) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-semibold text-[var(--color-ink)] mb-3">
              Profile Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] divide-y md:divide-y-0 md:divide-x divide-[var(--color-border-hairline)]">
              <div className="p-5">
                <p className="text-2xl font-mono font-semibold tabular-nums text-[var(--color-ink)]">
                  {filteredPosts.length}
                </p>
                <p className="text-[11px] font-medium text-[var(--color-ink-muted)] mt-1">
                  TOTAL POSTS
                </p>
              </div>
              <div className="p-5">
                <p className="text-2xl font-mono font-semibold tabular-nums text-[var(--color-ink)]">
                  {(selectedProfile?.followersCount || 53106).toLocaleString()}
                </p>
                <p className="text-[11px] font-medium text-[var(--color-ink-muted)] mt-1">
                  FOLLOWERS
                </p>
              </div>
              <div className="p-5">
                <p className="text-2xl font-mono font-semibold tabular-nums text-[var(--color-ink)]">
                  {selectedProfile?.followingCount || 184}
                </p>
                <p className="text-[11px] font-medium text-[var(--color-ink-muted)] mt-1">
                  FOLLOWING
                </p>
              </div>
            </div>
          </div>

          {/* Profile Growth & Discovery Chart */}
          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[var(--color-ink)]">
                  Profile Growth & Discovery
                </h3>
                <p className="text-xs text-[var(--color-ink-secondary)]">
                  Daily impressions, unique reach, and follower discovery trajectory
                </p>
              </div>
              <span className="text-xs font-mono tabular-nums text-[var(--color-status-nominal)]">
                +12.51% follower growth in period
              </span>
            </div>

            <div className="grid grid-cols-7 gap-4 items-end h-44 pt-4 px-2">
              {dailyMetrics.map((d) => {
                const height = Math.max(Math.round((d.impressions / 48600) * 120), 16);
                return (
                  <div key={d.date} className="flex flex-col items-center gap-2">
                    <span className="text-[11px] font-mono tabular-nums text-[var(--color-ink-secondary)]">
                      {(d.impressions / 1000).toFixed(1)}k
                    </span>
                    <div
                      style={{ height: `${height}px` }}
                      className="w-full max-w-[42px] bg-[var(--color-accent)] rounded-t-[var(--radius-sm)]"
                    />
                    <span className="text-xs font-medium text-[var(--color-ink)]">
                      {d.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIENCE ONLINE ACTIVITY HEATMAP (matching screenshot 9) */}
      {activeTab === 'audience' && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-[var(--color-ink)]">
                Audience Engagement — Followers Online Activity
              </h3>
              <p className="text-xs text-[var(--color-ink-secondary)] mt-0.5">
                Understand when your followers are active on {selectedProfile?.handle} to optimize your automated publishing schedule.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--color-ink-secondary)]">
              <span>LOW</span>
              <div className="flex items-center gap-0.5">
                <span className="w-5 h-2 bg-indigo-100 inline-block" />
                <span className="w-5 h-2 bg-indigo-300 inline-block" />
                <span className="w-5 h-2 bg-indigo-500 inline-block" />
                <span className="w-5 h-2 bg-indigo-700 inline-block" />
              </div>
              <span>HIGH</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-8 gap-1 mb-1">
                <div />
                {HEATMAP_DAYS.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-[var(--color-ink-secondary)] py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>
              {HEATMAP_HOURS.map((hourLabel, rIdx) => (
                <div key={hourLabel} className="grid grid-cols-8 gap-1 mb-1">
                  <div className="text-[11px] font-mono text-[var(--color-ink-muted)] flex items-center justify-end pr-2">
                    {hourLabel}
                  </div>
                  {HEATMAP_DAYS.map((day, cIdx) => {
                    const intensity = ((rIdx * 3 + cIdx * 5) % 4) + 1;
                    const bgClass =
                      rIdx >= 4 && rIdx <= 8
                        ? intensity >= 3
                          ? 'bg-indigo-600 text-white'
                          : 'bg-indigo-400 text-white'
                        : intensity >= 3
                        ? 'bg-indigo-200 text-indigo-950'
                        : 'bg-zinc-100 text-zinc-500';
                    const pct = rIdx >= 4 && rIdx <= 8 ? 78 + intensity * 5 : 35 + intensity * 6;
                    return (
                      <div
                        key={`${day}-${hourLabel}`}
                        className={cn(
                          'h-7 rounded-[var(--radius-xs)] flex items-center justify-center text-[10px] font-mono tabular-nums transition-opacity hover:opacity-90',
                          bgClass
                        )}
                      >
                        {pct}%
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3 & 4 & 5: POST / REEL / STORY PERFORMANCE (matching screenshots 2 & 3) */}
      {(activeTab === 'posts' || activeTab === 'reels' || activeTab === 'stories') && (
        <div className="space-y-6">
          {/* Highlights Strip */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-3">
              Highlights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] divide-y md:divide-y-0 md:divide-x divide-[var(--color-border-hairline)]">
              <div className="p-5">
                <p className="text-[11px] font-semibold text-[var(--color-ink-secondary)] underline decoration-dashed underline-offset-4">
                  ENGAGEMENT RATE
                </p>
                <p className="text-2xl font-mono font-semibold tabular-nums text-[var(--color-ink)] mt-2">
                  {totals.engagementRate}%
                </p>
              </div>
              <div className="p-5">
                <p className="text-[11px] font-semibold text-[var(--color-ink-secondary)] underline decoration-dashed underline-offset-4">
                  ENGAGEMENTS
                </p>
                <p className="text-2xl font-mono font-semibold tabular-nums text-[var(--color-ink)] mt-2">
                  {totals.engagements.toLocaleString()}
                </p>
              </div>
              <div className="p-5">
                <p className="text-[11px] font-semibold text-[var(--color-ink-secondary)] underline decoration-dashed underline-offset-4">
                  {activeTab === 'reels' ? 'REACH' : 'VIEWS'}
                </p>
                <p className="text-2xl font-mono font-semibold tabular-nums text-[var(--color-ink)] mt-2">
                  {totals.reach.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Performance Table */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] overflow-hidden">
            <div className="p-5 border-b border-[var(--color-border-hairline)] flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-[var(--color-ink)]">
                  Detailed {activeTab === 'reels' ? 'Reel' : activeTab === 'stories' ? 'Story' : 'Post'} Performance
                </h3>
                <p className="text-xs text-[var(--color-ink-secondary)] mt-0.5">
                  Performance metrics for posts published through Reerts across the last 90 days.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--color-ink-secondary)]">
                <span>LOW</span>
                <div className="w-28 h-2 rounded-full bg-gradient-to-r from-indigo-100 via-indigo-400 to-indigo-700" />
                <span>HIGH</span>
              </div>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border-hairline)] bg-[var(--color-surface-subtle)] text-[11px] font-semibold text-[var(--color-ink-secondary)]">
                  <th className="py-3 px-4">Post</th>
                  <th className="py-3 px-4 text-right">Engagement Rate</th>
                  <th className="py-3 px-4 text-right">Engagements</th>
                  <th className="py-3 px-4 text-right">Views</th>
                  <th className="py-3 px-4 text-right">Reach</th>
                  <th className="py-3 px-4 text-right">Likes</th>
                  <th className="py-3 px-4 text-right">Comments</th>
                  <th className="py-3 px-4 text-right">Saves</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-hairline)] text-xs">
                {filteredPosts.map((post) => {
                  const eng = post.likes + post.comments + post.saves;
                  const rate =
                    post.reach > 0 ? ((eng / post.reach) * 100).toFixed(2) : '0.00';
                  return (
                    <tr key={post.id} className="hover:bg-[var(--color-surface-hover)]/50">
                      <td className="py-3 px-4 max-w-xs">
                        <p className="font-medium text-[var(--color-ink)] truncate">
                          {post.caption}
                        </p>
                        <p className="text-[11px] font-mono text-[var(--color-ink-muted)]">
                          {post.scheduledAt.slice(0, 10)} · {post.postType}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-[var(--color-accent)]">
                        {rate}%
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        {eng.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        {post.views.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        {post.reach.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        {post.likes.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        {post.comments.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        {post.saves.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: HASHTAG ANALYTICS */}
      {activeTab === 'hashtags' && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] overflow-hidden">
          <div className="p-5 border-b border-[var(--color-border-hairline)]">
            <h3 className="text-base font-semibold text-[var(--color-ink)]">
              Hashtag Performance & Reach Attribution
            </h3>
            <p className="text-xs text-[var(--color-ink-secondary)] mt-0.5">
              Ranked by average engagement rate across published posts
            </p>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border-hairline)] bg-[var(--color-surface-subtle)] text-[11px] font-semibold text-[var(--color-ink-secondary)]">
                <th className="py-3 px-4">Hashtag</th>
                <th className="py-3 px-4 text-right">Posts Used</th>
                <th className="py-3 px-4 text-right">Avg Reach</th>
                <th className="py-3 px-4 text-right">Avg Engagement Rate</th>
                <th className="py-3 px-4 text-right">Saves Driven</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-hairline)] text-xs font-mono tabular-nums">
              {[
                { tag: '#ceramics', count: 14, reach: 28400, er: '7.82%', saves: 640 },
                { tag: '#minimaldesign', count: 12, reach: 24100, er: '6.94%', saves: 512 },
                { tag: '#matcharitual', count: 6, reach: 39200, er: '8.45%', saves: 890 },
                { tag: '#stoneware', count: 11, reach: 19800, er: '6.12%', saves: 380 },
              ].map((h) => (
                <tr key={h.tag}>
                  <td className="py-3 px-4 font-semibold text-[var(--color-ink)]">
                    {h.tag}
                  </td>
                  <td className="py-3 px-4 text-right">{h.count}</td>
                  <td className="py-3 px-4 text-right">{h.reach.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-[var(--color-status-nominal)]">
                    {h.er}
                  </td>
                  <td className="py-3 px-4 text-right">{h.saves}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 7: LINK IN BIO INTERACTIONS (matching screenshot 7) */}
      {activeTab === 'linkinbio' && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-ink)]">
              Reerts.bio Interactions
            </h3>
            <p className="text-xs text-[var(--color-ink-secondary)] mt-0.5">
              See how visitors interact with your Link in Bio page over time:{' '}
              <strong className="font-mono text-[var(--color-accent)]">
                reerts.bio/theaiseed
              </strong>
            </p>
          </div>

          {[
            {
              label: 'PAGE VIEWS',
              total: totals.pageViews,
              key: 'pageViews' as const,
            },
            {
              label: 'BUTTON CLICKS',
              total: bioButtons.reduce((a, b) => a + b.clicks, 0),
              key: 'bioClicks' as const,
            },
            {
              label: 'POST CLICKS',
              total: posts.reduce((a, p) => a + p.bioClicks, 0),
              key: 'bioClicks' as const,
            },
          ].map((section) => (
            <div
              key={section.label}
              className="pt-5 border-t border-[var(--color-border-hairline)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold underline decoration-dashed underline-offset-4 text-[var(--color-ink)]">
                  {section.label}
                </span>
                <div className="text-right">
                  <p className="text-2xl font-mono font-semibold tabular-nums text-[var(--color-ink)]">
                    {section.total.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-mono text-[var(--color-ink-muted)]">
                    {section.label}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-3 pt-2">
                {dailyMetrics.map((d) => (
                  <div
                    key={`${section.label}-${d.date}`}
                    className="p-2.5 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-center"
                  >
                    <p className="text-xs font-mono font-semibold tabular-nums text-[var(--color-accent)]">
                      {d[section.key]}
                    </p>
                    <p className="text-[10px] text-[var(--color-ink-muted)] mt-0.5">
                      {d.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 8: CUSTOM ANALYTICS — ORGANIC SOCIAL OVERVIEW (matching screenshot 8) */}
      {activeTab === 'custom' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] p-5">
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                Organic Social Overview
              </h3>
              <p className="text-xs text-[var(--color-ink-secondary)]">
                Cross-channel executive telemetry across Instagram, Threads, TikTok, and LinkedIn
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[var(--color-ink-muted)]">Total Followers</p>
              <p className="text-2xl font-mono font-semibold tabular-nums text-[var(--color-ink)]">
                53,106
              </p>
              <p className="text-[11px] font-mono text-[var(--color-status-nominal)]">
                +12.51% from 47,201
              </p>
            </div>
            <div className="text-right text-xs font-mono text-[var(--color-ink-secondary)]">
              <p>Analysis Period: Oct 1, 2026 – Current</p>
              <p className="text-[var(--color-ink-muted)]">
                Comparison Period: Sep 1, 2026 – Sep 22, 2026
              </p>
            </div>
          </div>

          {/* 8-Card KPI Grid matching screenshot 8 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Posts Created', value: '15', delta: '+25% from 12', positive: true },
              {
                label: 'Engagement Growth',
                value: '2,891',
                delta: '+37% from 2,110',
                positive: true,
              },
              {
                label: 'Engagement Rate',
                value: '6.95%',
                delta: '+1.1% from 5.84%',
                positive: true,
              },
              {
                label: 'Impressions Growth',
                value: '156,450',
                delta: '+33% from 117,600',
                positive: true,
              },
              {
                label: 'Audience Growth',
                value: '+1,420',
                delta: '+18% from 1,203',
                positive: true,
              },
              {
                label: 'Like Growth',
                value: '5,300',
                delta: '+21% from 4,380',
                positive: true,
              },
              {
                label: 'Comments Growth',
                value: '276',
                delta: '+32% from 209',
                positive: true,
              },
              {
                label: 'Shares Growth',
                value: '446',
                delta: '+22% from 365',
                positive: true,
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="p-5 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] text-center"
              >
                <p className="text-xs font-semibold text-[var(--color-ink-secondary)]">
                  {kpi.label}
                </p>
                <p className="text-2xl font-mono font-semibold tabular-nums text-[var(--color-ink)] my-1.5">
                  {kpi.value}
                </p>
                <p className="text-[11px] font-mono tabular-nums text-[var(--color-status-nominal)]">
                  {kpi.delta}
                </p>
              </div>
            ))}
          </div>

          {/* Stacked Multi-Platform Bar Chart matching screenshot 8 */}
          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h4 className="text-sm font-semibold text-[var(--color-ink)]">
                Daily Impressions Change by Platform
              </h4>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-amber-400 inline-block rounded-xs" />
                  Instagram
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-emerald-500 inline-block rounded-xs" />
                  Threads
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-pink-400 inline-block rounded-xs" />
                  Pinterest
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-indigo-500 inline-block rounded-xs" />
                  TikTok
                </span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-4 items-end h-52 pt-6 px-2">
              {dailyMetrics.map((d) => {
                const igH = Math.max(Math.round((d.instagramImpressions / 22000) * 60), 10);
                const thH = Math.max(Math.round((d.threadsImpressions / 22000) * 50), 8);
                const liH = Math.max(Math.round((d.linkedinImpressions / 22000) * 45), 8);
                const ttH = Math.max(Math.round((d.tiktokImpressions / 22000) * 60), 12);
                return (
                  <div key={d.date} className="flex flex-col items-center">
                    <div className="w-full max-w-[48px] flex flex-col rounded-t-[var(--radius-sm)] overflow-hidden">
                      <div style={{ height: `${igH}px` }} className="bg-amber-400" />
                      <div style={{ height: `${thH}px` }} className="bg-emerald-500" />
                      <div style={{ height: `${liH}px` }} className="bg-pink-400" />
                      <div style={{ height: `${ttH}px` }} className="bg-indigo-500" />
                    </div>
                    <span className="text-xs font-mono text-[var(--color-ink-secondary)] mt-2">
                      {d.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
