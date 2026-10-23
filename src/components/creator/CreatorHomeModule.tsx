import React, { useState } from 'react';
import {
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  ArrowUpRight,
  Globe,
  Users,
} from 'lucide-react';
import {
  CreatorCampaign,
  MediaItem,
  SocialProfile,
  UserSession,
} from '../../types/scheduler';
import { Button, ResilientMediaImage, cn } from '../ui/primitives';

interface CreatorHomeModuleProps {
  session: UserSession;
  profiles: SocialProfile[];
  mediaItems: MediaItem[];
  campaigns: CreatorCampaign[];
  onApplyCampaign: (campaignId: string) => Promise<void>;
}

export function CreatorHomeModule({
  session,
  profiles,
  mediaItems,
  campaigns,
  onApplyCampaign,
}: CreatorHomeModuleProps) {
  const [subTab, setSubTab] = useState<'home' | 'mediakit' | 'find' | 'manage'>('home');

  const totalFollowers = profiles.reduce((acc, p) => acc + p.followersCount, 0);

  return (
    <div className="space-y-6">
      {/* Top Sub-Navigation matching Creator Home screenshot */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--color-border-hairline)]">
        <div className="flex items-center gap-1 p-1 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
          {(
            [
              { id: 'home', label: 'Creator Home' },
              { id: 'mediakit', label: 'Media Kit' },
              { id: 'find', label: 'Find Campaigns' },
              { id: 'manage', label: 'Manage Campaigns' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={cn(
                'px-3.5 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] transition-colors cursor-pointer whitespace-nowrap shrink-0',
                subTab === tab.id
                  ? 'bg-[var(--color-surface)] text-[var(--color-ink)] shadow-2xs'
                  : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-[var(--color-ink-secondary)] font-mono tabular-nums">
          Total Verified Audience: {totalFollowers.toLocaleString()} followers
        </div>
      </div>

      {/* Creator Home Overview */}
      {subTab === 'home' && (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-xl)] flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                Welcome to Reerts Creator Marketplace
              </h2>
              <p className="text-xs text-[var(--color-ink-secondary)] mt-1 leading-relaxed">
                Connect directly with architectural, design, and lifestyle brands. Share your live Media Kit with verified first-party engagement metrics and apply to sponsored campaigns.
              </p>
            </div>
            <Button variant="primary" onClick={() => setSubTab('find')}>
              <span>Browse Brand Campaigns</span>
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Creator Profile Card matching screenshot 13 */}
          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-ink)]">
                Creator Profile Preview
              </h3>
              <p className="text-xs text-[var(--color-ink-muted)]">
                How your studio profile appears to brand partners in the marketplace
              </p>
            </div>

            <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-xl)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-[var(--color-border-hairline)] shrink-0">
                  <ResilientMediaImage
                    src={session.user.avatarUrl}
                    alt={session.workspace.name}
                    className="w-full h-full"
                  />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-[var(--color-ink)]">
                    {session.workspace.name}
                  </h4>
                  <p className="text-xs text-[var(--color-ink-secondary)] mt-0.5">
                    Top audience locations: United States · Japan · United Kingdom
                  </p>
                  <p className="text-xs font-mono tabular-nums text-[var(--color-ink-muted)] mt-1">
                    Instagram 53.1K · 6.95% Engagement Rate · Pinterest 89.1K
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                <div className="grid grid-cols-3 gap-2 w-60">
                  {mediaItems.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="aspect-square rounded-[var(--radius-sm)] overflow-hidden bg-[var(--color-surface-subtle)] border border-[var(--color-border-hairline)]"
                    >
                      <ResilientMediaImage
                        src={item.publicUrl}
                        alt={item.filename}
                        className="w-full h-full"
                      />
                    </div>
                  ))}
                </div>
                <Button variant="outline" onClick={() => setSubTab('mediakit')}>
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Open Media Kit</span>
                </Button>
              </div>
            </div>
          </section>

          {/* 3 Feature Cards matching screenshot 13 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-ink)]">
                  Manage Campaigns
                </h4>
                <p className="text-xs text-[var(--color-ink-secondary)] mt-1.5 leading-relaxed">
                  Track active deliverables, content approvals, and payment milestones in one unified workspace.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4 self-start"
                onClick={() => setSubTab('manage')}
              >
                View Active ({campaigns.filter((c) => c.status !== 'AVAILABLE').length})
              </Button>
            </div>

            <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-ink)]">
                  Live Verified Media Kit
                </h4>
                <p className="text-xs text-[var(--color-ink-secondary)] mt-1.5 leading-relaxed">
                  Automatically synced with your connected social profiles, audience demographics, and top-performing posts.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4 self-start"
                onClick={() => setSubTab('mediakit')}
              >
                Preview Media Kit
              </Button>
            </div>

            <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-ink)]">
                  Find Brand Campaigns
                </h4>
                <p className="text-xs text-[var(--color-ink-secondary)] mt-1.5 leading-relaxed">
                  Discover curated brand partnerships in home design, craft, and sustainable goods and apply with your Media Kit.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4 self-start"
                onClick={() => setSubTab('find')}
              >
                Explore Opportunities
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Media Kit Tab */}
      {subTab === 'mediakit' && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-xl)] p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[var(--color-border-hairline)]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border border-[var(--color-border-hairline)]">
                <ResilientMediaImage
                  src={session.user.avatarUrl}
                  alt={session.workspace.name}
                  className="w-full h-full"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                  {session.workspace.name} — Official Media Kit
                </h3>
                <p className="text-xs text-[var(--color-ink-secondary)]">
                  reerts.bio/theaiseed/mediakit · Verified First-Party Telemetry
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[var(--color-ink-muted)]" />
              <span className="text-xs font-mono text-[var(--color-ink-secondary)]">
                Updated Oct 22, 2026
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
              <p className="text-xs text-[var(--color-ink-muted)]">Combined Followers</p>
              <p className="text-xl font-mono font-semibold tabular-nums text-[var(--color-ink)] mt-1">
                {totalFollowers.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
              <p className="text-xs text-[var(--color-ink-muted)]">Mean Engagement Rate</p>
              <p className="text-xl font-mono font-semibold tabular-nums text-[var(--color-status-nominal)] mt-1">
                6.95%
              </p>
            </div>
            <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
              <p className="text-xs text-[var(--color-ink-muted)]">30-Day Impressions</p>
              <p className="text-xl font-mono font-semibold tabular-nums text-[var(--color-ink)] mt-1">
                614,200
              </p>
            </div>
            <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
              <p className="text-xs text-[var(--color-ink-muted)]">Avg Bio CTR</p>
              <p className="text-xl font-mono font-semibold tabular-nums text-[var(--color-accent)] mt-1">
                8.4%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Find or Manage Campaigns Tabs */}
      {(subTab === 'find' || subTab === 'manage') && (
        <div className="space-y-4">
          {campaigns
            .filter((c) => (subTab === 'manage' ? c.status !== 'AVAILABLE' : true))
            .map((camp) => (
              <div
                key={camp.id}
                className="p-5 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[var(--color-ink-secondary)]">
                    <span className="font-semibold text-[var(--color-ink)]">
                      {camp.brandName}
                    </span>
                    <span>·</span>
                    <span>{camp.category}</span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">Due {camp.deadline}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[var(--color-ink)]">
                    {camp.campaignTitle}
                  </h4>
                  <p className="text-xs text-[var(--color-ink-secondary)]">
                    Deliverables: {camp.deliverables} · Compensation:{' '}
                    <strong className="font-mono text-[var(--color-ink)]">
                      {camp.compensation}
                    </strong>
                  </p>
                </div>

                <div>
                  {camp.status === 'AVAILABLE' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onApplyCampaign(camp.id)}
                    >
                      Apply with Media Kit
                    </Button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-status-nominal)]">
                      <CheckCircle2 className="w-4 h-4" />
                      {camp.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
