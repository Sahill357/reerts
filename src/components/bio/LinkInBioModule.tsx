import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  Check,
  MousePointerClick,
  Layers,
  Palette,
  BarChart2,
  Settings,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { LinkInBioConfig, MediaItem, ScheduledPost } from '../../types/scheduler';
import { Button, Input, Textarea, ResilientMediaImage, cn } from '../ui/primitives';

interface LinkInBioModuleProps {
  config: LinkInBioConfig;
  posts: ScheduledPost[];
  mediaItems: MediaItem[];
  onUpdateConfig: (next: LinkInBioConfig) => Promise<void>;
  onUpdatePostUrl: (postId: string, linkInBioUrl: string) => Promise<void>;
  onRecordBioClick: (payload: { buttonId?: string; postId?: string }) => Promise<void>;
  onNavigateToAnalytics: () => void;
}

const THEME_PRESETS: {
  id: LinkInBioConfig['theme'];
  label: string;
  bg: string;
  card: string;
  text: string;
  sub: string;
  btn: string;
  swatch: string;
}[] = [
  {
    id: 'light',
    label: 'Light',
    bg: 'bg-[#FFFFFF]',
    card: 'bg-[#F8FAFC] border-[#E2E8F0]',
    text: 'text-[#09090B]',
    sub: 'text-[#52525B]',
    btn: 'bg-[#09090B] text-white hover:bg-[#27272A]',
    swatch: 'bg-white border-zinc-300',
  },
  {
    id: 'dark',
    label: 'Dark',
    bg: 'bg-[#09090B]',
    card: 'bg-[#18181B] border-[#27272A]',
    text: 'text-[#FAFAFA]',
    sub: 'text-[#A1A1AA]',
    btn: 'bg-[#FAFAFA] text-[#09090B] hover:bg-[#E4E4E7]',
    swatch: 'bg-zinc-950 border-zinc-800',
  },
  {
    id: 'sherbet',
    label: 'Sherbet',
    bg: 'bg-[#F5F3FF]',
    card: 'bg-white border-[#DDD6FE]',
    text: 'text-[#1E1B4B]',
    sub: 'text-[#4338CA]',
    btn: 'bg-[#4F46E5] text-white hover:bg-[#4338CA]',
    swatch: 'bg-indigo-50 border-indigo-200',
  },
  {
    id: 'papaya',
    label: 'Papaya',
    bg: 'bg-[#FFF7ED]',
    card: 'bg-white border-[#FED7AA]',
    text: 'text-[#431407]',
    sub: 'text-[#9A3412]',
    btn: 'bg-[#C2410C] text-white hover:bg-[#9A3412]',
    swatch: 'bg-orange-50 border-orange-200',
  },
  {
    id: 'matrix',
    label: 'Matrix',
    bg: 'bg-[#052E16]',
    card: 'bg-[#064E3B] border-[#047857]',
    text: 'text-[#ECFDF5]',
    sub: 'text-[#6EE7B7]',
    btn: 'bg-[#10B981] text-[#052E16] hover:bg-[#34D399]',
    swatch: 'bg-emerald-950 border-emerald-700',
  },
  {
    id: 'alabaster',
    label: 'Alabaster',
    bg: 'bg-[#F8F6F2]',
    card: 'bg-white border-[#E5E0D8]',
    text: 'text-[#1C1917]',
    sub: 'text-[#57534E]',
    btn: 'bg-[#1C1917] text-white hover:bg-[#292524]',
    swatch: 'bg-stone-100 border-stone-300',
  },
];

