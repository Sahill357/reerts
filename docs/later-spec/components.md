# Phase 1 Recon Specification — Component Inventory & Design Tokens

> **Source Scope**: Component hierarchy, state matrices, and design token architecture for the scheduler application.

## 1. Design Token Architecture (`@theme` in `src/index.css`)

All colors, typography, border radii, and spacing scales are centralized in a single Tailwind v4 `@theme` block so the entire application can be restyled by changing one token file:

- **Typography Tokens**:
  - `--font-display`: `'Plus Jakarta Sans', sans-serif` (Headings, Brand Wordmark, Navigation)
  - `--font-sans`: `'Public Sans', sans-serif` (Dense UI controls, captions, table cells)
  - `--font-mono`: `'JetBrains Mono', monospace` (Tabular numerals, timestamps, BullMQ job IDs, metrics)
- **Surface & Canvas Tokens (60-30-10 Allocation)**:
  - `--color-canvas`: `#FAFAFA` (60% Dominant neutral field)
  - `--color-surface`: `#FFFFFF` (30% Structural workspace containers)
  - `--color-surface-subtle`: `#F4F4F5` (Muted wells, filter bar backgrounds)
  - `--color-border-hairline`: `#E4E4E7` (1px structural dividers)
- **Accent & Semantic Status Tokens (10% Budget)**:
  - `--color-brand`: `#0F172A` (Primary interactive CTA surface)
  - `--color-accent`: `#2563EB` (Active calendar slot, selected profile, focus ring)
  - `--color-status-nominal`: `#16A34A` (Published / Worker Active)
  - `--color-status-warning`: `#D97706` (Queued / Approaching Window / Manual Notification)
  - `--color-status-danger`: `#DC2626` (Failed Publish / Disconnected Token)

---

## 2. Shared Component Inventory (`shadcn/ui` Primitives + Domain Composites)

| Component | Location | States Supported | Responsibility |
| :--- | :--- | :--- | :--- |
| `AppShell` | `src/components/shell/AppShell.tsx` | Authenticated / Guest | 260px left workspace sidebar + 3-zone top bar contract + main viewport |
| `ProfileSwitcherBar` | `src/components/calendar/ProfileSwitcherBar.tsx` | Selected / Multi-select / Disconnected | Filter & target connected Instagram, TikTok, LinkedIn, Pinterest, X, Threads accounts |
| `CalendarGrid` | `src/components/calendar/CalendarGrid.tsx` | Loading / Empty / Week / Month / Feed Grid | Renders time-slot matrix, Best Time to Post heatmap cells, and scheduled post cards |
| `MediaSideBin` | `src/components/calendar/MediaSideBin.tsx` | Empty / Uploading / Filtered | Collapsible left bin in Calendar view for rapid media-to-slot scheduling |
| `PostComposerModal` | `src/components/composer/PostComposerModal.tsx` | Draft / Scheduled / Saving / Validation Error | Multi-channel caption editor, hashtag bank, first-comment field, schedule time picker |
| `MediaLibraryView` | `src/components/media/MediaLibraryView.tsx` | Empty / Uploading / Populated / Inspector | R2 presigned upload modal, tag manager, asset metadata drawer |
| `PublishingQueueView` | `src/components/queue/PublishingQueueView.tsx` | Idle / Active / Retrying / Failed | Live BullMQ queue inspector, manual "Publish Now" & "Retry Job" triggers |
| `LinkInBioEditor` | `src/components/bio/LinkInBioEditor.tsx` | Editing / Saving / Live Preview | Manage profile header, custom action buttons, shoppable media grid, and theme tokens |
| `AnalyticsDashboard` | `src/components/analytics/AnalyticsDashboard.tsx` | Loading / Empty / 7d-30d-90d | Tabular KPI strip, engagement rate breakdown, post leaderboard, CSV export |
| `SettingsView` | `src/components/settings/SettingsView.tsx` | Connected / Editing Slots / RBAC | Weekly Quick-Schedule slot matrix, social OAuth connection status, R2/Redis config |
