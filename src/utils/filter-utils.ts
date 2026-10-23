import { differenceInDays, startOfToday } from "date-fns"
import { compact, keyBy, map, mapValues, sumBy, uniq, uniqBy } from "lodash"
import type { TaskRowDto } from "src/api/model"
import { DeadlineType, QuickFilter, WorkspaceStatusType } from "src/api/model"
import { DEADLINE_LABELS } from "../components/shared/DeadlineTag"
import { formatSourceLabel } from "../functions/source-utils"
import { getTaskTagNames } from "./task-table-utils"

export interface FilterOption {
	value: string
	label: string
}

export type FilterOptions =
	| "assignee"
	| "status"
	| "deadlineType"
	| "source"
	| "tags"

export const ACTIVE_QUICK_FILTERS: QuickFilter[] = [
	QuickFilter.overdue,
	QuickFilter.approaching,
	QuickFilter.flagged,
]

export const QUICK_FILTER_LABELS: Record<QuickFilter, string> = {
	[QuickFilter.overdue]: 'חריגה מתג"ב',
	[QuickFilter.approaching]: 'תג"ב מתקרב',
	[QuickFilter.flagged]: "במיקוד",
	[QuickFilter.rolling]: "שוטפות",
}

export const QUICK_FILTER_TOOLTIPS: Partial<Record<QuickFilter, string>> = {
	[QuickFilter.approaching]: 'תג"ב בעוד 2 ימים או פחות',
}

export const ARCHIVE_QUICK_FILTERS: QuickFilter[] = [
	QuickFilter.rolling,
	QuickFilter.flagged,
]

const getDashboardFilterKey = "dashboard-filter"

export const dashboardFilterDataTypeKey = `${getDashboardFilterKey}-type`
export const dashboardFilterRangeKey = `${getDashboardFilterKey}-range`
export const dashboardFilterAssigneeKey = `${getDashboardFilterKey}-assignee`

export function matchesQuickFilter(
	task: TaskRowDto,
	filter: QuickFilter,
	today: Date = startOfToday(),
): boolean {
	const daysUntil = task.dueDate ? differenceInDays(task.dueDate, today) : null
	const isNotCompleted = task.status.type !== WorkspaceStatusType.COMPLETED
	const isNotImmediate = task.deadlineType !== DeadlineType.IMMEDIATE

	switch (filter) {
		case QuickFilter.overdue:
			return (
				daysUntil !== null && daysUntil < 0 && isNotImmediate && isNotCompleted
			)
		case QuickFilter.approaching:
			return (
				daysUntil !== null &&
				daysUntil >= 0 &&
				daysUntil <= 2 &&
				!(daysUntil < 0 && isNotImmediate) &&
				isNotCompleted
			)
		case QuickFilter.flagged:
			return !!task.flagged
		case QuickFilter.rolling:
			return task.deadlineType === DeadlineType.ROLLING

		default:
			return false
	}
}

export function countQuickFilters(
	tasks: TaskRowDto[],
): Record<QuickFilter, number> {
	const today = startOfToday()

	return mapValues(keyBy(Object.values(QuickFilter)), (filter) =>
		sumBy(tasks, (task) => Number(matchesQuickFilter(task, filter, today))),
	) as Record<QuickFilter, number>
}

function toFilterOptions(
	values: string[],
	labels?: Record<string, string>,
): FilterOption[] {
	return uniq(values).map((value) => ({
		value,
		label: labels?.[value] ?? value,
	}))
}

export function buildFilterOptionsMap(
	tasks: TaskRowDto[],
): Record<FilterOptions, FilterOption[]> {
	return {
		assignee: toFilterOptions(
			compact(tasks.map((task) => task.assignee?.name)),
		),
		status: uniqBy(compact(map(tasks, "status")), "type").map(
			({ type, name }) => ({ value: type, label: name }),
		),
		deadlineType: toFilterOptions(map(tasks, "deadlineType"), DEADLINE_LABELS),
		source: toFilterOptions(
			compact(
				tasks.map((task) => task.source && formatSourceLabel(task.source)),
			),
		),
		tags: toFilterOptions(tasks.flatMap(getTaskTagNames)),
	}
}
