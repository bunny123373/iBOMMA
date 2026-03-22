export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getImageUrl(url: string): string {
  if (!url) return '/placeholder.jpg';
  if (url.startsWith('http')) return url;
  return `https://images.unsplash.com/${url}`;
}

export const QUALITY_OPTIONS = ['4K', '1080p', '720p', '480p', '360p'] as const;
export const LANGUAGE_OPTIONS = ['Telugu', 'Tamil', 'Hindi', 'English', 'Malayalam', 'Kannada'] as const;
export const GENRE_OPTIONS = ['Action', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Horror', 'Sci-Fi', 'Documentary', 'Animation', 'Crime'] as const;
