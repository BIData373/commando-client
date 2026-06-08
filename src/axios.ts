import axios, { type AxiosError, type AxiosRequestConfig } from "axios"
import { parseISO } from "date-fns"

const STATIC_TOKEN_HEADER = "static-token"
const staticToken = import.meta.env.VITE_STATIC_TOKEN

export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL!,
	headers: {
		"Content-Type": "application/json",
		...(staticToken && {
			[STATIC_TOKEN_HEADER]: staticToken,
		}),
	},
})

axiosInstance.interceptors.response.use((originalResponse) => {
	handleDates(originalResponse.data)
	return originalResponse
})

// FIX Add cookie removing for sso
export async function sendRequest<T>(config: AxiosRequestConfig) {
	return (await axiosInstance<T>(config)).data
}

const isoDateFormat =
	/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/

function isIsoDateString(value: unknown): boolean {
	return typeof value === "string" && isoDateFormat.test(value)
}

function handleDates(body: unknown) {
	if (body === null || body === undefined || typeof body !== "object")
		return body
	for (const key of Object.keys(body)) {
		const value = (body as Record<string, unknown>)[key]
		if (isIsoDateString(value)) {
			;(body as Record<string, unknown>)[key] = parseISO(value as string)
		} else if (typeof value === "object") {
			handleDates(value)
		}
	}
}

export type ErrorType<Error> = AxiosError<Error>
