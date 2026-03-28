'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DownloadPage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    title?: string;
    quality?: string;
    size?: string;
  } | null>(null);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResult({
        success: true,
        message: 'Download ready!',
        title: 'Sample Movie',
        quality: '1080p',
        size: '1.2 GB'
      });
    } catch {
      setResult({
        success: false,
        message: 'Failed to process URL. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-20 md:pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Download Movies
          </h1>
          <p className="text-gray-400">
            Paste a video URL to download in high quality
          </p>
        </div>

        <form onSubmit={handleDownload} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste video URL here..."
              className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00a8e1] transition-colors"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#00a8e1] hover:bg-[#0092c7] text-white px-6 py-3 rounded-md font-semibold transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Download'}
            </button>
          </div>
        </form>

        {result && (
          <div className={`p-6 rounded-lg ${result.success ? 'bg-green-900/20 border border-green-700' : 'bg-red-900/20 border border-red-700'}`}>
            <div className="flex items-center gap-3 mb-4">
              {result.success ? (
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <h3 className="text-lg font-semibold text-white">{result.message}</h3>
            </div>

            {result.success && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Title:</span>
                  <span className="text-white">{result.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Quality:</span>
                  <span className="text-white">{result.quality}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Size:</span>
                  <span className="text-white">{result.size}</span>
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="flex-1 bg-[#00a8e1] hover:bg-[#0092c7] text-white py-2 rounded-md font-medium transition-colors">
                    Download Now
                  </button>
                  <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-md font-medium transition-colors">
                    Copy Link
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 p-6 bg-[#1a1a1a] rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Supported Sources</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['YouTube', 'Vimeo', 'Dailymotion', 'Direct URL'].map((source) => (
              <div key={source} className="flex items-center gap-2 text-gray-400 text-sm">
                <svg className="w-4 h-4 text-[#00a8e1]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                {source}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-[#00a8e1] hover:text-[#0092c7] text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
