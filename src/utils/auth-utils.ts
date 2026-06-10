import { AUTH_SERVER_URL } from "./env-utils"
import { COOKIE_NAME } from "./user-utils"

export const REFRESH_BUFFER_SECONDS = 70

export async function getStoredToken(): Promise<string | undefined> {
	return (await cookieStore.get(COOKIE_NAME))?.value
}

export async function storeToken(token: string): Promise<void> {
	await cookieStore.set({
		name: COOKIE_NAME,
		value: token,
		path: "/",
		sameSite: "lax",
	})
}

export async function clearToken(): Promise<void> {
	await cookieStore.delete(COOKIE_NAME)
}

export function redirectToAuth(): void {
	const comeback = encodeURIComponent(window.location.href)
	window.location.href = `${AUTH_SERVER_URL}/auth/comeback?comeback=${comeback}`
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

export async function refreshAccessToken(): Promise<string | null> {
	const response = await fetch(`${AUTH_SERVER_URL}/cookies`, {
		method: "POST",
		credentials: "include",
	})
	if (!response.ok) {
		return null
	}
	const data = (await response.json()) as { ssoUser: string }
	return data.ssoUser ?? null
}
