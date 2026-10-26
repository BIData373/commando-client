import { endOfDay, isWithinInterval, startOfDay, startOfToday } from "date-fns"
import { useDeferredValue, useMemo } from "react"
import type { TaskRowDto } from "src/api/model"
import { formatDateShort } from "src/functions/date-utils"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { DATE_TYPE } from "src/utils/date-utils"
import { matchesQuickFilter } from "src/utils/filter-utils"

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

export function removePunctuation(str: string) {
	return str.replace(/[^\p{L}\p{N}\s]/gu, "")
}

function buildTaskSearchText<T extends TaskRowDto>(
	task: T,
	additionalSearchValues?: (
		task: T,
	) => Array<string | number | null | undefined>,
): string {
	const values = [
		String(task.serialId),
		removePunctuation(task.title),
		task.description,
		task.source?.name,
		task.source?.date ? formatDateShort(task.source.date) : undefined,
		...task.tags.map((tag) => tag.name),
		...(task.source?.tags ?? []).map((tag) => tag.name),
		task.notes,
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

	const deferredSearchQuery = useDeferredValue(
		removePunctuation(searchQuery).trim(),
	)

	const searchResults = useMemo(
		() =>
			searchableTasks.filter((task) =>
				task.searchText.includes(deferredSearchQuery),
			),
		[searchableTasks, searchQuery, deferredSearchQuery],
	)

	const searchedTasks = useMemo(
		() => searchResults.map(({ task }) => task),
		[searchResults],
	)

	return useMemo(() => {
		const today = startOfToday()
		const quickFilters = skipQuickFilters ? [] : [...activeQuickFilters]
		const interval =
			from && to ? { start: startOfDay(from), end: endOfDay(to) } : null

		function matchesQuickFilters(task: T) {
			return quickFilters.some((filter) =>
				matchesQuickFilter(task, filter, today),
			)
		}

		function matchesAnyFilter(task: T) {
			if (!additionalFilter && quickFilters.length === 0) {
				return true
			}

			return !!additionalFilter?.(task) || matchesQuickFilters(task)
		}

		function matchesDateRange(task: T) {
			if (!interval) {
				return true
			}

			const date = getTaskDate(task, dateType)

			return date && isWithinInterval(date, interval)
		}

		return searchedTasks.filter(
			(task) => matchesAnyFilter(task) && matchesDateRange(task),
		)
	}, [
		activeQuickFilters,
		skipQuickFilters,
		searchedTasks,
		additionalFilter,
		from,
		dateType,
		to,
	])
}
