'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DownloadPage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Download started! Check your downloads folder.');
      setUrl('');
    } catch {
      setError('Failed to process URL');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-16 pb-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8 py-6 border-b border-white/10">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Download Videos
          </h1>
          <p className="text-gray-400 text-sm">
            Free video downloader - Works with YouTube, Vimeo & more
          </p>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6 shadow-xl">
          <form onSubmit={handleDownload} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Video URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Now
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-500 text-xs text-center mb-4">Supported Platforms</p>
            <div className="flex justify-center gap-6 text-gray-400 text-sm">
              <span>YouTube</span>
              <span>•</span>
              <span>Vimeo</span>
              <span>•</span>
              <span>Dailymotion</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/home" className="text-red-500 hover:text-red-400 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
