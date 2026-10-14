import { QuickFilter } from "src/api/model"

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

export const ARCHIVE_QUICK_FILTERS: QuickFilter[] = [
	QuickFilter.flagged,
	QuickFilter.rolling,
]

const getDashboardFilterKey = "dashboard-filter"

export const dashboardFilterDataTypeKey = `${getDashboardFilterKey}-type`
export const dashboardFilterRangeKey = `${getDashboardFilterKey}-range`
export const dashboardFilterAssigneeKey = `${getDashboardFilterKey}-assignee`
