import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type ReactNode,
	type SetStateAction,
	useContext,
	useLayoutEffect,
	useState,
} from "react"

type ElementPlacements = "titleBar" | "center" | "right"

type ElementPlacementsMap = Partial<Record<ElementPlacements, ReactNode>>

interface HeaderContextValue {
	elementPlacements: ElementPlacementsMap
	setElementPlacements: Dispatch<SetStateAction<ElementPlacementsMap>>
}

const HeaderContext = createContext<HeaderContextValue>({
	elementPlacements: {},
	setElementPlacements: () => {},
})

interface HeaderProviderProps extends PropsWithChildren {}

export function HeaderProvider({ children }: HeaderProviderProps) {
	const [elementPlacements, setElementPlacements] =
		useState<ElementPlacementsMap>({})

	return (
		<HeaderContext.Provider value={{ elementPlacements, setElementPlacements }}>
			{children}
		</HeaderContext.Provider>
	)
}

export function useHeader() {
	const context = useContext(HeaderContext)
	if (!context) {
		throw new Error("useTitleBarActions must be used inside a TitleBarProvider")
	}
	return context
}

export function useRenderInHeader(
	key: ElementPlacements,
	node: ReactNode,
	deps: unknown[] = [],
) {
	const { setElementPlacements } = useHeader()

	useLayoutEffect(() => {
		setElementPlacements((prev) => ({ ...prev, [key]: node }))

		return () => setElementPlacements(({ [key]: _, ...rest }) => rest)
	}, [setElementPlacements, ...deps])
}
