import { differenceInDays, startOfToday } from "date-fns"
import { DeadlineType, type TaskDto } from "src/api/model"
import { QuickFilter } from "src/utils/filter-utils"
import { DEADLINE_LABELS } from "../components/shared/DeadlineTag"

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
