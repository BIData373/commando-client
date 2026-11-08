import { differenceInDays, startOfToday } from "date-fns"
import {
	compact,
	keyBy,
	map,
	mapValues,
	sortBy,
	sumBy,
	uniq,
	uniqBy,
} from "lodash"
import type { TaskRowDto } from "src/api/model"
import { DeadlineType, QuickFilter, WorkspaceStatusType } from "src/api/model"
import { DEADLINE_LABELS } from "../components/shared/DeadlineTag"
import {
	EMPTY_FILTER_LABEL,
	getDeadlineFilterValue,
	isEmptyValue,
} from "../functions/empty-filter"
import {
	getAssigneeFilterValue,
	getSourceFilterValue,
	getTagFilterValues,
	hasUnviewedMessages,
	UNVIEWED_MESSAGES_VALUE,
} from "./task-table-utils"

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
	| "lastMessage"

const UNVIEWED_MESSAGES_LABEL = "טרם נצפו בלבד"

export const ACTIVE_QUICK_FILTERS: QuickFilter[] = [
	QuickFilter.overdue,
	QuickFilter.approaching,
	QuickFilter.flagged,
	QuickFilter.unread,
]

export const QUICK_FILTER_LABELS: Record<QuickFilter, string> = {
	[QuickFilter.overdue]: 'חריגה מתג"ב',
	[QuickFilter.approaching]: 'תג"ב מתקרב',
	[QuickFilter.flagged]: "במיקוד",
	[QuickFilter.rolling]: "שוטפות",
	[QuickFilter.unread]: "חדשות",
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
		case QuickFilter.unread:
			return !task.viewedInTable

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

export function countUnreadTasks(tasks: TaskRowDto[]): number {
	return tasks.filter((task) => matchesQuickFilter(task, QuickFilter.unread))
		.length
}

function toFilterOptions(
	values: string[],
	includeEmpty: boolean,
	labels?: Record<string, string>,
): FilterOption[] {
	return sortBy(
		uniq(values).filter((value) => includeEmpty || !isEmptyValue(value)),
		isEmptyValue,
	).map((value) => ({
		value,
		label: isEmptyValue(value)
			? EMPTY_FILTER_LABEL
			: (labels?.[value] ?? value),
	}))
}

export function buildFilterOptionsMap(
	tasks: TaskRowDto[],
	includeEmpty = false,
): Record<FilterOptions, FilterOption[]> {
	return {
		assignee: toFilterOptions(tasks.map(getAssigneeFilterValue), includeEmpty),
		status: uniqBy(compact(map(tasks, "status")), "type").map(
			({ type, name }) => ({ value: type, label: name }),
		),
		deadlineType: toFilterOptions(
			tasks.map(getDeadlineFilterValue),
			includeEmpty,
			DEADLINE_LABELS,
		),
		source: toFilterOptions(tasks.map(getSourceFilterValue), includeEmpty),
		tags: toFilterOptions(tasks.flatMap(getTagFilterValues), includeEmpty),
		lastMessage: tasks.some(hasUnviewedMessages)
			? [{ value: UNVIEWED_MESSAGES_VALUE, label: UNVIEWED_MESSAGES_LABEL }]
			: [],
	}
}
