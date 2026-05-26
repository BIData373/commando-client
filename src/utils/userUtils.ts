import type { UserDto } from "src/api/model"

export function concatName(user: UserDto) {
	return `${user.info?.name ?? ""} ${user.upn} / ${user.info?.displayName ?? ""}`
}
