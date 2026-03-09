/** API Client Configuration
 *
 * Central HTTP client for all API calls.
 * Uses native fetch with a thin wrapper.
 *
 * To switch from mock to real backend:
 * 1. Set VITE_USE_MOCK_API=false in .env
 * 2. Set VITE_API_BASE_URL to your backend URL
 * 3. Add auth interceptor if needed (see addAuthHeader below)
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: unknown
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

function getAuthHeaders(): Record<string, string> {
  // Placeholder for future auth implementation
  // In closed network, you might use:
  // - JWT: { Authorization: `Bearer ${token}` }
  // - Session cookie: credentials: 'include' in fetch options
  const token = localStorage.getItem('authToken');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    throw new ApiError(response.status, response.statusText, data);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/** Core API client with typed methods */
export const apiClient = {
  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    const { params, ...fetchOptions } = options || {};
    const response = await fetch(buildUrl(path, params), {
      ...fetchOptions,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...fetchOptions.headers,
      },
    });
    return handleResponse<T>(response);
  },

  async post<T>(path: string, options?: RequestOptions): Promise<T> {
    const { body, params, ...fetchOptions } = options || {};
    const response = await fetch(buildUrl(path, params), {
      ...fetchOptions,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...fetchOptions.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async patch<T>(path: string, options?: RequestOptions): Promise<T> {
    const { body, params, ...fetchOptions } = options || {};
    const response = await fetch(buildUrl(path, params), {
      ...fetchOptions,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...fetchOptions.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    const { params, ...fetchOptions } = options || {};
    const response = await fetch(buildUrl(path, params), {
      ...fetchOptions,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...fetchOptions.headers,
      },
    });
    return handleResponse<T>(response);
  },
};

export { ApiError };
