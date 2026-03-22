import { getDb } from '@/lib/mongodb';
import { HeroBanner } from '@/components/HeroBanner';
import { MovieRow } from '@/components/MovieRow';
import { sampleMovies } from '@/lib/sampleData';
import { Movie } from '@/lib/types';

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
  const movies = (await getMovies()) as Movie[];

  const featuredMovie = movies.find((m) => m.featured) || movies[0];
  const trendingMovies = movies.slice(0, 10);
  const latestMovies = movies.slice(0, 12);
  const teluguMovies = movies.filter((m) => m.audioLanguages?.includes('Telugu')).slice(0, 10);
  const tamilMovies = movies.filter((m) => m.audioLanguages?.includes('Tamil')).slice(0, 10);
  const hindiMovies = movies.filter((m) => m.audioLanguages?.includes('Hindi')).slice(0, 10);
  const englishMovies = movies.filter((m) => m.audioLanguages?.includes('English')).slice(0, 10);

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {featuredMovie && <HeroBanner movie={featuredMovie} />}

      <div className="space-y-2 pb-12">
        <MovieRow title="Included with Prime" movies={trendingMovies} seeAllLink="/movies?sort=trending" />
        <MovieRow title="Latest Movies" movies={latestMovies} seeAllLink="/movies?sort=latest" />
        <MovieRow title="Telugu" movies={teluguMovies} seeAllLink="/movies?language=Telugu" />
        <MovieRow title="Tamil" movies={tamilMovies} seeAllLink="/movies?language=Tamil" />
        <MovieRow title="Hindi" movies={hindiMovies} seeAllLink="/movies?language=Hindi" />
        <MovieRow title="English" movies={englishMovies} seeAllLink="/movies?language=English" />
      </div>

      <footer className="bg-[#0d0d0d] border-t border-white/5 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-6 md:gap-10 text-sm text-gray-500 mb-8">
            <a href="#" className="hover:text-gray-400">Terms and Privacy Notice</a>
            <a href="#" className="hover:text-gray-400">Send us feedback</a>
            <a href="#" className="hover:text-gray-400">Help</a>
          </div>
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()}, Prime<span className="text-[#00a8e1]">Video</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
