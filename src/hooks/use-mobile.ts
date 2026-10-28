import { useMediaQuery } from "@mantine/hooks"

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

export const MOBILE_MEDIA_QUERY = `@media ${MOBILE_QUERY}`

export const IS_MOBILE_DEVICE = /Android|iPhone|iPad|iPod/i.test(
	navigator.userAgent,
)

export function useIsMobile() {
	return useMediaQuery(MOBILE_QUERY, false, {
		getInitialValueInEffect: false,
	})
}
