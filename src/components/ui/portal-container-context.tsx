// TODO: chrome-83 - remove when min browser version is raised
import { createContext, useContext } from "react"

export const PortalContainerContext = createContext<HTMLElement | null | undefined>(
	undefined,
)

export function usePortalContainer() {
	return useContext(PortalContainerContext)
}
