import { createContext, type PropsWithChildren } from "react"
import type { DateRange } from "react-day-picker"

export const RangeContext = createContext<DateRange | undefined>(undefined)
export const RangeSetterContext = createContext<((range: DateRange | undefined) => void) | null>(null)

interface RangeContextProviderProps extends PropsWithChildren {
    range: DateRange | undefined
    onRangeChange: (range: DateRange | undefined) => void
}

export const RangeContextProvider = ({
    range,
    onRangeChange,
    children
}: RangeContextProviderProps) => {
    return (
        <RangeContext.Provider value={range}>
            <RangeSetterContext.Provider value={onRangeChange}>
                {children}
            </RangeSetterContext.Provider>
        </RangeContext.Provider>
    )
}
