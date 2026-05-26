import styled from "@emotion/styled"
import { useParams } from "@tanstack/react-router"
import {
	createContext,
	type PropsWithChildren,
	type ReactNode,
	useContext,
} from "react"
import type { WorkspaceDto } from "../api/model/workspace-dto"
import { useListWorkspaces } from "../api/workspace/workspace"
import { Spinner } from "../components/ui/spinner"

export interface WorkspaceContext extends WorkspaceDto {
	workspaceId: number
}

const WorkspaceContext = createContext<WorkspaceContext | null>(null)

export function WorkspaceProvider({ children }: PropsWithChildren) {
	const { urlName } = useParams({ from: "/workspace/$urlName" })
	const { data, isLoading } = useListWorkspaces({ urlName })

	const workspace = data?.[0]

	if (isLoading) {
		return (
			<LoadingContainer>
				<Spinner />
			</LoadingContainer>
		)
	}

	return (
		workspace && (
			<WorkspaceContext.Provider
				value={{ ...workspace, workspaceId: workspace.id }}
			>
				{children}
			</WorkspaceContext.Provider>
		)
	)
}

export function useWorkspace() {
	const context = useContext(WorkspaceContext)
	if (!context) {
		throw new Error("useWorkspace must be used inside a WorkspaceProvider")
	}
	return context
}

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
`
