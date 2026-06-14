import type { MirageUserDto, PermissionType, UserInfoDto } from "src/api/model"
import { CHAT_URL } from "./env-utils"

export const COOKIE_NAME = "ssoUser"

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
	const handler = (event: CookieChangeEvent) => {
		const newValue = event.changed?.find((c) => c.name === name)?.value
		const wasDeleted = event.deleted?.some((c) => c.name === name)
		if (newValue !== undefined || wasDeleted) {
			callback(newValue)
		}
	}
	cookieStore.addEventListener("change", handler)
	return () => cookieStore.removeEventListener("change", handler)
}

export function concatName(user: MirageUserDto, type?: PermissionType): string {
	return `${user.info?.name} ${user.upn}${type ? ` / ${type}` : ""}`
}

export function extractUpnFromUser(upn: string): string {
	return upn.split("@")[0]
}

export function formatDirectChatLink(upn: string): string {
	return `${CHAT_URL}/direct/${upn}`
}

export function navigateToUserChat(user: MirageUserDto) {
	const upn = extractUpnFromUser(user.upn)
	const url = formatDirectChatLink(upn)
	return window.open(url)
}
