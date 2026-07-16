import {
	type ColumnDef,
	type ColumnFiltersState,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table"

interface UseHeadlessTableOptions<TData> {
	data: TData[]
	columns: ColumnDef<TData>[]
	columnFilters?: ColumnFiltersState
	sorting?: SortingState
}

export function useHeadlessTable<TData>({
	data,
	columns,
	columnFilters,
	sorting,
}: UseHeadlessTableOptions<TData>) {
	return useReactTable({
		data,
		columns,
		state: {
			...(columnFilters !== undefined && { columnFilters }),
			...(sorting !== undefined && { sorting }),
		},
		getCoreRowModel: getCoreRowModel(),
		...(columnFilters !== undefined && {
			getFilteredRowModel: getFilteredRowModel(),
		}),
		...(sorting !== undefined && { getSortedRowModel: getSortedRowModel() }),
		autoResetPageIndex: false,
	})
}
