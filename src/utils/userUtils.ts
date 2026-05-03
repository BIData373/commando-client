import type { IUser } from "#/types";



export function concatName(user: IUser) {
  return `${user.name} ${user.id} ${user.email} / ${user.role}`
}