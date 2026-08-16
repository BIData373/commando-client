import { differenceInDays, startOfToday } from "date-fns"
import { uniqBy } from "lodash"
import type { TaskRowDto } from "src/api/model"
import { DeadlineType, WorkspaceStatusType } from "src/api/model"
import { QuickFilter } from "src/api/model/quick-filter"
import { DEADLINE_LABELS } from "../components/shared/DeadlineTag"

// TODO Move to utils/filter-utils
// ─── Shared Types ────────────────────────────────────────────────────────────

export interface FilterOption {
	value: string
	label: string
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
): Record<FilterOptions, FilterOption[]> {
	const assigneeSet = new Set<string>()
	const deadlineTypeSet = new Set<string>()
	const sourceSet = new Set<string>()
	const tagsSet = new Set<string>()

	for (const t of tasks) {
		deadlineTypeSet.add(t.deadlineType)

		if (t.assignee) {
			assigneeSet.add(t.assignee.name)
		}

		for (const { assignee } of t.otherAssignees) {
			assigneeSet.add(assignee.name)
		}

		if (t.source) {
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
		assignee: toOptions(assigneeSet),
		status: uniqBy(tasks, "status.name")
			.map(({ status }) => status)
			.filter((status) => !!status)
			.map((s) => ({ value: s.type, label: s.name })),
		deadlineType: toOptions(deadlineTypeSet, DEADLINE_LABELS),
		source: toOptions(sourceSet),
		tags: toOptions(tagsSet),
	}
}
