import {
	createContext,
	type ReactNode,
	useContext,
	useLayoutEffect,
	useState,
} from "react"
import type { WorkspaceDto } from "src/api/model"

interface TitleBarContextValue {
	actions: ReactNode | null
	setActions: (actions: ReactNode | null) => void
	workspace: WorkspaceDto | null
	setWorkspace: (workspace: WorkspaceDto | null) => void
}

const TitleBarContext = createContext<TitleBarContextValue>({
	actions: null,
	setActions: () => {},
	workspace: null,
	setWorkspace: () => {},
})

interface TitleBarProviderProps {
	children: ReactNode
}

export function TitleBarProvider({ children }: TitleBarProviderProps) {
	const [actions, setActions] = useState<ReactNode | null>(null)
	const [workspace, setWorkspace] = useState<WorkspaceDto | null>(null)

	return (
		<TitleBarContext.Provider
			value={{ actions, setActions, workspace, setWorkspace }}
		>
			{children}
		</TitleBarContext.Provider>
	)
}

export function useTitleBarActions() {
	const context = useContext(TitleBarContext)
	if (!context) {
		throw new Error("useTitleBarActions must be used inside a TitleBarProvider")
	}
	return context
}

export function useTitleBar(renderActions: () => ReactNode, deps: unknown[]) {
	const { setActions } = useTitleBarActions()

	useLayoutEffect(() => {
		setActions(renderActions())
		return () => setActions(null)
	}, [setActions, ...deps])
}

export function useWorkspaceHeader(workspace?: WorkspaceDto) {
	const { setWorkspace } = useTitleBarActions()

	useLayoutEffect(() => {
		if (workspace) {
			setWorkspace(workspace)
		}
		return () => setWorkspace(null)
	}, [workspace, setWorkspace])
}
