import { useQueryClient } from "@tanstack/react-query"
import { createContext, type PropsWithChildren, useContext } from "react"
import type { UserViewDto } from "src/api/model"
import { DistributionTab } from "src/api/model/distribution-tab"
import { QuickFilter } from "src/api/model/quick-filter"
import {
	getGetUserViewQueryKey,
	upsertUserView,
	useGetUserView,
} from "src/api/user-view/user-view"

import { Spinner } from "src/components/ui/spinner"
import { DEFAULT_COLUMN_ORDER } from "src/utils/task-table-utils"

export interface UserViewContext {
	view: UserViewDto
	updateView(nextView: UserViewDto): Promise<void>
}

const UserViewContext = createContext<UserViewContext | null>(null)

const PERSONAL_DEFAULT_COLUMN_ORDER = [
	"title",
	"status",
	"assignee",
	"deadlineType",
	"source",
	"tags",
	"notes",
	"workspace",
	"createdAt",
	"updatedAt",
]

const PERSONAL_DEFAULT_HIDDEN = ["tags", "notes", "updatedAt"]

const WORKSPACE_DEFAULT_HIDDEN = ["notes", "updatedAt"]

function getDefaultView(workspaceId: number | null): UserViewDto {
	return {
		table: {
			sorting: [],
			columnFilters: [],
			quickFilter: [],
			columnVisibility: {
				columnOrder: workspaceId
					? [...DEFAULT_COLUMN_ORDER]
					: [...PERSONAL_DEFAULT_COLUMN_ORDER],
				hiddenColumns: workspaceId
					? [...WORKSPACE_DEFAULT_HIDDEN]
					: [...PERSONAL_DEFAULT_HIDDEN],
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
}

export function UserViewProvider({
	children,
	workspaceId,
}: UserViewProviderProps) {
	const queryClient = useQueryClient()
	const defaultView = getDefaultView(workspaceId ?? null)

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

	const updateView = async (nextView: UserViewDto) => {
		queryClient.setQueryData(getGetUserViewQueryKey({ workspaceId }), nextView)
		upsertUserView({
			workspaceId,
			view: nextView,
		}).then(() => {
			queryClient.invalidateQueries({
				queryKey: getGetUserViewQueryKey({ workspaceId }),
			})
		})
	}

	return isLoading ? (
		<Spinner />
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

export function useUserView() {
	const context = useContext(UserViewContext)

	if (!context) {
		throw new Error("useUserView must be used inside UserViewProvider")
	}

	return context
}
