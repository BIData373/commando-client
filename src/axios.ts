import axios, { type AxiosError, type AxiosRequestConfig } from "axios"
import { parseISO } from "date-fns"
import {
	API_BASE_URL,
	IS_BI,
	REQUEST_USERNAME,
	STATIC_TOKEN,
	USE_SSO,
} from "./utils/env-utils"

export const STATIC_TOKEN_HEADER = "static-token"
export const REQUEST_USERNAME_HEADER = "requestusername"
export const IS_BI_HEADER = "is-bi"

export const requestUsernameKey = "request_username"
export const isBIKey = "is_bi"

const storedUsername = localStorage.getItem(requestUsernameKey)
const storedIsBI = localStorage.getItem(isBIKey)

const resolvedUsername = storedUsername ?? REQUEST_USERNAME
const resolvedIsBI = storedIsBI ?? !!IS_BI

export const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: USE_SSO,
	headers: {
		"Content-Type": "application/json",
		...(STATIC_TOKEN && { [STATIC_TOKEN_HEADER]: STATIC_TOKEN }),
		...(resolvedUsername && { [REQUEST_USERNAME_HEADER]: resolvedUsername }),
		...(resolvedIsBI && { [IS_BI_HEADER]: resolvedIsBI }),
	},
})

axiosInstance.interceptors.response.use((originalResponse) => {
	handleDates(originalResponse.data)
	return originalResponse
})

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