export function LinkInBioModule({
  config,
  posts,
  mediaItems,
  onUpdateConfig,
  onUpdatePostUrl,
  onRecordBioClick,
  onNavigateToAnalytics,
}: LinkInBioModuleProps) {
  const [activeTab, setActiveTab] = useState<'blocks' | 'design' | 'analytics' | 'settings'>(
    'blocks'
  );
  const [newBtnLabel, setNewBtnLabel] = useState('');
  const [newBtnUrl, setNewBtnUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const mediaMap = new Map(mediaItems.map((m) => [m.id, m]));
  const activeTheme =
    THEME_PRESETS.find((t) => t.id === config.theme) || THEME_PRESETS[0];

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(`https://reerts.bio/${config.handle}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleAddBlockButton = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBtnLabel.trim() || !newBtnUrl.trim()) return;
    const nextButtons = [
      ...config.buttons,
      {
        id: `btn_${Date.now()}`,
        label: newBtnLabel.trim(),
        url: newBtnUrl.trim(),
        clicks: 0,
        active: true,
        sortOrder: config.buttons.length,
        blockType: 'BUTTON' as const,
      },
    ];
    await onUpdateConfig({ ...config, buttons: nextButtons });
    setNewBtnLabel('');
    setNewBtnUrl('');
  };

  const handleQuickAddBlock = async (label: string, defaultUrl: string) => {
    const nextButtons = [
      ...config.buttons,
      {
        id: `btn_${Date.now()}`,
        label,
        url: defaultUrl,
        clicks: 0,
        active: true,
        sortOrder: config.buttons.length,
        blockType: 'BUTTON' as const,
      },
    ];
    await onUpdateConfig({ ...config, buttons: nextButtons });
  };

  const triggerSaved = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 1800);
  };

  return (
    <div className="space-y-5">
      {/* Top Link Bar & 4-Tab Switcher matching screenshots 4, 5, 6, 11 */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[var(--color-border-hairline)]">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center border border-[var(--color-border-hairline)] rounded-[var(--radius-md)] bg-[var(--color-surface)] overflow-hidden">
            <span className="px-3 py-1.5 text-xs text-[var(--color-ink-secondary)]">
              Your Link:{' '}
              <strong className="font-mono text-[var(--color-accent)]">
                https://reerts.bio/{config.handle}
              </strong>
            </span>
            <button
              onClick={handleCopyUrl}
              className="px-3 py-1.5 text-xs font-semibold border-l border-[var(--color-border-hairline)] hover:bg-[var(--color-surface-subtle)] cursor-pointer"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={triggerSaved}>
            <Share2 className="w-3.5 h-3.5" />
            <span>Add to Social Profile</span>
          </Button>
        </div>

        {/* 4 Tabs: Blocks | Design | Analytics | Settings */}
        <div className="flex items-center gap-1 p-1 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
          {(
            [
              { id: 'blocks', label: 'Blocks', icon: Layers },
              { id: 'design', label: 'Design', icon: Palette },
              { id: 'analytics', label: 'Analytics', icon: BarChart2 },
              { id: 'settings', label: 'Settings', icon: Settings },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] transition-colors cursor-pointer whitespace-nowrap shrink-0',
                  activeTab === tab.id
                    ? 'bg-[var(--color-surface)] text-[var(--color-ink)] shadow-2xs'
                    : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Split Layout: Left Centered Phone Preview + Right Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Mobile Storefront Frame */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[360px] rounded-[36px] border-4 border-zinc-200 bg-white p-3 shadow-sm">
            <div
              className={cn(
                'rounded-[28px] border border-[var(--color-border-hairline)] p-5 min-h-[580px] flex flex-col justify-between transition-colors',
                activeTheme.bg
              )}
            >
              <div>
                {/* Avatar & Handle */}
                <div className="text-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2.5 border border-black/10">
                    <ResilientMediaImage
                      src={config.avatarUrl}
                      alt={config.title}
                      className="w-full h-full"
                    />
                  </div>
                  <h4 className={cn('text-base font-bold', activeTheme.text)}>
                    {config.title}
                  </h4>
                  <p className={cn('text-xs mt-1 leading-relaxed', activeTheme.sub)}>
                    {config.bio}
                  </p>
                </div>

                {/* Social Platform Links Row */}
                <div className="flex items-center justify-center gap-3 py-2 mb-3 border-y border-black/10 text-[11px] font-mono">
                  {config.socialLinks
                    .filter((s) => s.enabled)
                    .map((s) => (
                      <span key={s.platform} className={activeTheme.sub}>
                        {s.platform}
                      </span>
                    ))}
                </div>

                {/* Featured Banner */}
                {config.featuredBanner.enabled && (
                  <div
                    className={cn(
                      'p-3.5 rounded-[var(--radius-md)] border mb-3',
                      activeTheme.card
                    )}
                  >
                    <p className={cn('text-xs font-semibold', activeTheme.text)}>
                      {config.featuredBanner.title}
                    </p>
                    <p className={cn('text-[11px] mt-0.5', activeTheme.sub)}>
                      {config.featuredBanner.subtitle}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 mb-5">
                  {config.buttons.map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => onRecordBioClick({ buttonId: btn.id })}
                      className={cn(
                        'w-full py-2.5 px-3.5 text-xs font-medium flex items-center justify-between transition-opacity cursor-pointer',
                        config.buttonRadius === 'none'
                          ? 'rounded-none'
                          : config.buttonRadius === 'lg'
                          ? 'rounded-xl'
                          : 'rounded-md',
                        activeTheme.btn
                      )}
                    >
                      <span className="truncate">{btn.label}</span>
                      <span className="text-[10px] font-mono tabular-nums opacity-80 flex items-center gap-1 shrink-0">
                        <MousePointerClick className="w-3 h-3" /> {btn.clicks}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Shoppable Linked Social Posts Grid */}
                <div>
                  <p className={cn('text-[11px] font-semibold mb-2', activeTheme.text)}>
                    Linked Social Posts
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {posts.slice(0, 6).map((post) => {
                      const media = post.mediaId ? mediaMap.get(post.mediaId) : undefined;
                      return (
                        <button
                          key={post.id}
                          type="button"
                          onClick={() => onRecordBioClick({ postId: post.id })}
                          className="group relative aspect-square rounded-[var(--radius-xs)] overflow-hidden bg-black/10 cursor-pointer"
                        >
                          <ResilientMediaImage
                            src={media?.publicUrl}
                            alt={post.caption}
                            className="w-full h-full"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-black/65 px-1 py-0.5 text-[9px] font-mono tabular-nums text-white flex justify-between">
                            <span>Shop</span>
                            <span>{post.bioClicks}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 flex items-center justify-center gap-2">
                <span className="h-6 inline-flex items-center justify-center shrink-0">
                  <img
                    src="/assets/aistudio/Reerts_4d11e25f.svg"
                    alt="Reerts"
                    className="h-5 w-auto max-w-[80px] object-contain"
                  />
                </span>
                <span className={cn('text-[10px] font-mono', activeTheme.sub)}>
                  reerts.bio/{config.handle}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-[var(--color-ink-muted)] mt-2">
            Last updated today · Interactive live preview
          </p>
        </div>

        {/* Right Column: Tabbed Inspector */}
        <div className="lg:col-span-7 space-y-6">
          {/* TAB 1: BLOCKS (matching screenshot 11) */}
          {activeTab === 'blocks' && (
            <>
              <section className="bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
                    My Blocks
                  </h3>
                  {savedToast && (
                    <span className="text-xs text-[var(--color-status-nominal)] font-medium">
                      Changes saved
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">
                      Profile Title
                    </label>
                    <Input
                      value={config.title}
                      onChange={(e) =>
                        onUpdateConfig({ ...config, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">
                      Handle
                    </label>
                    <Input
                      value={config.handle}
                      onChange={(e) =>
                        onUpdateConfig({ ...config, handle: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">
                    Profile Bio
                  </label>
                  <Textarea
                    rows={2}
                    value={config.bio}
                    onChange={(e) => onUpdateConfig({ ...config, bio: e.target.value })}
                  />
                </div>

                {/* Active Buttons List */}
                <div className="space-y-2 pt-2">
                  {config.buttons.map((btn) => (
                    <div
                      key={btn.id}
                      className="flex items-center justify-between gap-3 p-3 border border-[var(--color-border-hairline)] rounded-[var(--radius-md)]"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[var(--color-ink)] truncate">
                          {btn.label}
                        </p>
                        <p className="text-[11px] font-mono text-[var(--color-ink-muted)] truncate">
                          {btn.url}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-mono tabular-nums text-[var(--color-ink-secondary)]">
                          {btn.clicks} clicks
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onUpdateConfig({
                              ...config,
                              buttons: config.buttons.filter((b) => b.id !== btn.id),
                            })
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5 text-[var(--color-status-danger)]" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleAddBlockButton}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 pt-2"
                >
                  <div className="md:col-span-5">
                    <Input
                      value={newBtnLabel}
                      onChange={(e) => setNewBtnLabel(e.target.value)}
                      placeholder="Button label..."
                    />
                  </div>
                  <div className="md:col-span-5">
                    <Input
                      value={newBtnUrl}
                      onChange={(e) => setNewBtnUrl(e.target.value)}
                      placeholder="https://theaiseed.co/..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit" variant="primary" className="w-full h-full">
                      <Plus className="w-3.5 h-3.5" /> Add
                    </Button>
                  </div>
                </form>
              </section>

              {/* Add More Blocks Grid matching screenshot 11 */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Add More Blocks
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      title: 'Multi-Item Banner',
                      desc: 'Highlight multiple affiliate or product items in one carousel.',
                      defaultUrl: 'https://theaiseed.co/collections/featured',
                    },
                    {
                      title: 'Buttons',
                      desc: 'Drive traffic to your website, online store, or journal.',
                      defaultUrl: 'https://theaiseed.co/shop',
                    },
                    {
                      title: 'Linked Social Posts',
                      desc: 'Add destination URLs to your scheduled social posts.',
                      defaultUrl: 'https://theaiseed.co/instagram-shop',
                    },
                    {
                      title: 'Featured Media',
                      desc: 'Feature an editorial video or your latest linked post.',
                      defaultUrl: 'https://theaiseed.co/studio-film',
                    },
                    {
                      title: 'Featured Banner',
                      desc: 'Spotlight your most important seasonal launch link.',
                      defaultUrl: 'https://theaiseed.co/autumn-launch',
                    },
                    {
                      title: 'Email Collection',
                      desc: 'Capture newsletter subscribers directly from your bio.',
                      defaultUrl: 'https://theaiseed.co/newsletter',
                    },
                  ].map((blk) => (
                    <div
                      key={blk.title}
                      className="p-4 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] flex items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="text-xs font-semibold text-[var(--color-ink)]">
                          {blk.title}
                        </h4>
                        <p className="text-[11px] text-[var(--color-ink-secondary)] mt-0.5">
                          {blk.desc}
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleQuickAddBlock(blk.title, blk.defaultUrl)}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Linked Social Post URL Mapper */}
              <section className="bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] p-5 space-y-3">
                <h3 className="text-sm font-semibold text-[var(--color-ink)]">
                  Linked Social Posts Destination Mapper
                </h3>
                <div className="space-y-2.5">
                  {posts.slice(0, 4).map((post) => {
                    const media = post.mediaId ? mediaMap.get(post.mediaId) : undefined;
                    return (
                      <div
                        key={post.id}
                        className="flex items-center gap-3 p-2.5 border border-[var(--color-border-hairline)] rounded-[var(--radius-md)]"
                      >
                        <div className="w-10 h-10 rounded-[var(--radius-xs)] overflow-hidden shrink-0">
                          <ResilientMediaImage
                            src={media?.publicUrl}
                            alt={post.caption}
                            className="w-full h-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Input
                            value={post.linkInBioUrl || ''}
                            onChange={(e) => onUpdatePostUrl(post.id, e.target.value)}
                            placeholder="https://theaiseed.co/products/..."
                            className="py-1 text-xs font-mono"
                          />
                        </div>
                        <span className="text-xs font-mono tabular-nums text-[var(--color-ink-secondary)] shrink-0">
                          {post.bioClicks} clicks
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {/* TAB 2: DESIGN (matching screenshot 6) */}
          {activeTab === 'design' && (
            <div className="bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-3">
                  Themes
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {THEME_PRESETS.map((preset) => {
                    const selected = config.theme === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => onUpdateConfig({ ...config, theme: preset.id })}
                        className={cn(
                          'p-4 rounded-[var(--radius-lg)] border text-left transition-all cursor-pointer',
                          selected
                            ? 'border-2 border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/15'
                            : 'border-[var(--color-border-hairline)] hover:border-[var(--color-ink)]'
                        )}
                      >
                        <div
                          className={cn(
                            'h-24 rounded-[var(--radius-md)] border p-3 flex flex-col justify-center gap-1.5 mb-2',
                            preset.swatch
                          )}
                        >
                          <div className="h-2.5 w-full rounded-xs bg-current opacity-25" />
                          <div className="h-2.5 w-3/4 rounded-xs bg-current opacity-25" />
                        </div>
                        <p className="text-xs font-semibold text-[var(--color-ink)] text-center">
                          {preset.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border-hairline)]">
                <label className="block text-xs font-semibold text-[var(--color-ink)] mb-2">
                  Button Corner Radius
                </label>
                <div className="flex items-center gap-2">
                  {(
                    [
                      { id: 'none', label: 'Sharp (0px)' },
                      { id: 'md', label: 'Refined (8px)' },
                      { id: 'lg', label: 'Rounded (14px)' },
                    ] as const
                  ).map((rad) => (
                    <Button
                      key={rad.id}
                      type="button"
                      variant={config.buttonRadius === rad.id ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() =>
                        onUpdateConfig({ ...config, buttonRadius: rad.id })
                      }
                    >
                      {rad.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border-hairline)] flex items-center justify-end gap-2">
                <Button variant="primary" size="sm" onClick={triggerSaved}>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </Button>
              </div>
            </div>
          )}

          {/* TAB 3: ANALYTICS (matching screenshot 5) */}
          {activeTab === 'analytics' && (
            <div className="bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[var(--color-ink)]">
                    Reerts.bio Performance Overview
                  </h3>
                  <p className="text-xs text-[var(--color-ink-secondary)]">
                    Real-time page views, button clicks, and shoppable post attribution
                  </p>
                </div>
                <Button variant="primary" size="sm" onClick={onNavigateToAnalytics}>
                  <span>Go to Full Analytics</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
                  <p className="text-xs text-[var(--color-ink-muted)]">Page Views</p>
                  <p className="text-2xl font-mono font-semibold tabular-nums text-[var(--color-ink)] mt-1">
                    {config.pageViews.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
                  <p className="text-xs text-[var(--color-ink-muted)]">Button Clicks</p>
                  <p className="text-2xl font-mono font-semibold tabular-nums text-[var(--color-ink)] mt-1">
                    {config.buttons
                      .reduce((acc, b) => acc + b.clicks, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
                  <p className="text-xs text-[var(--color-ink-muted)]">Post Grid Clicks</p>
                  <p className="text-2xl font-mono font-semibold tabular-nums text-[var(--color-accent)] mt-1">
                    {posts.reduce((acc, p) => acc + p.bioClicks, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS (matching screenshot 4: UTM, Affiliate, SEO, Page Settings) */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* Card 1: UTM Tracking */}
              <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--color-ink)]">
                      UTM Tracking for Google Analytics
                    </h4>
                    <p className="text-xs text-[var(--color-ink-secondary)]">
                      Append custom UTM parameters to your Link in Bio URLs to measure conversions.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={triggerSaved}>
                    Save UTM Config
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[var(--color-ink-muted)] mb-1">
                      utm_source
                    </label>
                    <Input
                      value={config.utmSource}
                      onChange={(e) =>
                        onUpdateConfig({ ...config, utmSource: e.target.value })
                      }
                      className="font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[var(--color-ink-muted)] mb-1">
                      utm_medium
                    </label>
                    <Input
                      value={config.utmMedium}
                      onChange={(e) =>
                        onUpdateConfig({ ...config, utmMedium: e.target.value })
                      }
                      className="font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[var(--color-ink-muted)] mb-1">
                      utm_campaign
                    </label>
                    <Input
                      value={config.utmCampaign}
                      onChange={(e) =>
                        onUpdateConfig({ ...config, utmCampaign: e.target.value })
                      }
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Affiliate Links */}
              <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-ink)]">
                    Affiliate Links & Creator Commission
                  </h4>
                  <p className="text-xs text-[var(--color-ink-secondary)] mt-0.5">
                    Automatically monetize eligible product links across your storefront blocks.
                  </p>
                </div>
                <Button
                  variant={config.affiliateEnabled ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() =>
                    onUpdateConfig({
                      ...config,
                      affiliateEnabled: !config.affiliateEnabled,
                    })
                  }
                >
                  {config.affiliateEnabled ? 'Affiliate Active' : 'Enable Affiliate'}
                </Button>
              </div>

              {/* Card 3: SEO Data */}
              <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--color-ink)]">
                      SEO Data
                    </h4>
                    <p className="text-xs text-[var(--color-ink-secondary)]">
                      Customize your public storefront’s HTML title tag and meta description.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={triggerSaved}>
                    Update SEO
                  </Button>
                </div>
                <div className="space-y-2.5">
                  <Input
                    value={config.seoTitle}
                    onChange={(e) =>
                      onUpdateConfig({ ...config, seoTitle: e.target.value })
                    }
                    placeholder="Page Title Tag"
                  />
                  <Textarea
                    rows={2}
                    value={config.seoDescription}
                    onChange={(e) =>
                      onUpdateConfig({ ...config, seoDescription: e.target.value })
                    }
                    placeholder="Meta Description"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
