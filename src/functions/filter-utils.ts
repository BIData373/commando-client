import { differenceInDays, startOfToday } from "date-fns"
import { uniqBy } from "lodash"
import type { TaskDto } from "src/api/model"
import { DeadlineType } from "src/api/model"
import { QuickFilter } from "src/utils/filter-utils"
import type { TaskRow } from "src/utils/task-table-utils"
import { DEADLINE_LABELS } from "../components/shared/DeadlineTag"

// TODO Move to utils/filter-utils
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

export type FilterOptions =
	| "assigneeStatuses"
	| "status"
	| "deadlineType"
	| "source"
	| "tags"

export function buildFilterOptionsMap(
	tasks: TaskRow[],
): Record<FilterOptions, FilterOption[]> {
	const assigneeSet = new Set<string>()
	const deadlineTypeSet = new Set<string>()
	const sourceSet = new Set<string>()
	const tagsSet = new Set<string>()
	for (const t of tasks) {
		deadlineTypeSet.add(t.deadlineType)
		for (const { assignee } of t.assigneeStatuses) {
			assigneeSet.add(assignee.name)
		}
		if (t.source?.name) {
			sourceSet.add(t.source.name)
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
		[...set].map((v) => ({ value: v, label: labelMap?.[v] ?? v }))

	return {
		assigneeStatuses: toOptions(assigneeSet),
		status: uniqBy(tasks, "status.name")
			.map(({ status }) => status)
			.filter((status) => !!status)
			.map((s) => ({ value: s.type, label: s.name })),
		deadlineType: toOptions(deadlineTypeSet, DEADLINE_LABELS),
		source: toOptions(sourceSet),
		tags: toOptions(tagsSet),
	}
}
