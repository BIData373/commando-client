import {
	cellSpanningFeature,
	columnFacetingFeature,
	columnFilteringFeature,
	columnSizingFeature,
	columnVisibilityFeature,
	createFacetedRowModel,
	createFacetedUniqueValues,
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
	searchable?: boolean
}

export const appTableFeatures = tableFeatures({
	cellSpanningFeature,
	columnFacetingFeature,
	columnFilteringFeature,
	columnSizingFeature,
	columnVisibilityFeature,
	globalFilteringFeature,
	rowSelectionFeature,
	rowSortingFeature,
	filteredRowModel: createFilteredRowModel(),
	sortedRowModel: createSortedRowModel(),
	facetedRowModel: createFacetedRowModel(),
	facetedUniqueValues: createFacetedUniqueValues(),
	filterFns,
	sortFns,
	columnMeta: {} as AppColumnMeta,
})

export type AppTableFeatures = typeof appTableFeatures
