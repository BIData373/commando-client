import {
	cellSpanningFeature,
	columnFilteringFeature,
	columnSizingFeature,
	columnVisibilityFeature,
	createFilteredRowModel,
	createSortedRowModel,
	filterFns,
	globalFilteringFeature,
	rowSelectionFeature,
	rowSortingFeature,
	sortFns,
	tableFeatures,
} from "@tanstack/react-table"

export interface AppColumnMeta {
	grow?: boolean
}

export const appTableFeatures = tableFeatures({
	cellSpanningFeature,
	columnFilteringFeature,
	columnSizingFeature,
	columnVisibilityFeature,
	globalFilteringFeature,
	rowSelectionFeature,
	rowSortingFeature,
	filteredRowModel: createFilteredRowModel(),
	sortedRowModel: createSortedRowModel(),
	filterFns,
	sortFns,
	columnMeta: {} as AppColumnMeta,
})

export type AppTableFeatures = typeof appTableFeatures
