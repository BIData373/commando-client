import axios, { type AxiosRequestConfig } from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL!,
  headers: {
    'Content-Type': 'application/json',
  },
});

// FIX Add cookie removing for sso
export async function apiRequest<T>(config: AxiosRequestConfig) {
  const { data } = await axiosInstance<T>(config);

  return data;
}
