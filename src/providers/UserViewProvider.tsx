import styled from "@emotion/styled"
import { useQueryClient } from "@tanstack/react-query"
import { createContext, type PropsWithChildren, useContext } from "react"
import type { TaskRowWithWorkspaceDto, UserViewDto } from "src/api/model"
import { DistributionTab } from "src/api/model/distribution-tab"
import { QuickFilter } from "src/api/model/quick-filter"
import {
	getGetUserViewQueryKey,
	useGetUserView,
	useUpsertUserView as useMutateUserView,
} from "src/api/user-view/user-view"
import { Spinner } from "src/components/ui/spinner"

export interface UserViewContext {
	view: UserViewDto
	updateView(nextView: UserViewDto): void
	defaultColumnOrder: (keyof TaskRowWithWorkspaceDto)[]
	workspaceId?: number
}

const UserViewContext = createContext<UserViewContext | null>(null)

interface UserViewProviderProps extends PropsWithChildren {
	workspaceId?: number
	defaultColumnOrder: (keyof TaskRowWithWorkspaceDto)[]
	defaultHiddenColumns: Set<keyof TaskRowWithWorkspaceDto>
}

export function UserViewProvider({
	children,
	workspaceId,
	defaultColumnOrder,
	defaultHiddenColumns,
}: UserViewProviderProps) {
	const queryClient = useQueryClient()
	const userViewQueryKey = getGetUserViewQueryKey({ workspaceId })
	const defaultView = {
		table: {
			sorting: [],
			columnFilters: [],
			quickFilter: [],
			columnVisibility: {
				columnOrder: [...defaultColumnOrder],
				hiddenColumns: [...defaultHiddenColumns],
			},
		},
		dashboard: {
			distributionTab: DistributionTab.load,
			focusedInstructionsTab: QuickFilter.flagged,
		},
	}

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

	const { mutate: mutateUserView } = useMutateUserView({
		mutation: {
			networkMode: "always",
			onMutate: ({ data }) => {
				const previousView =
					queryClient.getQueryData<UserViewDto>(userViewQueryKey)

				queryClient.setQueryData<UserViewDto>(userViewQueryKey, data.view)

				return { previousView }
			},
			onError: (_error, _variables, context) => {
				if (context?.previousView) {
					queryClient.setQueryData(userViewQueryKey, context.previousView)
				}
			},
		},
	})

	function updateView(nextView: UserViewDto) {
		mutateUserView({ data: { workspaceId, view: nextView } })
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
				defaultColumnOrder,
				workspaceId,
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
