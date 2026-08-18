import { useEffect, useRef, useState } from "react"

interface UseOverflowOptions {
	content?: string
	includeDescendants?: boolean
}

export function useOverflow<TElement extends HTMLElement>({
	content,
	includeDescendants = false,
}: UseOverflowOptions = {}) {
	const ref = useRef<TElement>(null)
	const [isOverflowing, setIsOverflowing] = useState(false)

	useEffect(() => {
		const element = ref.current

		if (!element) {
			return
		}

		function updateOverflow(target: TElement) {
			const elements = includeDescendants
				? [target, ...target.querySelectorAll<HTMLElement>("*")]
				: [target]

			setIsOverflowing(
				elements.some((node) => node.scrollWidth > node.clientWidth),
			)
		}

		updateOverflow(element)

		const observer = new ResizeObserver(() => updateOverflow(element))
		observer.observe(element)

		return () => observer.disconnect()
	}, [content, includeDescendants])

	return { ref, isOverflowing }
}
