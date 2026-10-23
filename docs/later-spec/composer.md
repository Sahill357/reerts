# Module Spec — Multi-Platform Post Composer & Publishing Queue

## 1. Post Composer Architecture
- **Left Column (Editor)**:
  - **Target Social Profiles**: Multi-select checkboxes for connected accounts.
  - **Post Format Selector**: `Feed Post` | `Reel / Short` | `Carousel` | `Story`.
  - **Caption Editor**: Character counter (`tabular-nums`, e.g., `142 / 2,200`), hashtag counter (`4 / 30`), Saved Captions / Hashtag Bank quick-insert drawer.
  - **First Comment Box**: Scheduled automatically via API immediately after primary post publication.
  - **Link in Bio Destination URL**: Optional product/article link attached to the post for the shoppable Link-in-Bio grid.
  - **Publishing Mode & Timing**:
    - `Auto-Publish` (direct API publish via BullMQ worker) vs `Notification Reminder` (mobile push/webhook).
    - Date/Time picker + **"Pick Best Time Slot (94% Match)"** button.
- **Right Column (Live Platform Preview)**:
  - Accurate frame preview switching between Instagram Feed, TikTok Vertical 9:16, LinkedIn Card, and Pinterest Pin.

## 2. BullMQ + Redis Publishing Queue
- Queue name: `social-publishing`
- Job payload: `{ postId, workspaceId, profileId, attempt, publishMode }`
- States: `waiting` | `delayed` | `active` | `completed` | `failed`
- Retry policy: 3 attempts, exponential backoff (`delay: 5000ms`).
