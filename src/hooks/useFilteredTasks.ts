import { endOfDay, isWithinInterval, startOfDay } from "date-fns"
import { some } from "lodash"
import { useMemo } from "react"
import type { TaskRowDto } from "src/api/model"
import { formatDateShort } from "src/functions/date-utils"
import { matchesQuickFilter } from "src/functions/filter-utils"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { DATE_TYPE } from "src/utils/date-utils"
import { useFuse } from "./useFuse"

const FUSE_OPTIONS = {
	threshold: 0.3,
	ignoreLocation: true,
	minMatchCharLength: 1,
	keys: ["searchText"],
}

function getTaskDate<T extends TaskRowDto>(
	task: T,
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

function buildTaskSearchText<T extends TaskRowDto>(
	task: T,
	additionalSearchValues?: (
		task: T,
	) => Array<string | number | null | undefined>,
): string {
	const values = [
		String(task.id),
		task.title,
		task.description,
		task.source?.name,
		task.source?.date ? formatDateShort(task.source.date) : undefined,
		...task.tags.map((tag) => tag.name),
		...(task.source?.tags ?? []).map((tag) => tag.name),
		...(additionalSearchValues?.(task) ?? []),
	]

	return values
		.filter((value) => value !== undefined && value !== null && value !== "")
		.map(String)
		.join(" ")
}

interface UseFilteredTasksOptions<T> {
	additionalFilter?: (task: T) => boolean
	skipQuickFilters?: boolean
	additionalSearchValues?: (
		task: T,
	) => Array<string | number | null | undefined>
}

export function useFilteredTasks<T extends TaskRowDto>(
	tasks: T[],
	options: UseFilteredTasksOptions<T> = {},
): T[] {
	const {
		additionalFilter,
		additionalSearchValues,
		skipQuickFilters = false,
	} = options
	const { searchQuery, activeQuickFilters, dateRange, dateType } =
		useTasksFilters()

	const from = dateRange?.from
	const to = dateRange?.to

	const searchableTasks = useMemo(
		() =>
			tasks.map((task) => ({
				task,
				searchText: buildTaskSearchText(task, additionalSearchValues),
			})),
		[tasks, additionalSearchValues],
	)

	const searchResults = useFuse(searchableTasks, searchQuery, FUSE_OPTIONS)

	const searchedTasks = useMemo(
		() => searchResults.map(({ task }) => task),
		[searchResults],
	)

	return useMemo(
		() =>
			searchedTasks
				.filter((task) => {
					const matchers = [
						...(additionalFilter ? [additionalFilter(task)] : []),
						...(!skipQuickFilters && activeQuickFilters.size > 0
							? [
									Array.from(activeQuickFilters).some((filter) =>
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
			skipQuickFilters,
			searchQuery,
			searchedTasks,
			additionalFilter,
			from,
			dateType,
			to,
		],
	)
}
