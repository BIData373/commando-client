import axios, { type AxiosRequestConfig } from "axios";
import { parseISO } from "date-fns";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL!,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use((originalResponse) => {
  handleDates(originalResponse.data);
  return originalResponse;
});

// FIX Add cookie removing for sso
export async function sendRequest<T>(config: AxiosRequestConfig) {
  return (await axiosInstance<T>(config)).data;
}

const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

function isIsoDateString(value: any): boolean {
  return value && typeof value === 'string' && isoDateFormat.test(value);
}

function handleDates(body: any) {
  if (body === null || body === undefined || typeof body !== 'object')
    return body;
  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isIsoDateString(value)) {
      body[key] = parseISO(value);
    } else if (typeof value === 'object') {
      handleDates(value);
    }
  }
}