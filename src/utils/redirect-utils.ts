import type { MirageUserDto } from "src/api/model"
import {
	CHAT_CHANNEL_URL,
	CHAT_URL,
	PORTAL_CATALOG_URL,
	USER_GUIDE_URL,
} from "./env-utils"
import { normalizeUpn } from "./user-utils"

export function openUserGuide() {
	window.open(USER_GUIDE_URL, "_blank")
}

export function openSupportChat() {
	window.open(CHAT_CHANNEL_URL, "_blank")
}

export function openMoreOfUs() {
	window.open(PORTAL_CATALOG_URL, "_blank")
}

export function openUserChat(user: MirageUserDto) {
	const upn = normalizeUpn(user.upn)

	return window.open(`${CHAT_URL}/direct/${upn}`)
}
