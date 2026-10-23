import {
	type ColumnDef,
	type ColumnFiltersState,
	type RowData,
	type SortingState,
	useTable,
} from "@tanstack/react-table"
import {
	type AppTableFeatures,
	appTableFeatures,
} from "../utils/table-features"

interface UseHeadlessTableOptions<TData extends RowData> {
	data: TData[]
	columns: ColumnDef<AppTableFeatures, TData>[]
	columnFilters?: ColumnFiltersState
	sorting?: SortingState
}

export function useHeadlessTable<TData extends RowData>({
	data,
	columns,
	columnFilters,
	sorting,
}: UseHeadlessTableOptions<TData>) {
	return useTable({
		features: appTableFeatures,
		data,
		columns,
		state: {
			...(columnFilters !== undefined && { columnFilters }),
			...(sorting !== undefined && { sorting }),
		},
	})
}
