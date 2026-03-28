import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/mongodb';

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
  const movie = await getMovie(slug) as any;

  if (!movie) {
    notFound();
  }

  const mp4Url = movie.mp4Url;

  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-16 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/home" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm">
          ← Back to Home
        </Link>

        <div className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-64 flex-shrink-0">
              <div className="relative aspect-[2/3] md:aspect-auto md:h-full min-h-[300px]">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent md:bg-gradient-to-r md:from-[#1a1a1a] md:via-transparent" />
              </div>
            </div>

            <div className="flex-1 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{movie.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                    <span>{movie.year}</span>
                    <span className="text-gray-600">•</span>
                    {movie.audioLanguages?.slice(0, 2).map((lang: string) => (
                      <span key={lang} className="bg-red-600/20 text-red-400 px-2 py-0.5 rounded text-xs">{lang}</span>
                    ))}
                    {movie.quality?.slice(0, 1).map((q: string) => (
                      <span key={q} className="bg-green-600/20 text-green-400 px-2 py-0.5 rounded text-xs">{q}</span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                {movie.description}
              </p>

              <div className="space-y-3">
                <h3 className="text-white font-semibold text-lg">Download</h3>
                
                {mp4Url ? (
                  <a
                    href={mp4Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <div>
                        <p className="font-semibold">Download MP4</p>
                        <p className="text-xs opacity-80">Direct download link</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                ) : (
                  <div className="p-4 bg-gray-700 text-white rounded-lg">
                    <p className="text-sm">No download link available</p>
                  </div>
                )}

                <div className="p-4 bg-[#0d0d0d] rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Supported formats:</p>
                  <div className="flex gap-2">
                    <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">MP4</span>
                    <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">MKV</span>
                    <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded">AVI</span>
                    <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded">MKV</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Genre</p>
                    <p className="text-white">{movie.genre?.slice(0, 3).join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Audio</p>
                    <p className="text-white">{movie.audioLanguages?.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/home" className="text-red-500 hover:text-red-400 text-sm">
            ← Browse More Movies
          </Link>
        </div>
      </div>
    </div>
  );
}
