import React, { useState } from 'react';

export interface ZoractPostItem {
  id: string;
  handle: string;
  date: string;
  description: string;
  image: string;
  avatar: string;
  engagements: number;
}

const DEFAULT_DESCRIPTION =
  'The Free education dashboard design is a great way to gain more insight into the lives of the students. It allows the teachers to get a better...';

const INITIAL_TOP_POSTS: ZoractPostItem[] = [
  {
    id: 'top-1',
    handle: '@Hussain14320623',
    date: 'Mon Jun 13th, 2022 5:58pm',
    description: DEFAULT_DESCRIPTION,
    image: '/assets/zoract/post-1.png',
    avatar: '/assets/zoract/avatar-1.png',
    engagements: 401,
  },
  {
    id: 'top-2',
    handle: '@Mahfuzul24320614',
    date: 'Mon Jun 14th, 2022 6:58pm',
    description: DEFAULT_DESCRIPTION,
    image: '/assets/zoract/post-2.png',
    avatar: '/assets/zoract/avatar-2.png',
    engagements: 700,
  },
  {
    id: 'top-3',
    handle: '@Tajul14320641',
    date: 'Mon Jun 15th, 2022 6:40pm',
    description: DEFAULT_DESCRIPTION,
    image: '/assets/zoract/post-3.png',
    avatar: '/assets/zoract/avatar-3.png',
    engagements: 540,
  },
  {
    id: 'top-4',
    handle: '@Jubed24320614',
    date: 'Mon Jun 13th, 2022 5:58pm',
    description: DEFAULT_DESCRIPTION,
    image: '/assets/zoract/post-4.png',
    avatar: '/assets/zoract/avatar-4.png',
    engagements: 840,
  },
];

const INITIAL_ENGAGEMENT_POSTS: ZoractPostItem[] = [
  {
    id: 'eng-1',
    handle: '@Hussain14320623',
    date: 'Mon Jun 13th, 2022 5:58pm',
    description: DEFAULT_DESCRIPTION,
    image: '/assets/zoract/post-5.png',
    avatar: '/assets/zoract/avatar-5.png',
    engagements: 840,
  },
  {
    id: 'eng-2',
    handle: '@Hussain14320623',
    date: 'Mon Jun 13th, 2022 5:58pm',
    description: DEFAULT_DESCRIPTION,
    image: '/assets/zoract/post-6.png',
    avatar: '/assets/zoract/avatar-6.png',
    engagements: 700,
  },
];

function TwitterBirdIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  );
}

export function PushPinOutlineIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5.2 2.2h5.6l-.6 3.5 1.8 1.9v1.2H4V7.6l1.8-1.9-.6-3.5z" />
      <path d="M8 8.8v5" />
    </svg>
  );
}

function ThreeDotsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3.2" cy="8" r="1.2" />
      <circle cx="8" cy="8" r="1.2" />
      <circle cx="12.8" cy="8" r="1.2" />
    </svg>
  );
}

interface PostCardProps {
  post: ZoractPostItem;
  variant: 'filled' | 'plain';
  onBoostEngagement: (id: string) => void;
  onReschedule: (post: ZoractPostItem) => void;
}

