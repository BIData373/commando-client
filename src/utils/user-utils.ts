import type { PermissionType, UserDto } from "src/api/model"
import { CHAT_LINK } from "./env-utils"

export function concatName(user: UserDto, type?: PermissionType): string {
	return `${user.info?.name} ${user.id} ${user.upn}${type ? ` / ${type}` : ""}`
}

export function extractUpnFromUser({ upn }: UserDto): string {
	return upn.split("@").shift()!
}

export function formatDirectChatLink(upn: string): string {
	return `${CHAT_LINK}/direct/${upn}`
}
