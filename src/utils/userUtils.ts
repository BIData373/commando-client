import type { IUser } from "src/types";

export function concatName(user: IUser) {
	return `${user.name} ${user.id} ${user.email} / ${user.role}`;
}