function ZoractPostCard({
  post,
  variant,
  onBoostEngagement,
  onReschedule,
}: PostCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article
      className={
        variant === 'filled'
          ? 'relative bg-[#F7F7F8] rounded-[8px] px-[10px] pt-[10px] pb-[9px] flex flex-col'
          : 'relative bg-white px-[10px] pt-[10px] pb-[9px] flex flex-col'
      }
    >
      {/* Top Author Row */}
      <div className="flex items-start justify-between mb-[7px]">
        <div className="flex items-center gap-[8px] min-w-0">
          <img
            src={post.avatar}
            alt={post.handle}
            className="w-[28px] h-[28px] rounded-full object-cover shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-[4px]">
              <TwitterBirdIcon className="w-[11.5px] h-[11.5px] text-[#1DA1F2] shrink-0" />
              <span className="text-[11px] font-semibold text-[#171717] leading-[13.5px] truncate">
                {post.handle}
              </span>
            </div>
            <p className="text-[10px] font-normal text-[#85858F] leading-[13px] mt-[2px] truncate">
              {post.date}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={`Post actions for ${post.handle}`}
            className="text-[#6E6E77] hover:text-[#171717] p-0.5 rounded transition-colors cursor-pointer"
          >
            <ThreeDotsIcon className="w-[14px] h-[14px]" />
          </button>

          {menuOpen && (
            <div
              onMouseLeave={() => setMenuOpen(false)}
              className="absolute right-0 top-5 z-20 w-36 rounded-[8px] bg-white border border-[#ECECF0] shadow-md py-1 text-[11px] text-[#171717]"
            >
              <button
                type="button"
                onClick={() => {
                  onBoostEngagement(post.id);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#F7F7F8] cursor-pointer"
              >
                +1 Engagement
              </button>
              <button
                type="button"
                onClick={() => {
                  onReschedule(post);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#F7F7F8] cursor-pointer"
              >
                Open in Composer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Description */}
      <p className="text-[10px] font-normal text-[#85858F] leading-[14.2px] mb-[9px] line-clamp-3">
        {post.description}
      </p>

      {/* Post Image */}
      <div className="w-full h-[148px] rounded-[8px] overflow-hidden mb-[9px] shrink-0">
        <img
          src={post.image}
          alt={`Post by ${post.handle}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom Metadata Row */}
      <div className="flex items-center justify-between pt-[1px]">
        <span className="text-[10px] font-medium text-[#85858F] leading-[13px]">
          Engagements
        </span>
        <span className="text-[10.5px] font-bold text-[#171717] leading-[13px] tabular-nums">
          {post.engagements}
        </span>
      </div>
    </article>
  );
}

interface ZoractDashboardModuleProps {
  onCreatePost: (initialCaption?: string) => void;
  onNavigateToSchedule: () => void;
  onNavigateToApprovals: () => void;
}

export function ZoractDashboardModule({
  onCreatePost,
  onNavigateToSchedule,
  onNavigateToApprovals,
}: ZoractDashboardModuleProps) {
  const [topPosts, setTopPosts] = useState<ZoractPostItem[]>(INITIAL_TOP_POSTS);
  const [engagementPosts, setEngagementPosts] = useState<ZoractPostItem[]>(
    INITIAL_ENGAGEMENT_POSTS
  );

  const handleBoostTop = (id: string) => {
    setTopPosts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, engagements: item.engagements + 1 } : item
      )
    );
  };

  const handleBoostEngagement = (id: string) => {
    setEngagementPosts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, engagements: item.engagements + 1 } : item
      )
    );
  };

  return (
    <div className="w-full">
      {/* Top Section: Announcement Card (Left) + To do Card (Right) */}
      <div className="flex flex-col lg:flex-row items-stretch gap-[15px]">
        {/* Announcement Card */}
        <section
          aria-label="Publish your first Post"
          className="relative flex-1 min-h-[144px] h-[144px] rounded-[16px] bg-[#1F1E2D] overflow-hidden flex items-center pl-[27px] pr-[150px]"
        >
          <div className="relative z-10 flex flex-col items-start justify-center">
            <h1 className="text-[18.5px] font-bold text-white leading-[23px] tracking-[-0.01em] mb-[7px]">
              Publish your first Post...
            </h1>
            <p className="text-[11px] font-normal text-[#7E7D8E] leading-[15.5px] mb-[13px] max-w-[215px]">
              Publish, schedule or queue to reach
              <br />
              your audience at the perfect time.
            </p>
            <button
              type="button"
              onClick={() => onCreatePost()}
              className="h-[28px] px-[14px] rounded-full bg-[#FFFF00] hover:bg-[#f2f200] text-[#171717] text-[10.5px] font-semibold inline-flex items-center justify-center transition-colors cursor-pointer"
            >
              Create Post
            </button>
          </div>

          {/* Right Decorative Layered Graphic */}
          <img
            src="/assets/zoract/banner-graphic.png"
            alt=""
            aria-hidden="true"
            className="absolute right-0 top-0 h-[144px] w-[145px] object-cover select-none pointer-events-none"
          />
        </section>

        {/* To do Card */}
        <section
          aria-label="To do"
          className="w-full lg:w-[265px] shrink-0 h-[144px] rounded-[16px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#F5F5F7] px-[16px] pt-[15px] pb-[12px] flex flex-col"
        >
          <h2 className="text-[13px] font-semibold text-[#171717] leading-[16px] pb-[10px] border-b border-[#F3F3F6]">
            To do
          </h2>

          <button
            type="button"
            onClick={onNavigateToSchedule}
            className="h-[38px] w-full flex items-center border-b border-[#F3F3F6] text-left hover:bg-[#FAFAFC] transition-colors cursor-pointer"
          >
            <PushPinOutlineIcon className="w-[13px] h-[13px] text-[#85858F] shrink-0" />
            <span className="text-[11px] font-normal text-[#85858F] ml-[9px] w-[48px] tabular-nums">
              15
            </span>
            <span className="text-[11px] font-medium text-[#171717]">
              Schedule
            </span>
          </button>

          <button
            type="button"
            onClick={onNavigateToApprovals}
            className="h-[38px] w-full flex items-center text-left hover:bg-[#FAFAFC] transition-colors cursor-pointer"
          >
            <PushPinOutlineIcon className="w-[13px] h-[13px] text-[#85858F] shrink-0" />
            <span className="text-[11px] font-normal text-[#85858F] ml-[9px] w-[48px] tabular-nums">
              08
            </span>
            <span className="text-[11px] font-medium text-[#171717]">
              Open Approvals
            </span>
          </button>
        </section>
      </div>

      {/* Bottom Section: Your Top Posts (Left 2x2 Grid) + Top Engagements Posts (Right Single Column) */}
      <div className="mt-[22px] flex flex-col lg:flex-row items-stretch">
        {/* Left Column: Your Top Posts */}
        <section aria-label="Your Top Posts" className="flex-1 min-w-0">
          <div className="mb-[13px] leading-[20px]">
            <h2 className="inline text-[15.5px] font-bold text-[#171717] tracking-[-0.01em]">
              Your Top Posts
            </h2>
            <span className="text-[15px] font-normal text-[#85858F] ml-[5px]">
              (past 7 days)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[14px] gap-y-[17px]">
            {topPosts.map((post) => (
              <ZoractPostCard
                key={post.id}
                post={post}
                variant="filled"
                onBoostEngagement={handleBoostTop}
                onReschedule={(p) => onCreatePost(p.description)}
              />
            ))}
          </div>
        </section>

        {/* Subtle Vertical Divider between Left and Right Sections */}
        <div
          aria-hidden="true"
          className="hidden lg:block w-[1px] bg-[#F0F0F3] ml-[14px] mr-[14px] mt-[33px]"
        />

        {/* Right Column: Top Engagements Posts */}
        <section
          aria-label="Top Engagements Posts"
          className="w-full lg:w-[252px] shrink-0 mt-6 lg:mt-0"
        >
          <div className="mb-[13px] leading-[20px] lg:pl-[9px]">
            <h2 className="inline text-[13.5px] font-bold text-[#171717] tracking-[-0.01em]">
              Top Engagements Posts
            </h2>
            <span className="text-[13px] font-normal text-[#85858F] ml-[4px]">
              (past 7 days)
            </span>
          </div>

          <div className="flex flex-col lg:pl-[1px]">
            <ZoractPostCard
              post={engagementPosts[0]}
              variant="plain"
              onBoostEngagement={handleBoostEngagement}
              onReschedule={(p) => onCreatePost(p.description)}
            />

            <div
              aria-hidden="true"
              className="h-[1px] bg-[#F0F0F3] my-[8px] mx-[4px]"
            />

            <ZoractPostCard
              post={engagementPosts[1]}
              variant="plain"
              onBoostEngagement={handleBoostEngagement}
              onReschedule={(p) => onCreatePost(p.description)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
