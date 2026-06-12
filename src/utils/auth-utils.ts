import { HttpStatusCode } from "axios"
import { AUTH_SERVER_URL, USE_MOCK_API, USE_SSO } from "./env-utils"
import { COOKIE_NAME } from "./user-utils"

export const AUTH_ENABLED = !USE_MOCK_API && USE_SSO

export const REFRESH_BUFFER_SECONDS = 70

export const SSO_PATH = "sso"

export async function getStoredToken() {
	return (await cookieStore.get(COOKIE_NAME).catch(() => null))?.value
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
	const response = await fetch(new URL("sso/cookies", AUTH_SERVER_URL).href, {
		method: "GET",
		credentials: "include",
	})

	if (response.ok) {
		const data = (await response.json()) as { ssoUser: string }
		const newToken = data?.ssoUser

		await cookieStore.set({
			name: COOKIE_NAME,
			value: newToken,
			path: "/",
			sameSite: "lax",
		})

		consumeSSOState()

		return newToken
	}

	if (!codesForReauthentication.includes(response.status)) {
		throw new Error("SSO Internal error")
	}

	await cookieStore.delete(COOKIE_NAME)

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
	const existing = await getStoredToken()
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
