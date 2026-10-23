import {
  Platform,
  PostStatus,
  PublishMode,
  MediaType,
  UserSession,
  SocialProfile,
  SavedTimeSlot,
  CalendarNote,
  MediaItem,
  ScheduledPost,
  QueueJob,
  LinkInBioConfig,
  DailyMetricPoint,
  InboxThread,
  CreatorCampaign,
} from '../types/scheduler';

function buildEditorialSvg(
  title: string,
  subtitle: string,
  palette: [string, string, string],
  variant: 'vessels' | 'matcha' | 'botanical' | 'studio' | 'kiln' | 'tableware' | 'packaging' | 'portrait'
): string {
  const [bg, mid, accent] = palette;
  let artwork = '';

  if (variant === 'vessels') {
    artwork = `
      <rect x="70" y="340" width="460" height="18" rx="4" fill="${mid}" opacity="0.45"/>
      <path d="M160 340 C150 240, 230 240, 220 340 Z" fill="${accent}" />
      <ellipse cx="190" cy="245" rx="22" ry="7" fill="${mid}" />
      <path d="M260 340 C240 190, 360 190, 340 340 Z" fill="${mid}" />
      <rect x="284" y="185" width="32" height="24" rx="4" fill="${mid}" />
      <circle cx="410" cy="295" r="45" fill="${accent}" opacity="0.85" />
    `;
  } else if (variant === 'matcha') {
    artwork = `
      <rect x="190" y="200" width="220" height="260" rx="22" fill="${mid}" opacity="0.35" stroke="${accent}" stroke-width="3"/>
      <rect x="202" y="260" width="196" height="188" rx="14" fill="${accent}" opacity="0.85"/>
      <path d="M295 90 Q310 175 300 265" stroke="${accent}" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="300" cy="260" r="24" fill="${bg}" opacity="0.5"/>
    `;
  } else if (variant === 'botanical') {
    artwork = `
      <ellipse cx="300" cy="390" rx="170" ry="34" fill="${mid}" opacity="0.45"/>
      <rect x="245" y="210" width="110" height="175" rx="24" fill="${accent}"/>
      <rect x="278" y="160" width="44" height="52" rx="6" fill="${mid}"/>
      <rect x="290" y="125" width="20" height="38" rx="10" fill="#1e293b"/>
      <path d="M170 350 Q220 240 280 290" stroke="${mid}" stroke-width="5" fill="none"/>
    `;
  } else if (variant === 'studio') {
    artwork = `
      <rect x="80" y="110" width="200" height="280" rx="4" fill="${mid}" opacity="0.35"/>
      <line x1="180" y1="110" x2="180" y2="390" stroke="${bg}" stroke-width="4"/>
      <line x1="80" y1="250" x2="280" y2="250" stroke="${bg}" stroke-width="4"/>
      <rect x="140" y="330" width="340" height="22" rx="4" fill="${accent}"/>
      <rect x="180" y="352" width="16" height="95" fill="${accent}"/>
      <rect x="424" y="352" width="16" height="95" fill="${accent}"/>
      <circle cx="350" cy="295" r="35" fill="${mid}"/>
    `;
  } else if (variant === 'kiln') {
    artwork = `
      <circle cx="300" cy="270" r="135" fill="${mid}" opacity="0.3"/>
      <circle cx="300" cy="270" r="92" fill="${accent}" opacity="0.85"/>
      <path d="M220 350 L380 350" stroke="${bg}" stroke-width="8" stroke-linecap="round"/>
    `;
  } else if (variant === 'tableware') {
    artwork = `
      <ellipse cx="300" cy="310" rx="165" ry="52" fill="${mid}"/>
      <ellipse cx="300" cy="295" rx="125" ry="38" fill="${accent}"/>
      <ellipse cx="300" cy="282" rx="82" ry="24" fill="${bg}"/>
    `;
  } else if (variant === 'packaging') {
    artwork = `
      <rect x="175" y="155" width="250" height="260" rx="12" fill="${mid}"/>
      <rect x="205" y="195" width="190" height="130" rx="6" fill="${bg}"/>
      <line x1="230" y1="240" x2="370" y2="240" stroke="${accent}" stroke-width="6"/>
      <line x1="230" y1="268" x2="330" y2="268" stroke="${accent}" stroke-width="4"/>
    `;
  } else {
    artwork = `
      <circle cx="300" cy="220" r="72" fill="${mid}"/>
      <path d="M175 430 C175 330, 425 330, 425 430 Z" fill="${accent}"/>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bg}"/>
        <stop offset="100%" stop-color="${mid}" stop-opacity="0.35"/>
      </linearGradient>
    </defs>
    <rect width="600" height="600" fill="url(#g)"/>
    <circle cx="490" cy="110" r="180" fill="${mid}" opacity="0.18"/>
    ${artwork}
    <rect x="36" y="476" width="528" height="88" rx="12" fill="#09090b" fill-opacity="0.82"/>
    <text x="60" y="514" fill="#ffffff" font-family="Plus Jakarta Sans, sans-serif" font-size="22" font-weight="600">${title}</text>
    <text x="60" y="542" fill="#cbd5e1" font-family="JetBrains Mono, monospace" font-size="14">${subtitle}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_SESSION: UserSession = {
  user: {
    id: 'usr_01J9X8A7B2C3D4',
    email: 'elena@theaiseed.co',
    name: 'Elena Vance',
    role: 'OWNER',
    avatarUrl: buildEditorialSvg('theaiseed', 'Creative Studio', ['#f1f5f9', '#94a3b8', '#09090b'], 'portrait'),
  },
  workspace: {
    id: 'ws_01J9X8A7Z9Y8X7',
    name: 'theaiseed Studio',
    slug: 'theaiseed',
    groupName: 'Main Group',
    plan: 'Growth Plan',
    timezone: 'Asia/Calcutta',
    postsLeftInCycle: 24,
  },
};

export const INITIAL_PROFILES: SocialProfile[] = [
  {
    id: 'prof_ig_01',
    platform: Platform.INSTAGRAM,
    handle: '@theaiseed',
    displayName: 'theaiseed Studio',
    followersCount: 53106,
    followingCount: 184,
    autoPublish: true,
    connected: true,
    color: '#E1306C',
  },
  {
    id: 'prof_tt_01',
    platform: Platform.TIKTOK,
    handle: '@theaiseed.lab',
    displayName: 'theaiseed Lab',
    followersCount: 31400,
    followingCount: 92,
    autoPublish: true,
    connected: true,
    color: '#09090B',
  },
  {
    id: 'prof_pin_01',
    platform: Platform.PINTEREST,
    handle: '@theaiseeddesign',
    displayName: 'theaiseed Objects',
    followersCount: 89120,
    followingCount: 64,
    autoPublish: true,
    connected: true,
    color: '#BD081C',
  },
  {
    id: 'prof_li_01',
    platform: Platform.LINKEDIN,
    handle: 'theaiseed-collective',
    displayName: 'theaiseed Collective',
    followersCount: 12850,
    followingCount: 210,
    autoPublish: false,
    connected: true,
    color: '#0A66C2',
  },
  {
    id: 'prof_th_01',
    platform: Platform.THREADS,
    handle: '@theaiseed',
    displayName: 'theaiseed Threads',
    followersCount: 19400,
    followingCount: 140,
    autoPublish: true,
    connected: true,
    color: '#18181B',
  },
];

export const INITIAL_TIME_SLOTS: SavedTimeSlot[] = [
  { id: 'slot_1', profileId: 'prof_ig_01', dayOfWeek: 1, hour: 9, minute: 0, engagementScore: 0.92 },
  { id: 'slot_2', profileId: 'prof_ig_01', dayOfWeek: 2, hour: 11, minute: 0, engagementScore: 0.96 },
  { id: 'slot_3', profileId: 'prof_ig_01', dayOfWeek: 3, hour: 14, minute: 0, engagementScore: 0.89 },
  { id: 'slot_4', profileId: 'prof_ig_01', dayOfWeek: 4, hour: 10, minute: 0, engagementScore: 0.95 },
  { id: 'slot_5', profileId: 'prof_ig_01', dayOfWeek: 5, hour: 13, minute: 0, engagementScore: 0.91 },
  { id: 'slot_6', profileId: 'prof_tt_01', dayOfWeek: 2, hour: 16, minute: 0, engagementScore: 0.94 },
  { id: 'slot_7', profileId: 'prof_tt_01', dayOfWeek: 4, hour: 18, minute: 0, engagementScore: 0.97 },
  { id: 'slot_8', profileId: 'prof_pin_01', dayOfWeek: 3, hour: 12, minute: 0, engagementScore: 0.88 },
  { id: 'slot_9', profileId: 'prof_li_01', dayOfWeek: 2, hour: 8, minute: 0, engagementScore: 0.90 },
];

export const INITIAL_CALENDAR_NOTES: CalendarNote[] = [
  {
    id: 'note_01',
    date: '2026-10-22',
    hour: 13,
    title: 'Autumn Kiln Drop QA',
    body: 'Verify all Link in Bio UTM tags before Friday 10:00 AM Instagram carousel goes live.',
    color: '#4F46E5',
  },
  {
    id: 'note_02',
    date: '2026-10-20',
    hour: 9,
    title: 'Founder Reel Hook Check',
    body: 'Approve captions and pinned first comment for ceremonial matcha reel.',
    color: '#0D9488',
  },
];

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'med_01',
    filename: 'stoneware-vessels-autumn.jpg',
    objectKey: 'workspaces/ws_01J9X8A7Z9Y8X7/2026/10/stoneware-vessels-autumn.jpg',
    publicUrl: buildEditorialSvg('Stoneware Vessels No. 04', '1080x1080 · Raw Speckled Clay', ['#f5f3ef', '#d6cfc2', '#786b59'], 'vessels'),
    mediaType: MediaType.IMAGE,
    mimeType: 'image/jpeg',
    sizeBytes: 1842900,
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    tags: ['ceramics', 'launch', 'autumn'],
    notes: 'Hero shot from Tuesday morning kiln opening. Natural north window light.',
    starred: true,
    usageCount: 2,
    createdAt: '2026-10-19T14:20:00.000Z',
    palette: ['#f5f3ef', '#d6cfc2', '#786b59'],
  },
  {
    id: 'med_02',
    filename: 'ceremonial-matcha-whisk-reel.mp4',
    objectKey: 'workspaces/ws_01J9X8A7Z9Y8X7/2026/10/ceremonial-matcha-whisk-reel.mp4',
    publicUrl: buildEditorialSvg('Morning Matcha Pour', '1080x1920 · Ribbed Glassware', ['#eef5f0', '#a7c4b0', '#2d5a40'], 'matcha'),
    mediaType: MediaType.VIDEO,
    mimeType: 'video/mp4',
    sizeBytes: 8420100,
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    tags: ['reels', 'ritual', 'glassware'],
    notes: '15-second vertical cut with natural room audio for Reels and TikTok.',
    starred: true,
    usageCount: 1,
    createdAt: '2026-10-20T09:15:00.000Z',
    palette: ['#eef5f0', '#a7c4b0', '#2d5a40'],
  },
  {
    id: 'med_03',
    filename: 'botanical-apothecary-dropper.jpg',
    objectKey: 'workspaces/ws_01J9X8A7Z9Y8X7/2026/10/botanical-apothecary-dropper.jpg',
    publicUrl: buildEditorialSvg('Cypress & Hinoki Oil', '1080x1080 · Travertine Plinth', ['#f4f1ea', '#cbbba0', '#8c5a32'], 'botanical'),
    mediaType: MediaType.IMAGE,
    mimeType: 'image/jpeg',
    sizeBytes: 1520400,
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    tags: ['botanical', 'home-scent', 'launch'],
    notes: 'Pair with Link in Bio diffuser bundle product page.',
    starred: false,
    usageCount: 1,
    createdAt: '2026-10-20T16:40:00.000Z',
    palette: ['#f4f1ea', '#cbbba0', '#8c5a32'],
  },
  {
    id: 'med_04',
    filename: 'sunlit-oak-worktable-studio.jpg',
    objectKey: 'workspaces/ws_01J9X8A7Z9Y8X7/2026/10/sunlit-oak-worktable-studio.jpg',
    publicUrl: buildEditorialSvg('Kyoto & Portland Studio', '1440x1080 · Architectural Interior', ['#f1f5f9', '#cbd5e1', '#475569'], 'studio'),
    mediaType: MediaType.IMAGE,
    mimeType: 'image/jpeg',
    sizeBytes: 2190000,
    width: 1440,
    height: 1080,
    aspectRatio: '4:3',
    tags: ['studio', 'behind-the-scenes', 'editorial'],
    notes: 'Unused architectural wide shot ready for LinkedIn founder note.',
    starred: true,
    usageCount: 0,
    createdAt: '2026-10-21T11:05:00.000Z',
    palette: ['#f1f5f9', '#cbd5e1', '#475569'],
  },
  {
    id: 'med_05',
    filename: 'reduction-glaze-test-tiles.jpg',
    objectKey: 'workspaces/ws_01J9X8A7Z9Y8X7/2026/10/reduction-glaze-test-tiles.jpg',
    publicUrl: buildEditorialSvg('Ash Glaze Test Series', '1080x1350 · Cone 10 Reduction', ['#faf5f0', '#d9c3b0', '#9a4e32'], 'kiln'),
    mediaType: MediaType.IMAGE,
    mimeType: 'image/jpeg',
    sizeBytes: 1940000,
    width: 1080,
    height: 1350,
    aspectRatio: '3:4',
    tags: ['ceramics', 'process', 'unused'],
    notes: 'Unscheduled asset — ideal for Thursday 10:00 AM best time slot.',
    starred: false,
    usageCount: 0,
    createdAt: '2026-10-21T18:30:00.000Z',
    palette: ['#faf5f0', '#d9c3b0', '#9a4e32'],
  },
  {
    id: 'med_06',
    filename: 'nested-linen-serving-bowls.jpg',
    objectKey: 'workspaces/ws_01J9X8A7Z9Y8X7/2026/10/nested-linen-serving-bowls.jpg',
    publicUrl: buildEditorialSvg('Nested Dining Set', '1080x1080 · Matte Chalk Glaze', ['#f8fafc', '#cbd5e1', '#334155'], 'tableware'),
    mediaType: MediaType.IMAGE,
    mimeType: 'image/jpeg',
    sizeBytes: 1680000,
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    tags: ['tableware', 'launch', 'holiday'],
    notes: 'Wholesale lookbook lead image.',
    starred: true,
    usageCount: 1,
    createdAt: '2026-10-22T08:10:00.000Z',
    palette: ['#f8fafc', '#cbd5e1', '#334155'],
  },
  {
    id: 'med_07',
    filename: 'custom-kraft-packaging-box.jpg',
    objectKey: 'workspaces/ws_01J9X8A7Z9Y8X7/2026/10/custom-kraft-packaging-box.jpg',
    publicUrl: buildEditorialSvg('Plastic-Free Studio Parcels', '1080x1080 · Embossed Cotton Paper', ['#f5f5f4', '#d6d3d1', '#57534e'], 'packaging'),
    mediaType: MediaType.IMAGE,
    mimeType: 'image/jpeg',
    sizeBytes: 1410000,
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    tags: ['sustainability', 'studio', 'packaging'],
    notes: 'Unused asset for sustainability story.',
    starred: false,
    usageCount: 0,
    createdAt: '2026-10-22T15:00:00.000Z',
    palette: ['#f5f5f4', '#d6d3d1', '#57534e'],
  },
];

export const INITIAL_POSTS: ScheduledPost[] = [
  {
    id: 'post_01',
    profileId: 'prof_ig_01',
    mediaId: 'med_01',
    caption: 'Morning kiln opening — raw stoneware vessels in speckled clay. Wheel-thrown in small batches at our studio. #ceramics #minimaldesign #stoneware',
    firstComment: 'Full dimensions and glaze notes are now live in our bio link.',
    postType: 'FEED',
    publishMode: PublishMode.AUTO_PUBLISH,
    status: PostStatus.PUBLISHED,
    scheduledAt: '2026-10-20T11:00:00.000Z',
    publishedAt: '2026-10-20T11:00:04.000Z',
    linkInBioUrl: 'https://theaiseed.co/collections/stoneware-vessels-04',
    bullJobId: 'bull:social-publishing:101',
    impressions: 18420,
    reach: 15100,
    views: 21400,
    likes: 1490,
    comments: 84,
    saves: 412,
    shares: 129,
    bioClicks: 318,
  },
  {
    id: 'post_02',
    profileId: 'prof_tt_01',
    mediaId: 'med_02',
    caption: 'Pouring ceremonial Uji matcha into our hand-blown ribbed tumbler. Sound on for morning studio calm. #matcharitual #ceramicstudio #slowliving',
    firstComment: 'Ribbed tumblers restock this Friday at 9am.',
    postType: 'REEL',
    publishMode: PublishMode.AUTO_PUBLISH,
    status: PostStatus.PUBLISHED,
    scheduledAt: '2026-10-21T16:00:00.000Z',
    publishedAt: '2026-10-21T16:00:02.000Z',
    linkInBioUrl: 'https://theaiseed.co/products/ribbed-matcha-tumbler',
    bullJobId: 'bull:social-publishing:102',
    impressions: 42900,
    reach: 37400,
    views: 54800,
    likes: 3810,
    comments: 192,
    saves: 940,
    shares: 317,
    bioClicks: 615,
  },
  {
    id: 'post_03',
    profileId: 'prof_ig_01',
    mediaId: 'med_03',
    caption: 'Distilled Japanese Hinoki and wild coastal cypress in ultraviolet apothecary glass. Designed to anchor quiet workspace mornings. #botanicals #interiordesign',
    firstComment: 'Complimentary ceramic scent stone included with every autumn order.',
    postType: 'FEED',
    publishMode: PublishMode.AUTO_PUBLISH,
    status: PostStatus.SCHEDULED,
    scheduledAt: '2026-10-23T10:00:00.000Z',
    publishedAt: null,
    linkInBioUrl: 'https://theaiseed.co/products/cypress-hinoki-oil',
    bullJobId: 'bull:social-publishing:103',
    impressions: 0,
    reach: 0,
    views: 0,
    likes: 0,
    comments: 0,
    saves: 0,
    shares: 0,
    bioClicks: 42,
  },
  {
    id: 'post_04',
    profileId: 'prof_pin_01',
    mediaId: 'med_06',
    caption: 'Nested Dining Set in Matte Chalk Glaze — tactile stoneware plates and serving bowls for architectural dining tables.',
    firstComment: '',
    postType: 'FEED',
    publishMode: PublishMode.AUTO_PUBLISH,
    status: PostStatus.SCHEDULED,
    scheduledAt: '2026-10-23T14:00:00.000Z',
    publishedAt: null,
    linkInBioUrl: 'https://theaiseed.co/collections/nested-dining-set',
    bullJobId: 'bull:social-publishing:104',
    impressions: 0,
    reach: 0,
    views: 0,
    likes: 0,
    comments: 0,
    saves: 0,
    shares: 0,
    bioClicks: 19,
  },
  {
    id: 'post_05',
    profileId: 'prof_ig_01',
    mediaId: 'med_01',
    caption: 'Weekend studio open house schedule + wheel-throwing workshop seats for November. Tap our bio link to reserve a bench.',
    firstComment: 'Only 8 benches per session.',
    postType: 'CAROUSEL',
    publishMode: PublishMode.NOTIFICATION,
    status: PostStatus.SCHEDULED,
    scheduledAt: '2026-10-24T11:00:00.000Z',
    publishedAt: null,
    linkInBioUrl: 'https://theaiseed.co/workshops/november-wheel-throwing',
    bullJobId: 'bull:social-publishing:105',
    impressions: 0,
    reach: 0,
    views: 0,
    likes: 0,
    comments: 0,
    saves: 0,
    shares: 0,
    bioClicks: 0,
  },
  {
    id: 'post_06',
    profileId: 'prof_li_01',
    mediaId: 'med_04',
    caption: 'How we redesigned our packaging supply chain to eliminate 100% of single-use foam while cutting transit breakage to under 0.3%.',
    firstComment: 'Download our open-source packaging dielines in the comments.',
    postType: 'FEED',
    publishMode: PublishMode.AUTO_PUBLISH,
    status: PostStatus.FAILED,
    scheduledAt: '2026-10-22T08:00:00.000Z',
    publishedAt: null,
    linkInBioUrl: 'https://theaiseed.co/journal/zero-foam-packaging',
    bullJobId: 'bull:social-publishing:106',
    failureReason: 'LinkedIn API 429: Rate limit window exceeded on organization URN. Ready for manual retry.',
    impressions: 0,
    reach: 0,
    views: 0,
    likes: 0,
    comments: 0,
    saves: 0,
    shares: 0,
    bioClicks: 0,
  },
];

export const INITIAL_QUEUE_JOBS: QueueJob[] = [
  {
    id: 'bull:social-publishing:103',
    postId: 'post_03',
    profileId: 'prof_ig_01',
    queueName: 'social-publishing',
    state: 'delayed',
    attemptsMade: 0,
    maxAttempts: 3,
    scheduledFor: '2026-10-23T10:00:00.000Z',
    backoffDelayMs: 5000,
  },
  {
    id: 'bull:social-publishing:104',
    postId: 'post_04',
    profileId: 'prof_pin_01',
    queueName: 'social-publishing',
    state: 'delayed',
    attemptsMade: 0,
    maxAttempts: 3,
    scheduledFor: '2026-10-23T14:00:00.000Z',
    backoffDelayMs: 5000,
  },
  {
    id: 'bull:social-publishing:105',
    postId: 'post_05',
    profileId: 'prof_ig_01',
    queueName: 'social-publishing',
    state: 'waiting',
    attemptsMade: 0,
    maxAttempts: 3,
    scheduledFor: '2026-10-24T11:00:00.000Z',
    backoffDelayMs: 5000,
  },
  {
    id: 'bull:social-publishing:106',
    postId: 'post_06',
    profileId: 'prof_li_01',
    queueName: 'social-publishing',
    state: 'failed',
    attemptsMade: 2,
    maxAttempts: 3,
    scheduledFor: '2026-10-22T08:00:00.000Z',
    processedAt: '2026-10-22T08:00:09.000Z',
    errorReason: 'LinkedIn API 429: Rate limit window exceeded on organization URN.',
    backoffDelayMs: 5000,
  },
  {
    id: 'bull:social-publishing:102',
    postId: 'post_02',
    profileId: 'prof_tt_01',
    queueName: 'social-publishing',
    state: 'completed',
    attemptsMade: 1,
    maxAttempts: 3,
    scheduledFor: '2026-10-21T16:00:00.000Z',
    processedAt: '2026-10-21T16:00:02.000Z',
    backoffDelayMs: 5000,
  },
  {
    id: 'bull:social-publishing:101',
    postId: 'post_01',
    profileId: 'prof_ig_01',
    queueName: 'social-publishing',
    state: 'completed',
    attemptsMade: 1,
    maxAttempts: 3,
    scheduledFor: '2026-10-20T11:00:00.000Z',
    processedAt: '2026-10-20T11:00:04.000Z',
    backoffDelayMs: 5000,
  },
];

export const INITIAL_BIO_CONFIG: LinkInBioConfig = {
  handle: 'theaiseed',
  title: 'theaiseed',
  bio: 'Small-batch architectural stoneware & botanical objects crafted in Portland and Kyoto. Autumn Kiln Release is now live.',
  avatarUrl: INITIAL_SESSION.user.avatarUrl,
  theme: 'light',
  buttonRadius: 'md',
  pageViews: 3842,
  utmSource: 'reerts_bio',
  utmMedium: 'social',
  utmCampaign: 'autumn_kiln_2026',
  seoTitle: 'theaiseed — Architectural Ceramics & Botanical Objects',
  seoDescription: 'Explore wheel-thrown stoneware vessels, ceremonial matcha glassware, and botanical home objects by theaiseed.',
  affiliateEnabled: true,
  featuredBanner: {
    enabled: true,
    title: 'Autumn Kiln Release — Batch No. 04',
    subtitle: '24 wheel-thrown stoneware vessels & hinoki aroma diffusers',
    ctaLabel: 'Explore the Collection',
    url: 'https://theaiseed.co/collections/autumn-kiln-04',
  },
  socialLinks: [
    { platform: 'Instagram', url: 'https://instagram.com/theaiseed', enabled: true },
    { platform: 'TikTok', url: 'https://tiktok.com/@theaiseed.lab', enabled: true },
    { platform: 'Pinterest', url: 'https://pinterest.com/theaiseeddesign', enabled: true },
    { platform: 'YouTube', url: 'https://youtube.com/@theaiseed', enabled: true },
  ],
  buttons: [
    {
      id: 'btn_01',
      label: 'Shop Autumn Stoneware Release',
      url: 'https://theaiseed.co/collections/autumn-stoneware',
      clicks: 842,
      active: true,
      sortOrder: 0,
      blockType: 'BUTTON',
    },
    {
      id: 'btn_02',
      label: 'November Wheel-Throwing Workshops',
      url: 'https://theaiseed.co/workshops',
      clicks: 419,
      active: true,
      sortOrder: 1,
      blockType: 'BUTTON',
    },
    {
      id: 'btn_03',
      label: 'Hospitality & Architectural Trade Program',
      url: 'https://theaiseed.co/trade',
      clicks: 276,
      active: true,
      sortOrder: 2,
      blockType: 'BUTTON',
    },
    {
      id: 'btn_04',
      label: 'Read: Our Zero-Foam Packaging Dielines',
      url: 'https://theaiseed.co/journal/zero-foam-packaging',
      clicks: 164,
      active: true,
      sortOrder: 3,
      blockType: 'BUTTON',
    },
  ],
};

export const INITIAL_DAILY_METRICS: DailyMetricPoint[] = [
  {
    date: 'Oct 16',
    impressions: 11200,
    reach: 8900,
    engagements: 740,
    bioClicks: 142,
    pageViews: 410,
    instagramImpressions: 5200,
    threadsImpressions: 1800,
    tiktokImpressions: 2900,
    linkedinImpressions: 1300,
  },
  {
    date: 'Oct 17',
    impressions: 12850,
    reach: 10100,
    engagements: 820,
    bioClicks: 168,
    pageViews: 485,
    instagramImpressions: 6100,
    threadsImpressions: 2100,
    tiktokImpressions: 3250,
    linkedinImpressions: 1400,
  },
  {
    date: 'Oct 18',
    impressions: 15400,
    reach: 12300,
    engagements: 1090,
    bioClicks: 215,
    pageViews: 590,
    instagramImpressions: 7400,
    threadsImpressions: 2600,
    tiktokImpressions: 3900,
    linkedinImpressions: 1500,
  },
  {
    date: 'Oct 19',
    impressions: 14100,
    reach: 11200,
    engagements: 960,
    bioClicks: 194,
    pageViews: 520,
    instagramImpressions: 6800,
    threadsImpressions: 2300,
    tiktokImpressions: 3600,
    linkedinImpressions: 1400,
  },
  {
    date: 'Oct 20',
    impressions: 22900,
    reach: 18420,
    engagements: 1986,
    bioClicks: 318,
    pageViews: 840,
    instagramImpressions: 11400,
    threadsImpressions: 3500,
    tiktokImpressions: 5900,
    linkedinImpressions: 2100,
  },
  {
    date: 'Oct 21',
    impressions: 48600,
    reach: 42900,
    engagements: 4942,
    bioClicks: 615,
    pageViews: 1420,
    instagramImpressions: 21200,
    threadsImpressions: 6800,
    tiktokImpressions: 16400,
    linkedinImpressions: 4200,
  },
  {
    date: 'Oct 22',
    impressions: 31400,
    reach: 26800,
    engagements: 2810,
    bioClicks: 428,
    pageViews: 980,
    instagramImpressions: 14900,
    threadsImpressions: 4600,
    tiktokImpressions: 8900,
    linkedinImpressions: 3000,
  },
];

export const INITIAL_INBOX_THREADS: InboxThread[] = [
  {
    id: 'thr_01',
    profileId: 'prof_ig_01',
    platform: Platform.INSTAGRAM,
    authorName: 'Jack Flowers',
    authorHandle: '@flowersandserums',
    type: 'COMMENT',
    status: 'OPEN',
    postId: 'post_03',
    postPreviewTitle: 'Cypress & Hinoki Botanical Dropper Oil',
    lastActivityLabel: '2h ago',
    unread: true,
    messages: [
      {
        id: 'msg_01',
        senderName: 'Jack Flowers',
        senderHandle: '@flowersandserums',
        isBrandOwner: false,
        text: 'This looks great! When is the autumn release date for the Hinoki dropper?',
        timestamp: 'Today at 4:40 PM',
      },
      {
        id: 'msg_02',
        senderName: 'theaiseed Studio',
        senderHandle: '@theaiseed',
        isBrandOwner: true,
        text: '@flowersandserums Thank you so much for your comment! We are releasing Batch No. 04 this Friday at 10:00 AM.',
        timestamp: 'Today at 4:42 PM',
      },
      {
        id: 'msg_03',
        senderName: 'Jack Flowers',
        senderHandle: '@flowersandserums',
        isBrandOwner: false,
        text: 'I could totally see myself showing how your kit fits into my daily routine — maybe a studio unboxing or mini-review series! Let me know what kind of collab you are envisioning!',
        timestamp: 'Today at 4:45 PM',
      },
    ],
  },
  {
    id: 'thr_02',
    profileId: 'prof_ig_01',
    platform: Platform.INSTAGRAM,
    authorName: 'Terry Sloane',
    authorHandle: '@terrysloane.arch',
    type: 'COMMENT',
    status: 'OPEN',
    postId: 'post_01',
    postPreviewTitle: 'Stoneware Vessels No. 04',
    lastActivityLabel: '1d ago',
    unread: false,
    messages: [
      {
        id: 'msg_04',
        senderName: 'Terry Sloane',
        senderHandle: '@terrysloane.arch',
        isBrandOwner: false,
        text: 'The raw speckled clay texture is remarkable. Do you offer trade pricing for hospitality projects in Seattle?',
        timestamp: 'Yesterday at 2:15 PM',
      },
    ],
  },
  {
    id: 'thr_03',
    profileId: 'prof_tt_01',
    platform: Platform.TIKTOK,
    authorName: 'Mark T.',
    authorHandle: '@markt_design',
    type: 'DM',
    status: 'OPEN',
    postId: 'post_02',
    postPreviewTitle: 'Morning Matcha Pour Reel',
    lastActivityLabel: '2d ago',
    unread: false,
    messages: [
      {
        id: 'msg_05',
        senderName: 'Mark T.',
        senderHandle: '@markt_design',
        isBrandOwner: false,
        text: 'Where did you source the bamboo chasen whisk featured in the ribbed tumbler reel?',
        timestamp: 'Oct 20 at 11:30 AM',
      },
    ],
  },
  {
    id: 'thr_04',
    profileId: 'prof_li_01',
    platform: Platform.LINKEDIN,
    authorName: 'Clara Hendriks',
    authorHandle: '@clara-hendriks-supply',
    type: 'COMMENT',
    status: 'RESOLVED',
    postId: 'post_06',
    postPreviewTitle: 'Plastic-Free Studio Parcels Dieline',
    lastActivityLabel: '3d ago',
    unread: false,
    messages: [
      {
        id: 'msg_06',
        senderName: 'Clara Hendriks',
        senderHandle: '@clara-hendriks-supply',
        isBrandOwner: false,
        text: 'Downloaded the dielines — impressive compression test results on the corrugated insert.',
        timestamp: 'Oct 19 at 9:10 AM',
      },
    ],
  },
];

export const INITIAL_CREATOR_CAMPAIGNS: CreatorCampaign[] = [
  {
    id: 'cmp_01',
    brandName: 'Kinfolk & Co. Living',
    campaignTitle: 'Autumn Tableware Editorial Series',
    category: 'Home & Architecture',
    compensation: '$2,400 + Product Gifting',
    deliverables: '1x Instagram Reel + 3x High-Res Feed Stills',
    deadline: 'Nov 12, 2026',
    status: 'ACTIVE',
  },
  {
    id: 'cmp_02',
    brandName: ' Kyoto Botanical Lab',
    campaignTitle: 'Slow Morning Rituals Partnership',
    category: 'Wellness & Craft',
    compensation: '$1,850 Flat Fee',
    deliverables: '1x TikTok Video + Link in Bio Feature',
    deadline: 'Nov 20, 2026',
    status: 'AVAILABLE',
  },
  {
    id: 'cmp_03',
    brandName: 'Norden Acoustic Objects',
    campaignTitle: 'Minimalist Workspace Soundscape',
    category: 'Industrial Design',
    compensation: '$3,200 + 12% Affiliate Commission',
    deliverables: '1x Carousel Post + 2x Story Frames',
    deadline: 'Dec 01, 2026',
    status: 'AVAILABLE',
  },
];

export function generateCustomMediaAsset(
  filename: string,
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16',
  tags: string[]
): string {
  const palettes: [string, string, string][] = [
    ['#f5f3ef', '#d6cfc2', '#786b59'],
    ['#eef5f0', '#a7c4b0', '#2d5a40'],
    ['#f1f5f9', '#cbd5e1', '#334155'],
    ['#faf5f0', '#d9c3b0', '#9a4e32'],
  ];
  const palette = palettes[filename.length % palettes.length];
  return buildEditorialSvg(
    filename.replace(/\.[^.]+$/, ''),
    `${aspectRatio} · ${tags.slice(0, 2).join(' · ') || 'Studio Asset'}`,
    palette,
    'vessels'
  );
}
