import type { UserDto } from "src/api/model";

export function useCurrentUser(): UserDto {
	return {
		id: 1,
		upn: "s0000000@idf.il",
		info: null
	}
}
