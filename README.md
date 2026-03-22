# WATCHMIRROR - Premium OTT Movie Streaming Platform

A production-ready premium movie streaming platform built with Next.js 16, TypeScript, Tailwind CSS, MongoDB, and hls.js.

![WATCHMIRROR](https://img.shields.io/badge/WATCHMIRROR-Premium%20Streaming-red)
![Next.js](https://img.shields.io/badge/Next.js-16.0.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6.3.0-green)

## Features

### Core Features
- **Premium Cinematic UI** - Dark, modern OTT-style design
- **HLS Video Streaming** - Direct .m3u8 playback with hls.js
- **Custom Video Player** - Full-featured player with quality switching, subtitles, and more
- **Responsive Design** - Mobile-first with premium desktop experience
- **Real-time Search** - Instant search with language and genre filters
- **Continue Watching** - Playback resume functionality
- **User Favorites** - Save movies to personal list
- **Admin Dashboard** - Full movie management system

### Pages
- Home - Cinematic hero banner with movie sections
- Movies - Browse all movies with filters
- Series - Series section (coming soon)
- Languages - Browse by language
- Search - Full search functionality
- Profile - User profile and lists
- Movie Detail - Full movie information
- Watch - Video player page
- Admin Dashboard - Protected admin panel

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4.0
- **Database**: MongoDB 6.3
- **Video Player**: hls.js
- **Authentication**: JWT (jose), bcryptjs

## Project Structure

```
watchmirror/
├── app/
│   ├── api/                  # API routes
│   │   ├── admin/           # Admin API routes
│   │   ├── movies/          # Movies API
│   │   └── user/            # User API
│   ├── admin-secret-dashboard/  # Admin panel
│   ├── movie/[slug]/        # Movie detail page
│   ├── watch/[slug]/        # Watch page
│   └── ...
├── components/              # React components
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities and config
└── scripts/                 # Database scripts
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd watchmirror
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/watchmirror
ADMIN_SECRET=your-secure-admin-secret-key
JWT_SECRET=your-jwt-secret-key
```

4. Seed the database (optional but recommended):
```bash
node scripts/seed.js
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Admin Dashboard

Access the admin dashboard at `/admin-secret-dashboard`

Default login:
- Password: Use the `ADMIN_SECRET` from your `.env.local` file

### Admin Features
- View all movies
- Add new movies
- Edit existing movies
- Delete movies
- Mark movies as featured

## API Endpoints

### Movies
- `GET /api/movies` - Get all movies (with optional filters)
- `GET /api/movies/[slug]` - Get movie by slug
- `POST /api/movies` - Create new movie
- `PUT /api/movies/[slug]` - Update movie
- `DELETE /api/movies/[slug]` - Delete movie

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/movies` - Get all movies (protected)
- `POST /api/admin/movies` - Create movie (protected)
- `PUT /api/admin/movies` - Update movie (protected)
- `DELETE /api/admin/movies` - Delete movie (protected)

### Query Parameters
```
/api/movies?q=search&language=Telugu&genre=Action&featured=true
```

## Video Player Features

- Direct HLS streaming (.m3u8)
- Quality switching (Auto, 1080p, 720p, 480p)
- Audio language selection
- Playback speed control (0.5x - 2x)
- Skip forward/backward (10 seconds)
- Volume control with mute
- Fullscreen mode
- Progress bar with preview
- Playback resume memory
- Mobile-optimized controls

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## MongoDB Collections

### movies
```typescript
{
  title: string;
  slug: string;
  poster: string;
  backdrop: string;
  description: string;
  hls: string;
  audioLanguages: string[];
  quality: string[];
  genre: string[];
  year: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### users (future implementation)
```typescript
{
  email: string;
  password: string;
  name: string;
  continueWatching: ContinueWatchingItem[];
  favorites: string[];
  watchHistory: WatchHistoryItem[];
  createdAt: Date;
}
```

## Performance Optimizations

- Server components where possible
- Image optimization with Next.js Image
- Lazy loading for off-screen content
- MongoDB connection caching
- API response caching with Next.js

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

Private - All rights reserved

## Support

For support, email support@watchmirror.com

---

Built with ❤️ by WATCHMIRROR Team
