import type { PermissionType, UserDto } from "src/api/model"

export function concatName(user: UserDto, type?: PermissionType) {
	return `${user.info?.name} ${user.id} ${user.upn}${type ? ` / ${type}` : ""}`
}
