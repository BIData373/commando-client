import { HttpStatusCode } from "axios"
import { AUTH_SERVER_URL, USE_MOCK_API, USE_SSO } from "./env-utils"
import { dispatchTokenChange, TOKEN_KEY } from "./user-utils"

export const BEARER_PREFIX = "Bearer "

export const AUTH_ENABLED = !USE_MOCK_API && USE_SSO

export const REFRESH_BUFFER_SECONDS = 70

export const SSO_PATH = "sso"

export function getStoredToken() {
	return localStorage.getItem(TOKEN_KEY)
}

function setStoredToken(token: string) {
	localStorage.setItem(TOKEN_KEY, token)
	dispatchTokenChange(token)
}

function removeStoredToken() {
	localStorage.removeItem(TOKEN_KEY)
	dispatchTokenChange(undefined)
}

export function getTokenExpiry(token: string): number | null {
	try {
		const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
		const payload = JSON.parse(atob(base64))
		return typeof payload.exp === "number" ? payload.exp : null
	} catch {
		return null
	}
}

const SSO_STATE_KEY = "sso_state"

function consumeSSOState(): boolean {
	const urlState = new URLSearchParams(window.location.search).get(
		SSO_STATE_KEY,
	)
	const storedState = sessionStorage.getItem(SSO_STATE_KEY)
	sessionStorage.removeItem(SSO_STATE_KEY)

	const sameState = !!urlState && !!storedState && urlState === storedState
	if (sameState) {
		const url = new URL(window.location.href)
		url.searchParams.delete(SSO_STATE_KEY)
		window.history.replaceState({}, "", url.href)
	}

	return sameState
}

const codesForReauthentication = [
	HttpStatusCode.BadRequest,
	HttpStatusCode.Unauthorized,
]

export async function authenticate() {
	const existingToken = getStoredToken()
	const response = await fetch(new URL("sso/token", AUTH_SERVER_URL).href, {
		method: "GET",
		...(existingToken && {
			headers: { Authorization: `${BEARER_PREFIX}${existingToken}` },
		}),
	})

	if (response.ok) {
		const data = (await response.json()) as { token: string }
		const newToken = data?.token

		if (!newToken) {
			throw new Error("SSO response missing token")
		}

		setStoredToken(newToken)

		consumeSSOState()

		return newToken
	}

	if (!codesForReauthentication.includes(response.status)) {
		throw new Error("SSO Internal error")
	}

	removeStoredToken()

	if (consumeSSOState()) {
		throw new Error("Authentication failed after redirect")
	}

	const state = crypto.randomUUID()
	sessionStorage.setItem(SSO_STATE_KEY, state)

	const comebackUrl = new URL(window.location.href)
	comebackUrl.searchParams.set(SSO_STATE_KEY, state)

	window.location.href = new URL(
		`${SSO_PATH}/auth/comeback?comeback=${encodeURIComponent(comebackUrl.href)}`,
		AUTH_SERVER_URL,
	).href

	return ""
}

export async function authenticateOrExisting() {
	const existing = getStoredToken()
	if (existing) {
		const expiry = getTokenExpiry(existing)
		if (
			!expiry ||
			expiry > Math.floor(Date.now() / 1000) + REFRESH_BUFFER_SECONDS
		) {
			return existing
		}
	}

	return await authenticate()
}
