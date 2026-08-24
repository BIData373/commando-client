import type { AssigneeDto } from "src/api/model"
import { useFuse } from "./useFuse"

const FUSE_OPTIONS = {
	threshold: 0.3,
	keys: ["name", "users.upn", "users.info.name", "users.info.displayName"],
}

export function useFilteredAssignees<T extends AssigneeDto>(
	assignees: T[],
	searchQuery: string,
): T[] {
	return useFuse(assignees, searchQuery, FUSE_OPTIONS)
}
