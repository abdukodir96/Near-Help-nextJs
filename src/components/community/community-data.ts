export type CommunityCategoryKey = 'free-board' | 'recommendation' | 'news' | 'humor';

export type CommunityCategory = {
  key: CommunityCategoryKey;
  label: string;
  heading: string;
  description: string;
};

export type CommunityPost = {
  id: string;
  category: CommunityCategoryKey;
  title: string;
  excerpt: string;
  author: string;
  image: string;
  month: string;
  day: string;
  views: number;
  likes: number;
};

export const communityCategories: CommunityCategory[] = [
  {
    key: 'free-board',
    label: 'Free Board',
    heading: 'FREE BOARD',
    description: 'Share your service stories, repair questions, and honest opinions without heavy posting restrictions.',
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    heading: 'RECOMMENDATION',
    description: 'Browse homeowner recommendations, trusted agent shout-outs, and service suggestions from the community.',
  },
  {
    key: 'news',
    label: 'News',
    heading: 'NEWS',
    description: 'Follow NearHelp updates, platform notices, and important service announcements in one place.',
  },
  {
    key: 'humor',
    label: 'Humor',
    heading: 'HUMOR',
    description: 'Light repair jokes, relatable home-service moments, and fun community posts to keep the board lively.',
  },
];

export const communityPosts: CommunityPost[] = [
  {
    id: 'martin-coming-soon',
    category: 'free-board',
    title: 'Coming soon',
    excerpt: 'We are preparing a better local board where homeowners can freely ask, share, and compare service experiences.',
    author: 'Martin',
    image: '/theme/images/projects/img-8.jpg',
    month: 'January',
    day: '13',
    views: 37,
    likes: 15,
  },
  {
    id: 'neo-same-day-repair',
    category: 'free-board',
    title: 'Same-day repair saved our kitchen sink',
    excerpt: 'The agent showed up fast, explained the leak clearly, and fixed it without pushing extra work we did not need.',
    author: 'Neo',
    image: '/theme/images/blog/img-2.jpg',
    month: 'January',
    day: '15',
    views: 11,
    likes: 6,
  },
  {
    id: 'pnu-help-me',
    category: 'free-board',
    title: 'Help me choose the right service option',
    excerpt: 'I have a bathroom issue and I am not sure if I should book standard, premium, or emergency support.',
    author: 'PNU',
    image: '/theme/images/blog/img-3.jpg',
    month: 'February',
    day: '03',
    views: 4,
    likes: 3,
  },
  {
    id: 'soomin-gas-line-warning',
    category: 'free-board',
    title: 'Gas line check before moving in was worth it',
    excerpt: 'We almost skipped the inspection, but the review found a risky connection issue before move-in day.',
    author: 'Soomin',
    image: '/theme/images/projects/img-9.jpg',
    month: 'February',
    day: '16',
    views: 29,
    likes: 12,
  },
  {
    id: 'recommendation-kitchen',
    category: 'recommendation',
    title: 'Best agent for under-sink leak corrections?',
    excerpt: 'Looking for a clean and careful technician in Seoul who can handle repeated kitchen drain issues.',
    author: 'Ara Kim',
    image: '/theme/images/service/1.jpg',
    month: 'March',
    day: '08',
    views: 42,
    likes: 19,
  },
  {
    id: 'recommendation-cleanup',
    category: 'recommendation',
    title: 'Who is strong at post-renovation clean-up?',
    excerpt: 'Need recommendations for a team that can leave the place fully ready after bathroom work is finished.',
    author: 'Yuna Park',
    image: '/theme/images/service/6.jpg',
    month: 'March',
    day: '18',
    views: 21,
    likes: 9,
  },
  {
    id: 'news-booking-update',
    category: 'news',
    title: 'Booking requests now support clearer service categories',
    excerpt: 'NearHelp now separates service category from service option to make appointment review easier for admins.',
    author: 'NearHelp Team',
    image: '/theme/images/blog/img-4.jpg',
    month: 'April',
    day: '02',
    views: 56,
    likes: 24,
  },
  {
    id: 'news-agent-ranking',
    category: 'news',
    title: 'Top master agents ranking now visible on the home page',
    excerpt: 'Agent ranking reflects completed projects, likes, and follower count so homeowners can compare trusted pros faster.',
    author: 'NearHelp Team',
    image: '/theme/images/team-single.jpg',
    month: 'April',
    day: '11',
    views: 48,
    likes: 20,
  },
  {
    id: 'humor-plunger',
    category: 'humor',
    title: 'When the leak stops only after the agent arrives',
    excerpt: 'Classic homeowner moment: the pipe behaves perfectly the second the technician knocks on the door.',
    author: 'Joon',
    image: '/theme/images/blog/img-5.jpg',
    month: 'April',
    day: '06',
    views: 31,
    likes: 17,
  },
  {
    id: 'humor-emergency',
    category: 'humor',
    title: 'Booked emergency for a drip, ended up making tea while waiting',
    excerpt: 'Not every late-night panic turns into disaster, but at least now I know how service options really work.',
    author: 'Mina',
    image: '/theme/images/blog/img-6.jpg',
    month: 'April',
    day: '14',
    views: 26,
    likes: 13,
  },
];
