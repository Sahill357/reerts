# Phase 1 Recon Specification — Routes & Navigation Architecture

> **Source Scope**: Authenticated workspace session (`<REDACTED_WORKSPACE_ID>`). All session cookies (`_later_session=<REDACTED>`), bearer tokens, and personal identifiers have been redacted.

## 1. Route Hierarchy & Layout Shell

The application is structured around a persistent workspace shell (`/app/*`) and a public high-conversion micro-site route (`/bio/:handle`) for Link in Bio storefronts.

| Route Pattern | Module | Access Guard | Primary View State |
| :--- | :--- | :--- | :--- |
| `/login` | Auth (`Better Auth`) | Guest only | Email + password / OAuth session initiation |
| `/app/calendar` | Visual Scheduler | Authenticated Workspace | Multi-profile Week / Month calendar + Side Media Drawer + Grid Preview |
| `/app/media` | Media Library | Authenticated Workspace | Filterable asset grid, R2 presigned uploader, detail inspector drawer |
| `/app/composer` | Post Composer | Modal / Slide-over / Route | Multi-platform post editor, first comment, caption & media cropper |
| `/app/queue` | Publishing Queue | Authenticated Workspace | BullMQ worker queue monitor, retry controls, Auto-Publish status log |
| `/app/link-in-bio` | Link in Bio Builder | Authenticated Workspace | Split-pane editor (Blocks, Buttons, Linked Posts, Theme) + Mobile Preview |
| `/app/analytics` | Analytics & Insights | Authenticated Workspace | Profile KPIs, Post Performance table, Bio click attribution, CSV export |
| `/app/settings` | Workspace Settings | Authenticated Workspace | Social Profiles, Quick Schedule Time Slots, Team RBAC, Storage/Auth |
| `/bio/:handle` | Public Storefront | Public | Shoppable grid + button links with UTM click tracking |

---

## 2. Query Parameter Contracts

- **`/app/calendar`**
  - `view`: `'week' | 'month' | 'grid'` (default `'week'`)
  - `date`: ISO-8601 date string (`YYYY-MM-DD`) anchoring the visible range
  - `profiles`: Comma-separated list of `SocialProfile.id` values (e.g., `prof_ig_01,prof_tt_01`)
  - `status`: `'ALL' | 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED'`
- **`/app/media`**
  - `usage`: `'all' | 'unused' | 'used' | 'starred'`
  - `type`: `'all' | 'IMAGE' | 'VIDEO'`
  - `tag`: Tag slug filter
  - `q`: Search query matching filename or media note
- **`/app/analytics`**
  - `profileId`: Active `SocialProfile.id`
  - `range`: `'7d' | '30d' | '90d'`
  - `tab`: `'overview' | 'posts' | 'bio'`

---

## 3. Core User Flows

### Flow A: Media Side-Bin Drag / Click-to-Schedule
1. User opens `/app/calendar` with `view=week`.
2. Left side-bin displays unused media items from the Media Library (`GET /api/media?usage=unused`).
3. Selecting a media item or clicking **"Create Post"** opens the Composer Drawer pre-populated with the selected media asset and active social profiles.
4. Selecting **"Auto-Publish"** + a target slot (or clicking **"Next Available Queue Slot"**) dispatches `POST /api/posts`, which persists the `ScheduledPost` in PostgreSQL and enqueues a delayed BullMQ job (`publish-post:{postId}`).

### Flow B: Visual Grid Planner & Drag Reordering
1. User switches calendar mode to **Grid Preview** (`view=grid`).
2. Scheduled posts are rendered at the top of the 3-column Instagram/TikTok grid above already-published posts.
3. Reordering two scheduled tiles swaps their `scheduledAt` timestamps via `PATCH /api/posts/reorder` and updates the corresponding BullMQ delayed job timestamps.

### Flow C: Link in Bio Shoppable Post Linking
1. User navigates to `/app/link-in-bio`.
2. In the **Linked Social Posts** section, user attaches a target product/editorial URL (`https://...`) to any scheduled or published image tile.
3. Public visitors hitting `/bio/:handle` see the clickable media grid; clicking a tile logs a `BioClickEvent` (`POST /api/link-in-bio/click`) and redirects to the destination URL with UTM parameters.
