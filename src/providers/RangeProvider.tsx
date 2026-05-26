import { createContext, type PropsWithChildren } from "react"
import type { DateRange } from "react-day-picker"

export const RangeContext = createContext<DateRange | undefined>(undefined)

interface RangeContextProviderProps extends PropsWithChildren {
	range: DateRange | undefined
}

export const RangeContextProvider = ({
	range,
	children,
}: RangeContextProviderProps) => {
	return <RangeContext.Provider value={range}>{children}</RangeContext.Provider>
}
