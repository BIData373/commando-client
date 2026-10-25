import type { RowData, SortFn } from "@tanstack/react-table"
import { get } from "lodash"
import type { AppTableFeatures } from "../consts/table-features"
import type { StringPath } from "../types/path-types"

const COLLATION_LOCALE = "he"

export function localeSortBy<TData extends RowData>(
	path: StringPath<TData>,
): SortFn<AppTableFeatures, TData> {
	return (rowA, rowB) => {
		const a = String(get(rowA.original, path) ?? "")
		const b = String(get(rowB.original, path) ?? "")

		return a.localeCompare(b, COLLATION_LOCALE)
	}
}
