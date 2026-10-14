export const NAME_MAX_LENGTH = 50
export const DATA_COUNTER_CLASS = "data-char-counter"

export function filterByTitle<T extends { title: string }>(
	items: T[],
	query: string,
) {
	const lower = query.toLowerCase()
	return items.filter((item) => item.title.toLowerCase().includes(lower))
}

export interface WorkspaceDetailsErrors {
	title?: string
	urlName?: string
	pikudId?: string
}
