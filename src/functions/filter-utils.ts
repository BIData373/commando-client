import { differenceInDays, startOfToday } from "date-fns"
import { uniqBy } from "lodash"
import type { TaskRowDto } from "src/api/model"
import { DeadlineType, WorkspaceStatusType } from "src/api/model"
import { QuickFilter } from "src/api/model/quick-filter"
import { DEADLINE_LABELS } from "../components/shared/DeadlineTag"
import { formatSourceLabel } from "./source-utils"

// TODO Move to utils/filter-utils
// ─── Shared Types ────────────────────────────────────────────────────────────

export interface FilterOption {
	value: string
	label: string
}

export const EMPTY_FILTER_VALUE = "__EMPTY__"

const EMPTY_FILTER_LABEL = "(ריקים)"

export function getDeadlineFilterValue(
	task: Pick<Partial<TaskRowDto>, "deadlineType" | "dueDate">,
): string {
	return !task.deadlineType ||
		(task.deadlineType === DeadlineType.DATE && !task.dueDate)
		? EMPTY_FILTER_VALUE
		: task.deadlineType
}

// ─── Quick Filters ───────────────────────────────────────────────────────────

export function matchesQuickFilter(
	task: TaskRowDto,
	filter: QuickFilter,
): boolean {
	const today = startOfToday()
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

export type FilterOptions =
	| "assignee"
	| "status"
	| "deadlineType"
	| "source"
	| "tags"

export function buildFilterOptionsMap(
	tasks: TaskRowDto[],
	includeEmpty = false,
): Record<FilterOptions, FilterOption[]> {
	const assigneeSet = new Set<string>()
	const deadlineTypeSet = new Set<string>()
	const sourceSet = new Set<string>()
	const tagsSet = new Set<string>()

	for (const t of tasks) {
		deadlineTypeSet.add(getDeadlineFilterValue(t))
		assigneeSet.add(t.assignee?.name || EMPTY_FILTER_VALUE)
		sourceSet.add(t.source ? formatSourceLabel(t.source) : EMPTY_FILTER_VALUE)

		if (!t.tags.length && !t.source?.tags?.length) {
			tagsSet.add(EMPTY_FILTER_VALUE)
		}

		t.tags.forEach((tag) => {
			tagsSet.add(tag.name)
		})

		t.source?.tags?.forEach((tag) => {
			tagsSet.add(tag.name)
		})
	}

	const toOptions = (
		set: Set<string>,
		labelMap?: Record<string, string>,
	): FilterOption[] =>
		[...set]
			.filter((v) => includeEmpty || v !== EMPTY_FILTER_VALUE)
			.sort(
				(a, b) =>
					Number(a === EMPTY_FILTER_VALUE) - Number(b === EMPTY_FILTER_VALUE),
			)
			.map((v) => ({
				value: v,
				label:
					v === EMPTY_FILTER_VALUE ? EMPTY_FILTER_LABEL : (labelMap?.[v] ?? v),
			}))

	return {
		assignee: toOptions(assigneeSet),
		status: uniqBy(
			tasks.map(({ status }) => status).filter((status) => !!status),
			"type",
		).map((s) => ({ value: s.type, label: s.name })),
		deadlineType: toOptions(deadlineTypeSet, DEADLINE_LABELS),
		source: toOptions(sourceSet),
		tags: toOptions(tagsSet),
	}
}
