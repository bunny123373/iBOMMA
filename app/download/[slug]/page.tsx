import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/mongodb';
import { Movie } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getMovie(slug: string) {
  try {
    const db = await getDb();
    const collection = db.collection('movies');
    const movie = await collection.findOne({ slug });
    return movie;
  } catch (error) {
    console.error('Failed to fetch movie:', error);
    return null;
  }
}

export default async function DownloadMoviePage({ params }: PageProps) {
  const { slug } = await params;
  const movie = await getMovie(slug);

  if (!movie) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-20 md:pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/home" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <div className="w-48 mx-auto md:mx-0">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-gray-400 text-sm">{movie.year}</span>
              <span className="text-gray-600">•</span>
              <span className="text-[#00a8e1] text-sm font-medium">{movie.quality[0] || 'HD'}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genre.slice(0, 4).map((g: string) => (
                <span key={g} className="text-xs px-2 py-1 bg-white/10 text-gray-300 rounded">
                  {g}
                </span>
              ))}
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
              {movie.description}
            </p>

            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Download Options</h3>
              <div className="space-y-3">
                {['1080p', '720p', '480p', '360p'].map((quality) => (
                  <div key={quality} className="flex items-center justify-between p-3 bg-[#0d0d0d] rounded-md">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-[#00a8e1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <div>
                        <p className="text-white text-sm font-medium">{quality}</p>
                        <p className="text-gray-500 text-xs">
                          {quality === '1080p' ? '1.8 GB' : quality === '720p' ? '900 MB' : quality === '480p' ? '450 MB' : '250 MB'}
                        </p>
                      </div>
                    </div>
                    <button className="bg-[#00a8e1] hover:bg-[#0092c7] text-white text-sm px-4 py-2 rounded transition-colors">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#1a1a1a] rounded-lg">
              <h3 className="text-white font-medium mb-3">Movie Info</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Audio</p>
                  <p className="text-white">{movie.audioLanguages?.join(', ') || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Year</p>
                  <p className="text-white">{movie.year}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
