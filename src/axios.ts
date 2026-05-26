import axios, { type AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL!,
	headers: {
		"Content-Type": "application/json",
	},
});

// FIX Add cookie removing for sso
export async function sendRequest<T>(config: AxiosRequestConfig) {
	return (await axiosInstance<T>(config)).data;
}
