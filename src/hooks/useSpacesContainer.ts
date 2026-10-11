import { useState } from "react"
import type { WorkspaceWithPermissionDto } from "src/api/model"
import {
	useGetPermittedWorkspaces,
	useListWorkspaces,
} from "src/api/workspace/workspace"
import emptyWorkspacesImage from "src/assets/empty-states/empty-workspace.svg"
import noResultsFound from "src/assets/empty-states/no-results-found.svg"
import type { EmptyCardStateProps } from "src/components/shared/EmptyCardState"
import { filterByTitle } from "src/utils/workspace-utils"

export type TabKey = "mine" | "all"
export const tabKeys: TabKey[] = ["mine", "all"]

interface TabType {
	isLoading: boolean
	workspaces: WorkspaceWithPermissionDto[]
	label: string
}

export function useSpacesContainer() {
	const { data: allWorkspaces = [], isLoading: isAllWorkspacesLoading } =
		useListWorkspaces()

	const { data: myWorkspaces = [], isLoading: isMyWorkspacesLoading } =
		useGetPermittedWorkspaces()

	const [searchQuery, setSearchQuery] = useState("")
	const [activeTab, setActiveTab] = useState<TabKey>("mine")

	const tabs = {
		all: {
			label: "כל הסביבות",
			workspaces: filterByTitle(allWorkspaces, searchQuery),
			isLoading: isAllWorkspacesLoading,
		},
		mine: {
			label: "הסביבות שלי",
			workspaces: filterByTitle(myWorkspaces, searchQuery),
			isLoading: isMyWorkspacesLoading,
		},
	} satisfies Record<TabKey, TabType>

	const emptyCardStatePropOptions = {
		noWorkspacesFound: {
			imgSrc: noResultsFound,
			title: "לא נמצאו סביבות",
			description: `לא נמצאו סביבות מתאימות ל-${searchQuery}`,
		},
		noPermissionsForAnyWorkspace: {
			imgSrc: emptyWorkspacesImage,
			title: "לא נמצאו הרשאות לסביבות",
			description: "ניתן לפנות למנהל סביבה כדי לקבל הרשאות",
		},
		fallback: {
			imgSrc: "",
			title: "",
			description: "",
		},
	} satisfies Record<string, EmptyCardStateProps>

	const isLoading = tabs[activeTab].isLoading
	const workspaces = tabs[activeTab].workspaces

	const emptyState = searchQuery
		? emptyCardStatePropOptions.noWorkspacesFound
		: activeTab === "mine"
			? emptyCardStatePropOptions.noPermissionsForAnyWorkspace
			: emptyCardStatePropOptions.fallback

	return {
		tabs,
		activeTab,
		setActiveTab,
		searchQuery,
		setSearchQuery,
		workspaces,
		isLoading,
		emptyState,
	}
}
