import { getDb } from '@/lib/mongodb';
import { HeroBanner } from '@/components/HeroBanner';
import { MovieRow } from '@/components/MovieRow';
import { ContinueWatchingCard } from '@/components/ContinueWatchingCard';
import { sampleMovies } from '@/lib/sampleData';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

async function getMovies() {
  try {
    const db = await getDb();
    const collection = db.collection('movies');
    const movies = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return movies.length > 0 ? movies : sampleMovies;
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    return sampleMovies;
  }
}

export default async function HomePage() {
  const movies = await getMovies();

  const featuredMovie = movies.find((m) => m.featured) || movies[0];
  const trendingMovies = movies.slice(0, 10);
  const latestMovies = movies.slice(0, 12);
  const teluguMovies = movies.filter((m) => m.audioLanguages?.includes('Telugu')).slice(0, 10);
  const tamilMovies = movies.filter((m) => m.audioLanguages?.includes('Tamil')).slice(0, 10);
  const hindiMovies = movies.filter((m) => m.audioLanguages?.includes('Hindi')).slice(0, 10);
  const englishMovies = movies.filter((m) => m.audioLanguages?.includes('English')).slice(0, 10);

  return (
    <div className="min-h-screen bg-mirror-darker">
      {featuredMovie && <HeroBanner movie={featuredMovie} />}

      <div className="space-y-2 pb-8">
        <MovieRow title="Trending Now" movies={trendingMovies} seeAllLink="/movies?sort=trending" />
        <MovieRow title="Latest Added" movies={latestMovies} seeAllLink="/movies?sort=latest" />
        <MovieRow title="Telugu Movies" movies={teluguMovies} seeAllLink="/movies?language=Telugu" />
        <MovieRow title="Tamil Movies" movies={tamilMovies} seeAllLink="/movies?language=Tamil" />
        <MovieRow title="Hindi Movies" movies={hindiMovies} seeAllLink="/movies?language=Hindi" />
        <MovieRow title="English Movies" movies={englishMovies} seeAllLink="/movies?language=English" />
      </div>

      <footer className="bg-mirror-dark py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">WATCHMIRROR</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>About Us</li>
                <li>Careers</li>
                <li>Press</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Help Center</li>
                <li>Terms of Use</li>
                <li>Privacy Policy</li>
                <li>FAQs</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Cookie Policy</li>
                <li>Licenses</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Twitter</li>
                <li>Facebook</li>
                <li>Instagram</li>
                <li>YouTube</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
            <p>© 2026 WATCHMIRROR. All rights reserved. Premium streaming experience.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
