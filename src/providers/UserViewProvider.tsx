import styled from "@emotion/styled"
import { useQueryClient } from "@tanstack/react-query"
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useRef,
} from "react"
import type { TaskRowWithWorkspaceDto, UserViewDto } from "src/api/model"
import { DistributionTab } from "src/api/model/distribution-tab"
import { QuickFilter } from "src/api/model/quick-filter"
import {
	getGetUserViewQueryKey,
	upsertUserView,
	useGetUserView,
} from "src/api/user-view/user-view"

import { Spinner } from "src/components/ui/spinner"
import {
	DEFAULT_COLUMN_ORDER,
	TASK_COLUMN_ID,
} from "src/utils/task-table-utils"

export interface UserViewContext {
	view: UserViewDto
	updateView(nextView: UserViewDto): Promise<void>
}

const UserViewContext = createContext<UserViewContext | null>(null)

const PERSONAL_DEFAULT_COLUMN_ORDER = [
	TASK_COLUMN_ID.title,
	TASK_COLUMN_ID.status,
	TASK_COLUMN_ID.assignee,
	TASK_COLUMN_ID.deadlineType,
	TASK_COLUMN_ID.source,
	TASK_COLUMN_ID.tags,
	TASK_COLUMN_ID.workspace,
	TASK_COLUMN_ID.createdAt,
	TASK_COLUMN_ID.updatedAt,
]

const PERSONAL_DEFAULT_HIDDEN = [TASK_COLUMN_ID.tags, TASK_COLUMN_ID.updatedAt]

const WORKSPACE_DEFAULT_HIDDEN = [TASK_COLUMN_ID.updatedAt]

function getDefaultView(
	workspaceId: number | null,
	defaultColumnOrder?: (keyof TaskRowWithWorkspaceDto)[],
	defaultHiddenColumns?: Set<keyof TaskRowWithWorkspaceDto>,
): UserViewDto {
	return {
		table: {
			sorting: [],
			columnFilters: [],
			quickFilter: [],
			columnVisibility: {
				columnOrder: [
					...(defaultColumnOrder ??
						(workspaceId
							? DEFAULT_COLUMN_ORDER
							: PERSONAL_DEFAULT_COLUMN_ORDER)),
				],
				hiddenColumns: [
					...(defaultHiddenColumns ??
						(workspaceId ? WORKSPACE_DEFAULT_HIDDEN : PERSONAL_DEFAULT_HIDDEN)),
				],
			},
		},
		dashboard: {
			distributionTab: DistributionTab.load,
			focusedInstructionsTab: QuickFilter.flagged,
		},
	}
}

interface UserViewProviderProps extends PropsWithChildren {
	workspaceId?: number
	defaultColumnOrder?: (keyof TaskRowWithWorkspaceDto)[]
	defaultHiddenColumns?: Set<keyof TaskRowWithWorkspaceDto>
}

export function UserViewProvider({
	children,
	workspaceId,
	defaultColumnOrder,
	defaultHiddenColumns,
}: UserViewProviderProps) {
	const queryClient = useQueryClient()
	const defaultView = getDefaultView(
		workspaceId ?? null,
		defaultColumnOrder,
		defaultHiddenColumns,
	)

	const { data, isLoading } = useGetUserView(
		{ workspaceId },
		{
			query: {
				select: (data) => ({
					table: { ...defaultView.table, ...data.table },
					dashboard: { ...defaultView.dashboard, ...data.dashboard },
				}),
			},
		},
	)

	const view = data ?? defaultView

	const latestViewRef = useRef<UserViewDto | null>(null)

	const updateView = async (nextView: UserViewDto) => {
		const queryKey = getGetUserViewQueryKey({ workspaceId })

		latestViewRef.current = nextView

		await queryClient.cancelQueries({ queryKey })
		if (latestViewRef.current !== nextView) return

		queryClient.setQueryData(queryKey, nextView)

		await upsertUserView({
			workspaceId,
			view: nextView,
		})

		if (latestViewRef.current === nextView) {
			queryClient.invalidateQueries({ queryKey })
		}
	}

	return isLoading ? (
		<LoadingContainer>
			<Spinner />
		</LoadingContainer>
	) : (
		<UserViewContext.Provider
			value={{
				view,
				updateView,
			}}
		>
			{children}
		</UserViewContext.Provider>
	)
}

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
`

export function useUserView() {
	const context = useContext(UserViewContext)

	if (!context) {
		throw new Error("useUserView must be used inside UserViewProvider")
	}

	return context
}
