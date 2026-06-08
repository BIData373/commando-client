import type { ColumnFiltersState } from "@tanstack/react-table"
import { differenceInDays, isWithinInterval, startOfToday } from "date-fns"
import type { DateRange } from "react-day-picker"
import { DeadlineType, type TaskDto } from "src/api/model"
import { type DATE_TYPE, getTaskDateByDateType } from "src/utils/date-utils"
import { QuickFilter } from "src/utils/filter-utils"
import { DEADLINE_LABELS } from "../components/shared/DeadlineTag"
import type { TaskRow } from "../providers/TasksFiltersProvider"

// ─── All Filters ─────────────────────────────────────────────────────────────

export function applyAllFilters<T extends TaskRow>(
	tasks: T[],
	quickFilters: Set<QuickFilter>,
	topicFilters: Set<string>,
	searchQuery: string,
): T[] {
	let result = tasks

	if (quickFilters.size > 0) {
		result = result.filter((task) =>
			Array.from(quickFilters).some((f) => matchesQuickFilter(task, f)),
		)
	}

	if (topicFilters.size > 0) {
		result = result.filter((task) =>
			task.tags.some((tag) => topicFilters.has(tag.name)),
		)
	}

	if (searchQuery.trim()) {
		const q = searchQuery.toLowerCase()
		result = result.filter((task) => task.title?.toLowerCase().includes(q))
	}

	return result
}
// ─── Shared Types ────────────────────────────────────────────────────────────

export interface FilterOption {
	value: string
	label: string
}

// ─── Quick Filters ───────────────────────────────────────────────────────────

export function matchesQuickFilter(
	task: TaskDto,
	filter: QuickFilter,
): boolean {
	const today = startOfToday()
	const daysUntil = task.dueDate ? differenceInDays(task.dueDate, today) : null
	switch (filter) {
		case QuickFilter.OVERDUE:
			return (
				daysUntil !== null &&
				daysUntil < 0 &&
				task.deadlineType !== DeadlineType.IMMEDIATE
			)
		case QuickFilter.APPROACHING:
			return (
				daysUntil !== null &&
				daysUntil >= 0 &&
				daysUntil <= 2 &&
				!(daysUntil < 0 && task.deadlineType !== DeadlineType.IMMEDIATE)
			)
		case QuickFilter.FLAGGED:
			return !!task.flagged

		default:
			return false
	}
}

export function buildFilterOptionsMap(
	tasks: TaskDto[],
): Record<string, FilterOption[]> {
	const assigneeSet = new Set<string>()
	const deadlineTypeSet = new Set<string>()
	const discussionNameSet = new Set<string>()
	const tagsSet = new Set<string>()

	for (const t of tasks) {
		deadlineTypeSet.add(t.deadlineType)
		for (const { assignee } of t.assigneeStatuses) {
			assigneeSet.add(assignee.name)
		}
		if (t.source?.name) {
			discussionNameSet.add(t.source.name)
		}
		t.tags.forEach((tag) => {
			tagsSet.add(tag.name)
		})
	}

	const toOptions = (
		set: Set<string>,
		labelMap?: Record<string, string>,
	): FilterOption[] =>
		[...set].map((v) => ({ value: v, label: labelMap?.[v] ?? v }))

	return {
		assigneeStatuses: toOptions(assigneeSet),
		deadlineType: toOptions(deadlineTypeSet, DEADLINE_LABELS),
		discussionName: toOptions(discussionNameSet),
		tags: toOptions(tagsSet),
	}
}

// ─── Column Filters ──────────────────────────────────────────────────────────

export function applyColumnFilters<T extends TaskRow>(
	tasks: T[],
	columnFilters: ColumnFiltersState,
): T[] {
	if (!columnFilters.length) return tasks
	return tasks.filter((task) =>
		columnFilters.every(({ id, value }) => {
			const filterValues = value as string[]
			if (!filterValues?.length) return true
			switch (id) {
				case "status":
					return (
						task.status?.type != null && filterValues.includes(task.status.type)
					)
				case "assigneeStatuses":
					return (
						task.assignee?.name != null &&
						filterValues.includes(task.assignee.name)
					)
				case "deadlineType":
					return filterValues.includes(task.deadlineType)
				case "discussionName":
					return (
						task.source?.name != null && filterValues.includes(task.source.name)
					)
				case "tags":
					return task.tags.some((tag) => filterValues.includes(tag.name))
				default:
					return true
			}
		}),
	)
}

// ─── Date Filter ─────────────────────────────────────────────────────────────

export function applyDateFilter<T extends TaskRow>(
	tasks: T[],
	dateType: DATE_TYPE,
	dateRange: DateRange | undefined,
): T[] {
	const from = dateRange?.from
	const to = dateRange?.to
	if (!from || !to) return tasks
	return tasks.filter((task) => {
		const date = getTaskDateByDateType(task, dateType)
		return date !== null && isWithinInterval(date, { start: from, end: to })
	})
}
