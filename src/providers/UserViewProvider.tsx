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
	useUpsertUserView,
} from "src/api/user-view/user-view"

import { Spinner } from "src/components/ui/spinner"

export interface UserViewContext {
	view: UserViewDto
	updateView(nextView: UserViewDto): Promise<void>
	defaultColumnOrder: (keyof TaskRowWithWorkspaceDto)[]
	workspaceId?: number
	setColumnOrder: (order: (keyof TaskRowWithWorkspaceDto)[]) => void
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
	const { columnVisibility } = view.table

	const userViewQueryKey = getGetUserViewQueryKey({ workspaceId })

	const { mutate: mutateColumnOrder } = useUpsertUserView({
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

	function setColumnOrder(order: (keyof TaskRowWithWorkspaceDto)[]) {
		const nextView: UserViewDto = {
			...view,
			table: {
				...view.table,
				columnVisibility: {
					...columnVisibility,
					columnOrder: order,
				},
			},
		}

		mutateColumnOrder({ data: { workspaceId, view: nextView } })
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
				setColumnOrder,
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
