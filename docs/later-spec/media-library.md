# Module Spec — Media Library & Cloudflare R2 Asset Pipeline

## 1. Layout Structure
- **Top Filter & Upload Toolbar**:
  - Search input (filters by filename, notes, and tags).
  - Usage segmented filter: `All Media` | `Unused` | `Used in Posts` | `Starred`.
  - Tag filter selector (`ceramics`, `studio`, `launch`, `reels`, `skincare`).
  - Primary CTA: **"Upload Media (R2 Presigned)"** + **"Add Custom Asset"**.
- **Asset Grid (4 columns desktop)**:
  - Each card displays high-resolution preview, aspect ratio (`1:1`, `3:4`, `4:3`, `9:16`), usage count (`Used 2x` or `Unused`), and quick selection checkbox for multi-asset carousel posts.
- **Right Inspector Drawer**:
  - Displays full asset metadata: Object Key (`r2://...`), Public CDN URL, Dimensions, File Size, internal team notes, tag editor, and **"Create Post with Asset"** CTA.

## 2. Cloudflare R2 Presigned Upload Flow
1. Client requests presigned URL via `POST /api/media/presign`.
2. Backend uses `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` configured with `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and `R2_BUCKET_NAME`.
3. Client uploads binary payload directly to presigned URL (or falls back to local development storage when R2 credentials are in sandbox mode) and reads from `R2_PUBLIC_DOMAIN`.
