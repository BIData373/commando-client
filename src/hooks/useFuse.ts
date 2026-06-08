import Fuse, { type IFuseOptions } from "fuse.js"
import { useMemo } from "react"

export function useFuse<T>(
	items: T[],
	query: string,
	options: IFuseOptions<T>,
): T[] {
	const fuse = useMemo(() => new Fuse(items, options), [items, options])

	return useMemo(
		() => (!query.trim() ? items : fuse.search(query).map((r) => r.item)),
		[fuse, query, items],
	)
}
