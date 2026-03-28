'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Movie } from '@/lib/types';
import { showToast } from '@/components/Toaster';

const TMDB_API_KEY = '83a327b565b5e333dd2dc755f76177a9';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

interface TMDBSearchResult {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  genre_ids: number[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    poster: '',
    backdrop: '',
    description: '',
    mp4Url: '',
    audioLanguages: '',
    quality: '',
    genre: '',
    year: new Date().getFullYear(),
    featured: false,
  });
  const [tmdbQuery, setTmdbQuery] = useState('');
  const [tmdbResults, setTmdbResults] = useState<TMDBSearchResult[]>([]);
  const [tmdbSearching, setTmdbSearching] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      fetchMovies(savedToken);
    }
  }, []);

  const fetchMovies = async (authToken: string) => {
    try {
      const res = await fetch('/api/admin/movies', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.movies) {
        setMovies(data.movies);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const searchTMDB = async (query: string) => {
    if (query.length < 2) {
      setTmdbResults([]);
      return;
    }
    setTmdbSearching(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
      );
      const data = await res.json();
      setTmdbResults(data.results?.slice(0, 8) || []);
    } catch (error) {
      console.error('TMDB search error:', error);
      setTmdbResults([]);
    } finally {
      setTmdbSearching(false);
    }
  };

  const fillFromTMDB = async (tmdbMovie: TMDBSearchResult) => {
    setTmdbQuery('');
    setTmdbResults([]);
    
    const genres: Record<number, string> = {
      28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
      80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
      14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
      9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
      10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
    };
    
    const genreNames = tmdbMovie.genre_ids.map((id) => genres[id]).filter(Boolean);
    
    const slug = tmdbMovie.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    setFormData({
      ...formData,
      title: tmdbMovie.title,
      slug: slug,
      poster: tmdbMovie.poster_path ? `${TMDB_IMAGE_BASE}/w500${tmdbMovie.poster_path}` : '',
      backdrop: tmdbMovie.backdrop_path ? `${TMDB_IMAGE_BASE}/w1280${tmdbMovie.backdrop_path}` : '',
      description: tmdbMovie.overview || '',
      year: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : new Date().getFullYear(),
      genre: genreNames.join(', '),
    });
    
    showToast('Movie details filled from TMDB', 'success');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@watchmirror.com', password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        fetchMovies(data.token);
        showToast('Login successful', 'success');
      } else {
        showToast(data.error || 'Login failed', 'error');
      }
    } catch (error) {
      showToast('Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setIsAuthenticated(false);
    setMovies([]);
    setPassword('');
    showToast('Logged out successfully', 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const movieData = {
      ...formData,
      audioLanguages: formData.audioLanguages.split(',').map((s) => s.trim()).filter(Boolean),
      quality: formData.quality.split(',').map((s) => s.trim()).filter(Boolean),
      genre: formData.genre.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      const url = editingMovie ? `/api/admin/movies` : '/api/admin/movies';
      const method = editingMovie ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingMovie ? { ...movieData, slug: editingMovie.slug } : movieData),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(editingMovie ? 'Movie updated successfully' : 'Movie added successfully', 'success');
        fetchMovies(token);
        resetForm();
        router.refresh();
      } else {
        showToast(data.error || 'Operation failed', 'error');
      }
    } catch (error) {
      showToast('Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this movie?')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/movies?slug=${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        showToast('Movie deleted successfully', 'success');
        fetchMovies(token);
        router.refresh();
      } else {
        showToast('Delete failed', 'error');
      }
    } catch (error) {
      showToast('Delete failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      slug: movie.slug,
      poster: movie.poster,
      backdrop: movie.backdrop,
      description: movie.description,
      mp4Url: (movie as any).mp4Url || '',
      audioLanguages: movie.audioLanguages.join(', '),
      quality: movie.quality.join(', '),
      genre: movie.genre.join(', '),
      year: movie.year,
      featured: movie.featured,
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      poster: '',
      backdrop: '',
      description: '',
      mp4Url: '',
      audioLanguages: '',
      quality: '',
      genre: '',
      year: new Date().getFullYear(),
      featured: false,
    });
    setEditingMovie(null);
    setShowAddForm(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">iBOMMA</h1>
            <p className="text-gray-400">Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="bg-[#1a1a1a] rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">Login</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full bg-[#0d0d0d] border border-white/10 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">iBOMMA Admin</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your movie library</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { resetForm(); setShowAddForm(true); }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
            >
              + Add Movie
            </button>
            <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors">
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/10">
            <p className="text-gray-400 text-xs mb-1">Total Movies</p>
            <p className="text-2xl font-bold text-white">{movies.length}</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/10">
            <p className="text-gray-400 text-xs mb-1">Featured</p>
            <p className="text-2xl font-bold text-yellow-500">{movies.filter((m) => m.featured).length}</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/10">
            <p className="text-gray-400 text-xs mb-1">Latest</p>
            <p className="text-sm font-bold text-white truncate">{movies.length > 0 ? movies[0]?.title : 'None'}</p>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                {editingMovie ? 'Edit Movie' : 'Add New Movie'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {!editingMovie && (
              <div className="mb-6 p-4 bg-[#0d0d0d] rounded-lg">
                <label className="block text-sm text-gray-400 mb-2">Search TMDB to Auto-Fill</label>
                <div className="relative">
                  <input
                    type="text"
                    value={tmdbQuery}
                    onChange={(e) => { setTmdbQuery(e.target.value); searchTMDB(e.target.value); }}
                    placeholder="Search for a movie..."
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                {tmdbSearching && <p className="text-sm text-gray-400 mt-2">Searching...</p>}
                {tmdbResults.length > 0 && (
                  <div className="mt-2 bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/10 max-h-48 overflow-y-auto">
                    {tmdbResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => fillFromTMDB(result)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-white/10 text-left transition-colors"
                      >
                        {result.poster_path && (
                          <img src={`${TMDB_IMAGE_BASE}/w92${result.poster_path}`} alt={result.title} className="w-8 h-12 object-cover rounded" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{result.title}</p>
                          <p className="text-gray-500 text-xs">{result.release_date ? new Date(result.release_date).getFullYear() : 'N/A'}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-[#0d0d0d] border border-white/10 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Slug *</label>
                  <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="w-full bg-[#0d0d0d] border border-white/10 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Poster URL *</label>
                  <input type="url" value={formData.poster} onChange={(e) => setFormData({ ...formData, poster: e.target.value })} className="w-full bg-[#0d0d0d] border border-white/10 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors" placeholder="https://..." required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Backdrop URL *</label>
                  <input type="url" value={formData.backdrop} onChange={(e) => setFormData({ ...formData, backdrop: e.target.value })} className="w-full bg-[#0d0d0d] border border-white/10 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors" placeholder="https://..." required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Description *</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-[#0d0d0d] border border-white/10 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors min-h-[80px]" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">MP4 URL *</label>
                  <input type="url" value={formData.mp4Url} onChange={(e) => setFormData({ ...formData, mp4Url: e.target.value })} className="w-full bg-[#0d0d0d] border border-white/10 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors" placeholder="https://.../movie.mp4" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Audio Languages *</label>
                  <input type="text" value={formData.audioLanguages} onChange={(e) => setFormData({ ...formData, audioLanguages: e.target.value })} className="w-full bg-[#0d0d0d] border border-white/10 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors" placeholder="Telugu, Hindi, English" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Quality *</label>
                  <input type="text" value={formData.quality} onChange={(e) => setFormData({ ...formData, quality: e.target.value })} className="w-full bg-[#0d0d0d] border border-white/10 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors" placeholder="1080p, 720p" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Genre *</label>
                  <input type="text" value={formData.genre} onChange={(e) => setFormData({ ...formData, genre: e.target.value })} className="w-full bg-[#0d0d0d] border border-white/10 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors" placeholder="Action, Drama" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Year *</label>
                  <input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} className="w-full bg-[#0d0d0d] border border-white/10 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors" min="1900" max="2030" required />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4 rounded border-gray-600 bg-[#0d0d0d] text-red-600 focus:ring-red-500" />
                    <span className="text-white text-sm">Featured</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-md font-medium text-sm transition-colors disabled:opacity-50">
                  {loading ? 'Saving...' : editingMovie ? 'Update' : 'Add Movie'}
                </button>
                <button type="button" onClick={resetForm} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-md font-medium text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/10">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Movie Library ({movies.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0d0d0d]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Movie</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Year</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase hidden md:table-cell">Languages</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">Featured</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {movies.map((movie) => (
                  <tr key={movie._id} className="hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={movie.poster} alt={movie.title} className="w-10 h-14 object-cover rounded" />
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate">{movie.title}</p>
                          <p className="text-gray-500 text-xs truncate">{movie.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-sm">{movie.year}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex gap-1">
                        {movie.audioLanguages.slice(0, 2).map((lang) => (
                          <span key={lang} className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded">{lang}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {movie.featured ? <span className="text-yellow-500">★</span> : <span className="text-gray-600">-</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(movie)} className="text-blue-400 hover:text-blue-300 text-sm mr-3">Edit</button>
                      <button onClick={() => handleDelete(movie.slug)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {movies.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-400">No movies yet. Add your first movie!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
