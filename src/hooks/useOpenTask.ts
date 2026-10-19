import { useNavigate } from "@tanstack/react-router"
import type { FileRoutesByTo, FileRouteTypes } from "../routeTree.gen"

type TaskPath = Extract<FileRouteTypes["fullPaths"], `${string}/$taskId`>

type EditableTaskPath = Extract<
	TaskPath,
	FileRouteTypes["to"] extends infer TTo
		? TTo extends `${infer TBase}/edit`
			? TBase
			: never
		: never
>

type TaskSearch<TPath extends TaskPath> = Partial<
	FileRoutesByTo[TPath]["types"]["fullSearchSchema"]
>

interface TaskActions<TPath extends TaskPath> {
	openTask: (taskId: number, search?: TaskSearch<TPath>) => void
}

interface EditableTaskActions<TPath extends TaskPath>
	extends TaskActions<TPath> {
	editTask: (taskId: number) => void
}

export function useOpenTask<TPath extends EditableTaskPath>(
	to: TPath,
): EditableTaskActions<TPath>
export function useOpenTask<TPath extends TaskPath>(
	to: TPath,
): TaskActions<TPath>
export function useOpenTask<TPath extends TaskPath>(
	to: TPath,
): EditableTaskActions<TPath> {
	const navigate = useNavigate()
	const path: TaskPath = to

	function openTask(taskId: number, search?: TaskSearch<TPath>) {
		navigate({
			to: path,
			params: (prev) => ({ ...prev, taskId: String(taskId) }),
			search: (prev) => ({ ...prev, ...search }),
		})
	}

	function editTask(taskId: number) {
		navigate({
			from: path,
			to: "./edit",
			params: (prev) => ({ ...prev, taskId: String(taskId) }),
			search: (prev) => prev,
		})
	}

	return { openTask, editTask }
}
