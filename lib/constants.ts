export const APP_NAME = 'WATCHMIRROR';
export const APP_DESCRIPTION = 'Premium Movie Streaming Platform';

export const LANGUAGES = [
  'Telugu',
  'Tamil',
  'Hindi',
  'English',
  'Malayalam',
  'Kannada',
] as const;

export const GENRES = [
  'Action',
  'Drama',
  'Comedy',
  'Thriller',
  'Romance',
  'Horror',
  'Sci-Fi',
  'Documentary',
  'Animation',
  'Crime',
  'Biography',
  'History',
  'Fantasy',
  'Mystery',
] as const;

export const QUALITY_OPTIONS = [
  '4K',
  '1080p',
  '720p',
  '480p',
  '360p',
] as const;

export const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/movies', label: 'Movies' },
  { href: '/series', label: 'Series' },
  { href: '/languages', label: 'Languages' },
] as const;

export const FOOTER_LINKS = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Contact', href: '/contact' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'FAQs', href: '/faq' },
  ],
  legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Licenses', href: '/licenses' },
  ],
  social: [
    { label: 'Twitter', href: 'https://twitter.com/watchmirror' },
    { label: 'Facebook', href: 'https://facebook.com/watchmirror' },
    { label: 'Instagram', href: 'https://instagram.com/watchmirror' },
    { label: 'YouTube', href: 'https://youtube.com/watchmirror' },
  ],
};
