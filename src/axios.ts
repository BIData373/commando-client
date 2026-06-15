import axios, { type AxiosError, type AxiosRequestConfig } from "axios"
import createAuthRefreshInterceptor from "axios-auth-refresh"
import { parseISO } from "date-fns"
import { AUTH_ENABLED, authenticate } from "./utils/auth-utils"
import {
	API_BASE_URL,
	API_PREFIX,
	STATIC_TOKEN,
	USE_SSO,
} from "./utils/env-utils"

export const STATIC_TOKEN_HEADER = "static-token"
export const REQUEST_USERNAME_HEADER = "requestusername"
export const IS_BI_HEADER = "is-bi"

export const requestUsernameKey = "request_username"
export const isBIKey = "is_bi"

export const axiosInstance = axios.create({
	baseURL: new URL(API_PREFIX, API_BASE_URL).toString(),
	withCredentials: USE_SSO,
	headers: {
		"Content-Type": "application/json",
		...(STATIC_TOKEN && { [STATIC_TOKEN_HEADER]: STATIC_TOKEN }),
	},
})

if (STATIC_TOKEN) {
	axiosInstance.interceptors.request.use((config) => {
		if (config.headers[STATIC_TOKEN_HEADER] !== STATIC_TOKEN) {
			return config
		}

		const rawUsername = localStorage.getItem(requestUsernameKey)
		const username =
			rawUsername !== null ? (JSON.parse(rawUsername) as string | null) : null

		const rawIsBI = localStorage.getItem(isBIKey)
		const isBI = rawIsBI !== null ? rawIsBI === "true" : null

		if (username && username.length > 0) {
			config.headers[REQUEST_USERNAME_HEADER] = username
		} else {
			delete config.headers[REQUEST_USERNAME_HEADER]
		}

		if (isBI !== undefined && isBI !== null) {
			config.headers[IS_BI_HEADER] = String(isBI)
		} else {
			delete config.headers[IS_BI_HEADER]
		}

		return config
	})
}

axiosInstance.interceptors.response.use((originalResponse) => {
	handleDates(originalResponse.data)
	return originalResponse
})

if (USE_SSO) {
	createAuthRefreshInterceptor(
		axiosInstance,
		async (_failedRequest: AxiosError) => {
			if (AUTH_ENABLED) {
				await authenticate()
			}
		},
	)
}

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
