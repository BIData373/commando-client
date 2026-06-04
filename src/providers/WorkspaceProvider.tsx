import styled from "@emotion/styled"
import { useParams } from "@tanstack/react-router"
import type { AxiosError } from "axios"
import { createContext, type PropsWithChildren, useContext, useEffect } from "react"
import type { UpdateWorkspaceDto, WorkspaceStatusDto } from "src/api/model"
import { useListWorkspaceStatuses } from "src/api/workspace-status/workspace-status"
import { queryClient } from "src/queryClient"
import type { WorkspaceDto } from "../api/model/workspace-dto"
import { useListWorkspaces } from "../api/workspace/workspace"
import { Spinner } from "../components/ui/spinner"
import { ErrorCode, isErrorCode } from "../utils/error-utils"
import { useErrorModal } from "./ErrorModalProvider"
import { useWorkspaceHeader } from "./TitleBarProvider"

export interface WorkspaceContext {
	workspace: WorkspaceDto
	statuses: Record<number, WorkspaceStatusDto>
	setWorkspace(data: UpdateWorkspaceDto): void
}

const WorkspaceContext = createContext<WorkspaceContext | null>(null)

export function WorkspaceProvider({ children }: PropsWithChildren) {
	const { urlName } = useParams({ from: "/workspace/$urlName" })
	const { setErrorCode } = useErrorModal()
	const {
		data,
		isLoading: isWorkspaceLoading,
		isError,
		error,
		queryKey,
	} = useListWorkspaces({ urlName })
	const workspace = data?.[0]
	const { data: workspaceStatuses, isLoading: isStatusesLoading } =
		useListWorkspaceStatuses(
			{ workspaceId: workspace?.id ?? -1 },
			{ query: { enabled: workspace?.id !== undefined } },
		)
	const statuses = Object.fromEntries(
		(workspaceStatuses ?? []).map((s) => [s.id, s]),
	)

	useWorkspaceHeader(workspace)

	useEffect(() => {
		if (isError) {
			const status = (error as AxiosError)?.response?.status
			const code = status && isErrorCode(status) ? status : ErrorCode.SERVER_ERROR
			setErrorCode(code)
		}
	}, [isError, error, setErrorCode])

	const setWorkspace = (data: UpdateWorkspaceDto) => {
		queryClient.setQueryData(
			queryKey,
			(prev) =>
				prev && [
					{
						...(prev[0] ?? {}),
						...data,
					},
				],
		)
	}

	return isWorkspaceLoading || isStatusesLoading ? (
		<LoadingContainer>
			<Spinner />
		</LoadingContainer>
	) : (
		workspace && (
			<WorkspaceContext.Provider
				value={{
					workspace,
					statuses,
					setWorkspace,
				}}
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
