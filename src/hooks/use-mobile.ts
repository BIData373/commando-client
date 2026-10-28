import { type UseOSReturnValue, useMediaQuery, useOs } from "@mantine/hooks"

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
const MOBILE_OPERATING_SYSTEMS: UseOSReturnValue[] = ["android", "ios"]

export const MOBILE_MEDIA_QUERY = `@media ${MOBILE_QUERY}`

export const IS_MOBILE_DEVICE = /Android|iPhone|iPad|iPod/i.test(
	navigator.userAgent,
)

export function useIsMobileDevice() {
	const os = useOs({ getValueInEffect: false })

	return MOBILE_OPERATING_SYSTEMS.includes(os)
}

export function useIsMobile() {
	return useMediaQuery(MOBILE_QUERY, false, {
		getInitialValueInEffect: false,
	})
}
