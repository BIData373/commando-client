import type { MirageUserDto, PermissionType, UserInfoDto } from "src/api/model"

export const TOKEN_KEY = "ssoUser"

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

const TOKEN_CHANGE_EVENT = "token-change"

export function dispatchTokenChange(value: string | undefined): void {
	window.dispatchEvent(new CustomEvent(TOKEN_CHANGE_EVENT, { detail: value }))
}

export function onTokenChange(
	callback: (value: string | undefined) => void,
): () => void {
	const handler = (event: Event) => {
		callback((event as CustomEvent<string | undefined>).detail)
	}
	window.addEventListener(TOKEN_CHANGE_EVENT, handler)
	return () => window.removeEventListener(TOKEN_CHANGE_EVENT, handler)
}

export function concatName(user: MirageUserDto, type?: PermissionType): string {
	return `${user.info?.name} ${user.upn}${type ? ` / ${type}` : ""}`
}

export function normalizeUpn(upn: string): string {
	return upn.split("@")[0].toLowerCase()
}
