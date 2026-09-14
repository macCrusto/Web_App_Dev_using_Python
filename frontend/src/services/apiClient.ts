import { CONFIG } from '@/src/config/env';

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function getAuthHeaders(isFormData = false): HeadersInit {
  const headers: Record<string, string> = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('access_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const url = `${CONFIG.API_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new ApiError(data.message || `Request failed with status ${response.status}`, response.status, data);
    }
    return data as T;
  },

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const url = `${CONFIG.API_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new ApiError(data.message || `Request failed with status ${response.status}`, response.status, data);
    }
    return data as T;
  },

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    const url = `${CONFIG.API_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new ApiError(data.message || `Request failed with status ${response.status}`, response.status, data);
    }
    return data as T;
  },

  async delete<T>(endpoint: string): Promise<T> {
    const url = `${CONFIG.API_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new ApiError(data.message || `Request failed with status ${response.status}`, response.status, data);
    }
    return data as T;
  },

  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${CONFIG.API_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(true),
      credentials: 'include',
      body: formData,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new ApiError(data.message || `Upload failed with status ${response.status}`, response.status, data);
    }
    return data as T;
  },
};
