import { type PointerEvent, useState } from "react"

interface UseOverflowOptions {
	includeDescendants?: boolean
}

/**
 * Measures overflow when the pointer enters instead of on mount, so cells
 * mounting during virtual scrolling don't each force a layout.
 */
export function useOverflow<TElement extends HTMLElement>({
	includeDescendants = false,
}: UseOverflowOptions = {}) {
	const [isOverflowing, setIsOverflowing] = useState(false)

	function handlePointerEnter(event: PointerEvent<TElement>) {
		const target = event.currentTarget
		const elements = includeDescendants
			? [target, ...target.querySelectorAll<HTMLElement>("*")]
			: [target]

		setIsOverflowing(
			elements.some((node) => node.scrollWidth > node.clientWidth),
		)
	}

	return { isOverflowing, handlePointerEnter }
}
