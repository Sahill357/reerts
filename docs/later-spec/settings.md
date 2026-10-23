# Module Spec — Workspace Settings, Auth & Infrastructure

## 1. Sections
1. **Social Profiles & OAuth Connections**:
   - Lists connected profiles (`@ateliervance` on Instagram, TikTok, Pinterest, LinkedIn).
   - Allows adding a new social profile, toggling Auto-Publish, or refreshing token scopes.
2. **Quick Schedule Queue Slots**:
   - Manages recurring weekly time slots (`dayOfWeek`, `hour`, `minute`) used when a user clicks **"Next Available Slot"** in the Composer.
3. **Team & Access Control (Better Auth)**:
   - Displays current authenticated session, role (`OWNER`, `EDITOR`, `ANALYST`), and workspace timezone selector.
4. **Storage & Worker Pipeline (Cloudflare R2 + BullMQ)**:
   - Displays configured R2 bucket domain, presigned upload TTL, and BullMQ worker concurrency/backoff parameters.
