export enum QuickFilter {
	OVERDUE = "overdue",
	APPROACHING = "approaching",
	FLAGGED = "flagged",
	ROLLING = "rolling",
}

export const ACTIVE_QUICK_FILTERS: QuickFilter[] = [
	QuickFilter.FLAGGED,
	QuickFilter.APPROACHING,
	QuickFilter.OVERDUE,
]

export const ARCHIVE_QUICK_FILTERS: QuickFilter[] = [
	QuickFilter.FLAGGED,
	QuickFilter.ROLLING,
]

const getDashboardFilterKey = "dashboard-filter"

export const dashboardFilterDataTypeKey = `${getDashboardFilterKey}-type`
export const dashboardFilterRangeKey = `${getDashboardFilterKey}-range`
