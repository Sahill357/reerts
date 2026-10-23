# Phase 1 Recon Specification — API Endpoints & Payload Shapes

> **Redaction Notice**: All authentication headers (`Authorization: Bearer <REDACTED_TOKEN>`), session cookies (`better-auth.session_token=<REDACTED>`), and third-party OAuth tokens are redacted.

## 1. Authentication (`Better Auth` Contract)

### `GET /api/auth/session`
Returns the current authenticated user and active workspace organization.
```json
{
  "user": {
    "id": "usr_01J9X8A7B2C3D4",
    "email": "creator@<REDACTED_DOMAIN>",
    "name": "Elena Vance",
    "role": "OWNER",
    "avatarUrl": "/api/assets/avatar_creator.svg"
  },
  "workspace": {
    "id": "ws_01J9X8A7Z9Y8X7",
    "name": "Atelier Vance Studio",
    "plan": "GROWTH",
    "timezone": "America/Los_Angeles"
  }
}
```

### `POST /api/auth/login`
Request:
```json
{
  "email": "creator@ateliervance.co",
  "password": "<REDACTED_PASSWORD>"
}
```

---

## 2. Social Profiles & Quick Schedule Slots

### `GET /api/profiles`
Response:
```json
{
  "profiles": [
    {
      "id": "prof_ig_01",
      "platform": "INSTAGRAM",
      "handle": "@ateliervance",
      "displayName": "Atelier Vance Ceramics",
      "followersCount": 48290,
      "autoPublish": true,
      "status": "CONNECTED"
    }
  ],
  "savedTimeSlots": [
    {
      "id": "slot_01",
      "profileId": "prof_ig_01",
      "dayOfWeek": 2,
      "hour": 9,
      "minute": 30,
      "engagementScore": 0.94
    }
  ]
}
```

---

## 3. Media Library & Cloudflare R2 Presigned Uploads

### `POST /api/media/presign`
Generates an S3-compatible Cloudflare R2 presigned `PutObjectCommand` URL for direct browser-to-bucket uploads, plus the public read URL on the custom R2 domain.

Request:
```json
{
  "filename": "stoneware-vessel-04.jpg",
  "mimeType": "image/jpeg",
  "sizeBytes": 1843200,
  "width": 1080,
  "height": 1080
}
```

Response:
```json
{
  "uploadId": "med_01J9X991",
  "objectKey": "workspaces/ws_01J9X8A7Z9Y8X7/2026/10/stoneware-vessel-04.jpg",
  "presignedPutUrl": "https://<REDACTED_ACCOUNT_ID>.r2.cloudflarestorage.com/cadence-media/workspaces/...",
  "publicReadUrl": "https://media.cadencestudio.app/workspaces/ws_01J9X8A7Z9Y8X7/2026/10/stoneware-vessel-04.jpg",
  "expiresInSeconds": 900
}
```

### `POST /api/media`
Commits an uploaded media record into PostgreSQL with tags and notes.

---

## 4. Scheduled Posts & Publishing Queue (BullMQ)

### `GET /api/posts?start=2026-10-18&end=2026-10-25&profiles=prof_ig_01`
Returns scheduled, draft, queued, published, and failed posts within the calendar window.

### `POST /api/posts`
Creates a multi-platform or single-platform post and schedules a BullMQ job (`queue: "social-publishing"`).
```json
{
  "profileIds": ["prof_ig_01", "prof_pin_01"],
  "mediaIds": ["med_01", "med_02"],
  "caption": "Morning kiln opening — raw stoneware vessels in speckled clay. #ceramics #minimaldesign",
  "firstComment": "Available in the autumn studio release via our bio link.",
  "postType": "FEED",
  "publishMode": "AUTO_PUBLISH",
  "scheduledAt": "2026-10-23T16:30:00.000Z",
  "linkInBioUrl": "https://ateliervance.co/collections/autumn-kiln"
}
```

### `POST /api/queue/:jobId/retry` & `POST /api/queue/:jobId/publish-now`
Immediately promotes a delayed BullMQ job or retries a failed job with exponential backoff.

---

## 5. Link in Bio & Analytics

### `GET /api/link-in-bio` & `PUT /api/link-in-bio`
Reads and updates the `LinkInBioPage` configuration, custom button blocks, theme tokens, and shoppable post mappings.

### `GET /api/analytics?profileId=prof_ig_01&range=30d`
Returns time-series impressions, reach, engagement rate, best posting times heatmap, and Link-in-Bio click attribution.
