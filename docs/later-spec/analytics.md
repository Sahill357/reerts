# Module Spec — Analytics &Settings

## 1. Analytics Module (`/app/analytics`)
- **Top Control Strip**: Profile selector, date window selector (`Last 7 Days` | `Last 30 Days` | `Last 90 Days`), and **"Export CSV"** button.
- **4-Column KPI Row**:
  - Total Reach (`tabular-nums` + period delta)
  - Engagement Rate (`tabular-nums` % + benchmark comparison)
  - Link in Bio Clicks (`tabular-nums` + CTR %)
  - Publishing Consistency (`tabular-nums` posts published on schedule)
- **Audience Activity & Growth Chart**: SVG bar/area chart comparing daily impressions, profile visits, and bio clicks.
- **Post Performance Leaderboard Table**: Sortable by Engagement Rate, Likes, Comments, Saves, Reach, and Bio Clicks.

## 2. Settings Module (`/app/settings`)
- **Connected Social Profiles**: Connect/disconnect Instagram, TikTok, Pinterest, LinkedIn, Threads; toggle `Auto-Publish` permissions.
- **Quick Schedule Time Slots**: Weekly slot table per social profile defining recurring queue windows and Best Time scores.
- **Infrastructure & Integrations**: Live status and configuration summary for PostgreSQL (Prisma), Redis (BullMQ), Cloudflare R2 (`@aws-sdk/client-s3`), and Better Auth session security.
