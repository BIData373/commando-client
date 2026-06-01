import { createContext, type PropsWithChildren } from "react"
import type { DateRange } from "react-day-picker"

export const RangeContext = createContext<DateRange | undefined>(undefined)
export const RangeSetterContext = createContext<
	((range: DateRange | undefined) => void) | null
>(null)

interface RangeContextProviderProps extends PropsWithChildren {
	onRangeChange: (range: DateRange | undefined) => void
}

export const RangeContextProvider = ({
	onRangeChange,
	children,
}: RangeContextProviderProps) => {
	return (
		<RangeSetterContext.Provider value={onRangeChange}>
			{children}
		</RangeSetterContext.Provider>
	)
}
