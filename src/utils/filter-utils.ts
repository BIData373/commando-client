import { QuickFilter } from "src/api/model"

export const ACTIVE_QUICK_FILTERS: QuickFilter[] = [
	QuickFilter.flagged,
	QuickFilter.approaching,
	QuickFilter.overdue,
]

export const ARCHIVE_QUICK_FILTERS: QuickFilter[] = [
	QuickFilter.flagged,
	QuickFilter.rolling,
]

const getDashboardFilterKey = "dashboard-filter"

export const dashboardFilterDataTypeKey = `${getDashboardFilterKey}-type`
export const dashboardFilterRangeKey = `${getDashboardFilterKey}-range`
