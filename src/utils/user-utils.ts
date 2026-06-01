import type { PermissionDtoType, UserDto } from "src/api/model"

export function concatName(user: UserDto, type?: PermissionDtoType) {
	return `${user.info?.name} ${user.id} ${user.upn}${type ? ` / ${type}` : ""}`
}
