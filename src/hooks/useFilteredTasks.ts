import { endOfDay, isWithinInterval, startOfDay } from "date-fns"
import { some } from "lodash"
import { useMemo } from "react"
import type { TaskDto, WorkspaceWithPermissionDto } from "src/api/model"
import { matchesQuickFilter } from "src/functions/filter-utils"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { DATE_TYPE } from "src/utils/date-utils"
import { useFuse } from "./useFuse"

interface TaskWithOptionalWorkspaceDto extends TaskDto {
	workspace?: WorkspaceWithPermissionDto
}

function getTaskDate(
	task: TaskWithOptionalWorkspaceDto,
	type: DATE_TYPE,
): Date | null {
	switch (type) {
		case DATE_TYPE.CREATION_DATE:
			return task.createdAt
		case DATE_TYPE.EXPECTED_END:
			return task.dueDate ?? null
		case DATE_TYPE.ISSUE_DATE:
			return task.source?.date ?? null
		case DATE_TYPE.UPDATED_DATE:
			return task.updatedAt
		default:
			return null
	}
}

export function useFilteredTasks<T extends TaskDto>(
	tasks: T[],
	additionalFilter?: (task: T) => boolean,
): T[] {
	const { searchQuery, activeQuickFilters, dateRange, dateType } =
		useTasksFilters()

	const from = dateRange?.from
	const to = dateRange?.to

	const searchedTasks = useFuse(tasks, searchQuery, {
		threshold: 0.5,
		keys: ["title", "assigneeStatuses.description", "notes"],
	})

	return useMemo(
		() =>
			searchedTasks
				.filter((task) => {
					const matchers = [
						...(additionalFilter ? [additionalFilter(task)] : []),
						...(activeQuickFilters.size > 0
							? [
									some(Array.from(activeQuickFilters), (filter) =>
										matchesQuickFilter(task, filter),
									),
								]
							: []),
					]
					return matchers.length === 0 || some(matchers)
				})
				.filter((task) => {
					if (!from || !to) {
						return true
					}

					const date = getTaskDate(task, dateType)

					return (
						date &&
						isWithinInterval(date, {
							start: startOfDay(from),
							end: endOfDay(to),
						})
					)
				}),
		[
			activeQuickFilters,
			searchQuery,
			searchedTasks,
			additionalFilter,
			from,
			dateType,
			to,
		],
	)
}
