'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Movie } from '@/lib/types';
import { showToast } from '@/components/Toaster';

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
    hls: '',
    audioLanguages: '',
    quality: '',
    genre: '',
    year: new Date().getFullYear(),
    featured: false,
  });

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
      const url = editingMovie
        ? `/api/admin/movies`
        : '/api/admin/movies';
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
      hls: movie.hls,
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
      hls: '',
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
      <div className="min-h-screen bg-mirror-darker flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              WATCH<span className="text-mirror-primary">MIRROR</span>
            </h1>
            <p className="text-gray-400">Admin Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="glass-effect rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Login</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="premium-input"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
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
    <div className="min-h-screen bg-mirror-darker pt-20 md:pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              WATCH<span className="text-mirror-primary">MIRROR</span> Admin
            </h1>
            <p className="text-gray-400 mt-2">Manage your movie library</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
              className="btn-primary"
            >
              Add Movie
            </button>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-effect rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">Total Movies</p>
            <p className="text-3xl font-bold text-white">{movies.length}</p>
          </div>
          <div className="glass-effect rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">Featured Movies</p>
            <p className="text-3xl font-bold text-white">
              {movies.filter((m) => m.featured).length}
            </p>
          </div>
          <div className="glass-effect rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">Latest Added</p>
            <p className="text-3xl font-bold text-white">
              {movies.length > 0 ? movies[0]?.title.substring(0, 20) + '...' : 'None'}
            </p>
          </div>
        </div>

        {showAddForm && (
          <div className="glass-effect rounded-2xl p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingMovie ? 'Edit Movie' : 'Add New Movie'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="premium-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="premium-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Poster URL *</label>
                  <input
                    type="url"
                    value={formData.poster}
                    onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                    className="premium-input"
                    placeholder="https://..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Backdrop URL *</label>
                  <input
                    type="url"
                    value={formData.backdrop}
                    onChange={(e) => setFormData({ ...formData, backdrop: e.target.value })}
                    className="premium-input"
                    placeholder="https://..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="premium-input min-h-[100px]"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">HLS URL *</label>
                  <input
                    type="url"
                    value={formData.hls}
                    onChange={(e) => setFormData({ ...formData, hls: e.target.value })}
                    className="premium-input"
                    placeholder="https://.../master.m3u8"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Audio Languages * (comma separated)</label>
                  <input
                    type="text"
                    value={formData.audioLanguages}
                    onChange={(e) => setFormData({ ...formData, audioLanguages: e.target.value })}
                    className="premium-input"
                    placeholder="Telugu, Hindi, English"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Quality * (comma separated)</label>
                  <input
                    type="text"
                    value={formData.quality}
                    onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                    className="premium-input"
                    placeholder="1080p, 720p, 480p"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Genre * (comma separated)</label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="premium-input"
                    placeholder="Action, Drama, Thriller"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Year *</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="premium-input"
                    min="1900"
                    max="2030"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-600 bg-mirror-gray text-mirror-primary focus:ring-mirror-primary"
                    />
                    <span className="text-white">Featured Movie</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Saving...' : editingMovie ? 'Update Movie' : 'Add Movie'}
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="glass-effect rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Movie Library</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-mirror-gray/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Movie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Languages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {movies.map((movie) => (
                  <tr key={movie._id} className="hover:bg-white/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-12 h-18 object-cover rounded"
                        />
                        <div className="ml-4">
                          <p className="text-white font-medium">{movie.title}</p>
                          <p className="text-gray-500 text-sm">{movie.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {movie.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {movie.audioLanguages.slice(0, 2).map((lang) => (
                          <span key={lang} className="badge badge-language text-xs">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {movie.featured ? (
                        <span className="text-yellow-500">★ Featured</span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleEdit(movie)}
                        className="text-blue-400 hover:text-blue-300 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(movie.slug)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {movies.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-400">No movies in library. Add your first movie!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
