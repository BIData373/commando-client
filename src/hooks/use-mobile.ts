import { type UseOSReturnValue, useMediaQuery, useOs } from "@mantine/hooks"

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
const MOBILE_OPERATING_SYSTEMS: UseOSReturnValue[] = ["android", "ios"]

export const MOBILE_MEDIA_QUERY = `@media ${MOBILE_QUERY}`

export function useIsMobile() {
	const isSmallScreen = useMediaQuery(MOBILE_QUERY, false, {
		getInitialValueInEffect: false,
	})
	const os = useOs({ getValueInEffect: false })

	return isSmallScreen || MOBILE_OPERATING_SYSTEMS.includes(os)
}
