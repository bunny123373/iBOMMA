export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new ApiError(response.status, error.error || 'Request failed');
  }

  return response.json();
}

export async function getMovies(params?: {
  q?: string;
  language?: string;
  genre?: string;
  slug?: string;
  featured?: boolean;
}) {
  const searchParams = new URLSearchParams();
  
  if (params?.q) searchParams.append('q', params.q);
  if (params?.language) searchParams.append('language', params.language);
  if (params?.genre) searchParams.append('genre', params.genre);
  if (params?.slug) searchParams.append('slug', params.slug);
  if (params?.featured !== undefined) searchParams.append('featured', String(params.featured));

  const queryString = searchParams.toString();
  const url = `/api/movies${queryString ? `?${queryString}` : ''}`;
  
  return fetchApi<{ movies: T[] }>(url);
}

export async function getMovie(slug: string) {
  return fetchApi<{ movie: T }>(`/api/movies/${slug}`);
}
