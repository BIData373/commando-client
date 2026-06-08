import { endOfDay, isWithinInterval, startOfDay } from "date-fns"
import { useMemo } from "react"
import type { TaskDto } from "src/api/model"
import { matchesQuickFilter } from "src/functions/filter-utils"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { getTaskDateByDateType } from "src/utils/date-utils"
import { useFuse } from "./useFuse"

export function useFilteredTasks<TTask extends TaskDto>(
	tasks: TTask[],
	additionalFilter?: (task: TTask) => boolean,
) {
	const { searchQuery, activeQuickFilters, dateRange, dateType } =
		useTasksFilters()

	const from = dateRange?.from
	const to = dateRange?.to

	const searchedTasks = useFuse(tasks, searchQuery, {
		threshold: 0.5,
		keys: ["title", "description", "notes"],
	})

	return useMemo(
		() =>
			searchedTasks
				.filter(
					(task) =>
						additionalFilter?.(task) ||
						(activeQuickFilters.size > 0
							? Array.from(activeQuickFilters).some((filter) =>
									matchesQuickFilter(task, filter),
								)
							: true),
				)
				.filter((task) => {
					if (!from || !to) {
						return true
					}

					const date = getTaskDateByDateType(task, dateType)

					return (
						date == null ||
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
