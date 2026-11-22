const MAX_VISIBLE_AVATARS = 4
const OVERFLOW_VISIBLE_AVATARS = 3

export function getVisibleAvatars<T>(items: T[]) {
	const showAll = items.length <= MAX_VISIBLE_AVATARS
	const visible = showAll ? items : items.slice(0, OVERFLOW_VISIBLE_AVATARS)
	const hiddenCount = items.length - visible.length

	return { visible, hiddenCount }
}
