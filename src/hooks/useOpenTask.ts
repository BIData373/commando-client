import { useNavigate } from "@tanstack/react-router"
import type { FileRoutesByTo, FileRouteTypes } from "../routeTree.gen"

type TaskPath = Extract<FileRouteTypes["to"], `${string}/$taskId`>

type TaskSearch<TPath extends TaskPath> = Partial<
	FileRoutesByTo[TPath]["types"]["fullSearchSchema"]
>

export function useOpenTask<TPath extends TaskPath>(to: TPath) {
	const navigate = useNavigate()

	return function openTask(taskId: number, search?: TaskSearch<TPath>) {
		const path: TaskPath = to

		navigate({
			to: path,
			params: (prev) => ({ ...prev, taskId: String(taskId) }),
			search: (prev) => ({ ...prev, ...search }),
		})
	}
}
