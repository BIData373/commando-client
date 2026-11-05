import Cookies from "js-cookie"
import type { MirageUserDto, PermissionType, UserInfoDto } from "src/api/model"

export const TOKEN_NAME = "ssoUser"
const COOKIE_POLL_INTERVAL_MS = 1000

type SsoUser = Partial<UserInfoDto> & { upn: string }

export function decodeSsoUserJwt(jwtValue?: string): SsoUser | null {
	try {
		if (!jwtValue) {
			return null
		}

		const base64Url = jwtValue.split(".")[1]
		const base64 = base64Url?.replace(/-/g, "+").replace(/_/g, "/")
		if (!base64) {
			return null
		}

		const jsonPayload = new TextDecoder().decode(
			Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)),
		)

		const user = JSON.parse(jsonPayload)?.user

		return user?.upn ? user : null
	} catch {
		return null
	}
}

export function onCookieChange(
	name: string,
	callback: (value: string | undefined) => void,
): () => void {
	let lastValue = Cookies.get(name)

	// Cookies are modified by the server too, and Chrome 83 has no Cookie Store API
	const intervalId = setInterval(() => {
		const currentValue = Cookies.get(name)
		if (currentValue !== lastValue) {
			lastValue = currentValue
			callback(currentValue)
		}
	}, COOKIE_POLL_INTERVAL_MS)

	return () => clearInterval(intervalId)
}

export function concatName(user: MirageUserDto, type?: PermissionType): string {
	return `${user.info?.name} ${user.upn}${type ? ` / ${type}` : ""}`
}

export function normalizeUpn(upn: string): string {
	return upn.split("@")[0].toLowerCase()
}
