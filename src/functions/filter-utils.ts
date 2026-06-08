import { differenceInDays, isWithinInterval, startOfToday } from "date-fns"
import type { DateRange } from "react-day-picker"
import { DeadlineType, type TaskDto } from "src/api/model"
import { type DATE_TYPE, getTaskDateByDateType } from "src/utils/date-utils"
import { QuickFilter } from "src/utils/filter-utils"
import { DEADLINE_LABELS } from "../components/shared/DeadlineTag"
import type { TaskRow } from "../providers/TasksFiltersProvider"
// ─── Shared Types ────────────────────────────────────────────────────────────

export interface FilterOption {
	value: string
	label: string
}

// ─── Quick Filters ───────────────────────────────────────────────────────────

function matchesQuickFilter(task: TaskDto, filter: QuickFilter): boolean {
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

// ─── Combined ────────────────────────────────────────────────────────────────

function applyAllFilters<T extends TaskRow>(
	tasks: T[],
	activeQuickFilters: Set<QuickFilter>,
	activeTopicFilters: Set<string>,
	searchQuery: string,
): T[] {
	const hasQuickFilters = activeQuickFilters.size > 0
	const hasTopicFilters = activeTopicFilters.size > 0

	let result = tasks

	if (hasQuickFilters || hasTopicFilters) {
		result = result.filter((t) => {
			const matchesQuick =
				hasQuickFilters &&
				Array.from(activeQuickFilters).some((f) => matchesQuickFilter(t, f))
			const matchesTopic =
				hasTopicFilters &&
				t.tags.some((tag) => activeTopicFilters.has(tag.name))
			return matchesQuick || matchesTopic
		})
	}

	if (searchQuery) {
		result = result.filter(
			(t) =>
				t.title.includes(searchQuery) ||
				t.description?.includes(searchQuery) ||
				JSON.stringify(t.notes).includes(searchQuery),
		)
	}

	return result
}

function buildFilterOptionsMap(
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

// ─── Date Filter ─────────────────────────────────────────────────────────────

function applyDateFilter<T extends TaskRow>(
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

export {
	applyAllFilters,
	applyDateFilter,
	buildFilterOptionsMap,
	matchesQuickFilter,
}
