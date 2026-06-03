
const getDashboardFilterKey = (urlName: string) => `dashboard-filter-${urlName}`

export const getDashboardFilterDataTypeKey = (urlName: string) => `${getDashboardFilterKey(urlName)}-type`
export const getDashboardFilterRangeKey = (urlName: string) => `${getDashboardFilterKey(urlName)}-range`