export enum QuickFilter {
	OVERDUE = "overdue",
	APPROACHING = "approaching",
	FLAGGED = "flagged",
	ROLLING = "rolling",
}

const getDashboardFilterKey = "dashboard-filter"

export const dashboardFilterDataTypeKey = `${getDashboardFilterKey}-type`
export const dashboardFilterRangeKey = `${getDashboardFilterKey}-range`
