import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createR2PresignedUpload } from './src/server/r2';
import {
  INITIAL_SESSION,
  INITIAL_PROFILES,
  INITIAL_TIME_SLOTS,
  INITIAL_CALENDAR_NOTES,
  INITIAL_MEDIA,
  INITIAL_POSTS,
  INITIAL_QUEUE_JOBS,
  INITIAL_BIO_CONFIG,
  INITIAL_DAILY_METRICS,
  INITIAL_INBOX_THREADS,
  INITIAL_CREATOR_CAMPAIGNS,
  generateCustomMediaAsset,
} from './src/server/store';
import {
  CalendarNote,
  CreatorCampaign,
  InboxThread,
  MediaItem,
  MediaType,
  PostStatus,
  PublishMode,
  QueueJob,
  ScheduledPost,
  SavedTimeSlot,
  SocialProfile,
} from './src/types/scheduler';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  let session = { ...INITIAL_SESSION };
  let profiles: SocialProfile[] = [...INITIAL_PROFILES];
  let timeSlots: SavedTimeSlot[] = [...INITIAL_TIME_SLOTS];
  let calendarNotes: CalendarNote[] = [...INITIAL_CALENDAR_NOTES];
  let mediaItems: MediaItem[] = [...INITIAL_MEDIA];
  let posts: ScheduledPost[] = [...INITIAL_POSTS];
  let queueJobs: QueueJob[] = [...INITIAL_QUEUE_JOBS];
  let bioConfig = structuredClone(INITIAL_BIO_CONFIG);
  let dailyMetrics = [...INITIAL_DAILY_METRICS];
  let inboxThreads: InboxThread[] = structuredClone(INITIAL_INBOX_THREADS);
  let creatorCampaigns: CreatorCampaign[] = structuredClone(INITIAL_CREATOR_CAMPAIGNS);

  // 1. Auth Endpoints
  app.get('/api/auth/session', (_req, res) => {
    res.json(session);
  });

  app.post('/api/auth/workspace', (req, res) => {
    const { name, timezone, groupName } = req.body;
    if (name) session.workspace.name = name;
    if (timezone) session.workspace.timezone = timezone;
    if (groupName) session.workspace.groupName = groupName;
    res.json(session);
  });

  // 2. Social Profiles, Time Slots & Calendar Notes
  app.get('/api/profiles', (_req, res) => {
    res.json({ profiles, savedTimeSlots: timeSlots, calendarNotes });
  });

  app.patch('/api/profiles/:id', (req, res) => {
    const { id } = req.params;
    profiles = profiles.map((p) => (p.id === id ? { ...p, ...req.body } : p));
    const updated = profiles.find((p) => p.id === id);
    res.json(updated);
  });

  app.post('/api/time-slots', (req, res) => {
    const { profileId, dayOfWeek, hour, minute, engagementScore } = req.body;
    const newSlot: SavedTimeSlot = {
      id: `slot_${Date.now()}`,
      profileId,
      dayOfWeek: Number(dayOfWeek),
      hour: Number(hour),
      minute: Number(minute || 0),
      engagementScore: Number(engagementScore || 0.88),
    };
    timeSlots = [...timeSlots, newSlot];
    res.status(201).json(newSlot);
  });

  app.delete('/api/time-slots/:id', (req, res) => {
    timeSlots = timeSlots.filter((s) => s.id !== req.params.id);
    res.json({ deleted: true });
  });

  app.post('/api/calendar-notes', (req, res) => {
    const { date, hour, title, body, color } = req.body;
    const newNote: CalendarNote = {
      id: `note_${Date.now()}`,
      date: date || '2026-10-22',
      hour: Number(hour ?? 13),
      title: title || 'Calendar Note',
      body: body || '',
      color: color || '#4F46E5',
    };
    calendarNotes = [...calendarNotes, newNote];
    res.status(201).json(newNote);
  });

  app.delete('/api/calendar-notes/:id', (req, res) => {
    calendarNotes = calendarNotes.filter((n) => n.id !== req.params.id);
    res.json({ deleted: true });
  });

  // 3. Media Library & Cloudflare R2 S3 Presigned Uploads
  app.get('/api/media', (_req, res) => {
    res.json({ media: mediaItems });
  });

  app.post('/api/media/presign', async (req, res) => {
    try {
      const { filename, mimeType, sizeBytes } = req.body;
      const presigned = await createR2PresignedUpload({
        filename: filename || 'studio-upload.jpg',
        mimeType: mimeType || 'image/jpeg',
        sizeBytes: Number(sizeBytes || 1024000),
        workspaceId: session.workspace.id,
      });
      res.json(presigned);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.post('/api/media', (req, res) => {
    const {
      filename,
      objectKey,
      publicUrl,
      mimeType,
      sizeBytes,
      aspectRatio,
      tags,
      notes,
    } = req.body;

    const cleanTags: string[] = Array.isArray(tags)
      ? tags
      : typeof tags === 'string' && tags.trim()
      ? tags.split(',').map((t: string) => t.trim().toLowerCase())
      : ['studio'];

    const ratio: '1:1' | '3:4' | '4:3' | '9:16' = aspectRatio || '1:1';
    const previewUrl =
      publicUrl && publicUrl.startsWith('data:')
        ? publicUrl
        : generateCustomMediaAsset(filename || 'new-asset.jpg', ratio, cleanTags);

    const newItem: MediaItem = {
      id: `med_${Date.now()}`,
      filename: filename || 'studio-asset.jpg',
      objectKey:
        objectKey || `workspaces/${session.workspace.id}/2026/10/${Date.now()}-${filename}`,
      publicUrl: previewUrl,
      mediaType: mimeType?.startsWith('video') ? MediaType.VIDEO : MediaType.IMAGE,
      mimeType: mimeType || 'image/jpeg',
      sizeBytes: Number(sizeBytes || 1450000),
      width: 1080,
      height: ratio === '9:16' ? 1920 : ratio === '3:4' ? 1350 : 1080,
      aspectRatio: ratio,
      tags: cleanTags,
      notes: notes || '',
      starred: false,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      palette: ['#f5f3ef', '#d6cfc2', '#786b59'],
    };

    mediaItems = [newItem, ...mediaItems];
    res.status(201).json(newItem);
  });

  app.patch('/api/media/:id', (req, res) => {
    const { id } = req.params;
    mediaItems = mediaItems.map((m) => (m.id === id ? { ...m, ...req.body } : m));
    res.json(mediaItems.find((m) => m.id === id));
  });

  app.delete('/api/media/:id', (req, res) => {
    mediaItems = mediaItems.filter((m) => m.id !== req.params.id);
    res.json({ deleted: true });
  });

  // 4. Scheduled Posts & BullMQ Publishing Queue
  app.get('/api/posts', (_req, res) => {
    res.json({ posts, queueJobs });
  });

  app.post('/api/posts', (req, res) => {
    const {
      profileIds,
      mediaId,
      caption,
      firstComment,
      postType,
      publishMode,
      scheduledAt,
      status,
      linkInBioUrl,
    } = req.body;

    const targets: string[] =
      Array.isArray(profileIds) && profileIds.length > 0 ? profileIds : ['prof_ig_01'];

    const createdPosts: ScheduledPost[] = [];
    const createdJobs: QueueJob[] = [];

    targets.forEach((profileId, idx) => {
      const postId = `post_${Date.now()}_${idx}`;
      const jobId = `bull:social-publishing:${Date.now() + idx}`;
      const postStatus: PostStatus = status || PostStatus.SCHEDULED;

      const newPost: ScheduledPost = {
        id: postId,
        profileId,
        mediaId: mediaId || (mediaItems[0]?.id ?? null),
        caption: caption || '',
        firstComment: firstComment || '',
        postType: postType || 'FEED',
        publishMode: publishMode || PublishMode.AUTO_PUBLISH,
        status: postStatus,
        scheduledAt: scheduledAt || new Date(Date.now() + 3600_000).toISOString(),
        publishedAt: postStatus === PostStatus.PUBLISHED ? new Date().toISOString() : null,
        linkInBioUrl: linkInBioUrl || '',
        bullJobId: postStatus === PostStatus.DRAFT ? undefined : jobId,
        impressions: postStatus === PostStatus.PUBLISHED ? 1240 : 0,
        reach: postStatus === PostStatus.PUBLISHED ? 1050 : 0,
        views: postStatus === PostStatus.PUBLISHED ? 1580 : 0,
        likes: postStatus === PostStatus.PUBLISHED ? 118 : 0,
        comments: postStatus === PostStatus.PUBLISHED ? 9 : 0,
        saves: postStatus === PostStatus.PUBLISHED ? 34 : 0,
        shares: postStatus === PostStatus.PUBLISHED ? 14 : 0,
        bioClicks: 0,
      };

      createdPosts.push(newPost);

      if (postStatus !== PostStatus.DRAFT) {
        createdJobs.push({
          id: jobId,
          postId,
          profileId,
          queueName: 'social-publishing',
          state: postStatus === PostStatus.PUBLISHED ? 'completed' : 'delayed',
          attemptsMade: postStatus === PostStatus.PUBLISHED ? 1 : 0,
          maxAttempts: 3,
          scheduledFor: newPost.scheduledAt,
          processedAt:
            postStatus === PostStatus.PUBLISHED ? new Date().toISOString() : undefined,
          backoffDelayMs: 5000,
        });
      }
    });

    if (mediaId) {
      mediaItems = mediaItems.map((m) =>
        m.id === mediaId ? { ...m, usageCount: m.usageCount + targets.length } : m
      );
    }

    posts = [...createdPosts, ...posts];
    queueJobs = [...createdJobs, ...queueJobs];

    res.status(201).json({ createdPosts, createdJobs });
  });

  app.patch('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    posts = posts.map((p) => (p.id === id ? { ...p, ...req.body } : p));
    const updated = posts.find((p) => p.id === id);
    if (updated && req.body.scheduledAt) {
      queueJobs = queueJobs.map((j) =>
        j.postId === id ? { ...j, scheduledFor: req.body.scheduledAt } : j
      );
    }
    res.json(updated);
  });

  app.post('/api/posts/swap', (req, res) => {
    const { postIdA, postIdB } = req.body;
    const postA = posts.find((p) => p.id === postIdA);
    const postB = posts.find((p) => p.id === postIdB);
    if (postA && postB) {
      const tempTime = postA.scheduledAt;
      postA.scheduledAt = postB.scheduledAt;
      postB.scheduledAt = tempTime;
    }
    res.json({ posts });
  });

  app.delete('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    posts = posts.filter((p) => p.id !== id);
    queueJobs = queueJobs.filter((j) => j.postId !== id);
    res.json({ deleted: true });
  });

  // 5. BullMQ Worker Actions
  app.post('/api/queue/:jobId/publish-now', (req, res) => {
    const { jobId } = req.params;
    const now = new Date().toISOString();
    let targetPostId = '';

    queueJobs = queueJobs.map((job) => {
      if (job.id === jobId || job.postId === jobId) {
        targetPostId = job.postId;
        return {
          ...job,
          state: 'completed',
          attemptsMade: job.attemptsMade + 1,
          processedAt: now,
          errorReason: undefined,
        };
      }
      return job;
    });

    posts = posts.map((post) => {
      if (post.id === targetPostId || post.bullJobId === jobId || post.id === jobId) {
        return {
          ...post,
          status: PostStatus.PUBLISHED,
          publishedAt: now,
          failureReason: undefined,
          impressions: post.impressions || 2480,
          reach: post.reach || 2100,
          views: post.views || 3100,
          likes: post.likes || 215,
          comments: post.comments || 18,
          saves: post.saves || 64,
          shares: post.shares || 22,
        };
      }
      return post;
    });

    res.json({ posts, queueJobs });
  });

  app.post('/api/queue/:jobId/retry', (req, res) => {
    const { jobId } = req.params;
    const now = new Date().toISOString();
    let targetPostId = '';

    queueJobs = queueJobs.map((job) => {
      if (job.id === jobId || job.postId === jobId) {
        targetPostId = job.postId;
        return {
          ...job,
          state: 'completed',
          attemptsMade: job.attemptsMade + 1,
          processedAt: now,
          errorReason: undefined,
        };
      }
      return job;
    });

    posts = posts.map((post) => {
      if (post.id === targetPostId || post.bullJobId === jobId) {
        return {
          ...post,
          status: PostStatus.PUBLISHED,
          publishedAt: now,
          failureReason: undefined,
          impressions: 3120,
          reach: 2680,
          views: 3890,
          likes: 264,
          comments: 22,
          saves: 79,
          shares: 31,
        };
      }
      return post;
    });

    res.json({ posts, queueJobs });
  });

  // 6. Link in Bio Storefront & Click Attribution
  app.get('/api/link-in-bio', (_req, res) => {
    res.json({ config: bioConfig });
  });

  app.put('/api/link-in-bio', (req, res) => {
    bioConfig = { ...bioConfig, ...req.body };
    res.json({ config: bioConfig });
  });

  app.post('/api/link-in-bio/click', (req, res) => {
    const { buttonId, postId } = req.body;
    bioConfig.pageViews += 1;
    if (buttonId) {
      bioConfig.buttons = bioConfig.buttons.map((b) =>
        b.id === buttonId ? { ...b, clicks: b.clicks + 1 } : b
      );
    }
    if (postId) {
      posts = posts.map((p) =>
        p.id === postId ? { ...p, bioClicks: p.bioClicks + 1 } : p
      );
    }
    if (dailyMetrics.length > 0) {
      const lastIdx = dailyMetrics.length - 1;
      dailyMetrics[lastIdx] = {
        ...dailyMetrics[lastIdx],
        bioClicks: dailyMetrics[lastIdx].bioClicks + 1,
        pageViews: dailyMetrics[lastIdx].pageViews + 1,
      };
    }
    res.json({ config: bioConfig, posts });
  });

  // 7. Social Inbox Endpoints
  app.get('/api/inbox', (_req, res) => {
    res.json({ threads: inboxThreads });
  });

  app.post('/api/inbox/:threadId/reply', (req, res) => {
    const { threadId } = req.params;
    const { text } = req.body;
    inboxThreads = inboxThreads.map((t) => {
      if (t.id === threadId) {
        return {
          ...t,
          unread: false,
          lastActivityLabel: 'Just now',
          messages: [
            ...t.messages,
            {
              id: `msg_${Date.now()}`,
              senderName: 'theaiseed Studio',
              senderHandle: '@theaiseed',
              isBrandOwner: true,
              text: text || 'Thank you for reaching out!',
              timestamp: 'Just now',
            },
          ],
        };
      }
      return t;
    });
    res.json({ threads: inboxThreads });
  });

  app.patch('/api/inbox/:threadId', (req, res) => {
    const { threadId } = req.params;
    inboxThreads = inboxThreads.map((t) =>
      t.id === threadId ? { ...t, ...req.body } : t
    );
    res.json({ threads: inboxThreads });
  });

  // 8. Creator Home & Brand Partnerships Endpoints
  app.get('/api/creator', (_req, res) => {
    res.json({ campaigns: creatorCampaigns });
  });

  app.post('/api/creator/:campaignId/apply', (req, res) => {
    const { campaignId } = req.params;
    creatorCampaigns = creatorCampaigns.map((c) =>
      c.id === campaignId ? { ...c, status: 'APPLIED' } : c
    );
    res.json({ campaigns: creatorCampaigns });
  });

  // 9. Analytics Endpoints
  app.get('/api/analytics', (_req, res) => {
    res.json({
      dailyMetrics,
      profiles,
      posts,
      bioButtons: bioConfig.buttons,
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Reerts server running on http://localhost:${PORT}`);
  });
}

startServer();
