import styled from "@emotion/styled"
import { useState } from "react"
import type { WorkspaceWithPermissionDto } from "src/api/model"
import {
	useGetPermittedWorkspaces,
	useListWorkspaces,
} from "src/api/workspace/workspace"
import emptyWorkspacesImage from "src/assets/empty-states/empty-workspace.svg"
import noResultsFound from "src/assets/empty-states/no-results-found.svg"
import {
	EmptyCardState,
	type EmptyCardStateProps,
} from "src/components/shared/EmptyCardState"
import { LoadingSpinner } from "src/components/shared/LoadingSpinner"
import { MOBILE_MEDIA_QUERY, useIsMobile } from "src/hooks/use-mobile"
import { filterByTitle } from "src/utils/workspace-utils"
import SearchInput from "../shared/SearchInput"
import NewWorkspaceButton from "./NewWorkspaceButton"
import WorkspaceCard from "./WorkspaceCard"

type TabKey = "mine" | "all"
const tabKeys: TabKey[] = ["mine", "all"]

interface TabType {
	isLoading: boolean
	workspaces: WorkspaceWithPermissionDto[]
	label: string
}

export default function SpacesContainer() {
	const { data: allWorkspaces = [], isLoading: isAllWorkspacesLoading } =
		useListWorkspaces()
	const { data: myWorkspaces = [], isLoading: isMyWorkspacesLoading } =
		useGetPermittedWorkspaces()

	const [searchQuery, setSearchQuery] = useState("")
	const [activeTab, setActiveTab] = useState<TabKey>("mine")

	const isMobile = useIsMobile()

	const filteredMine = filterByTitle(myWorkspaces, searchQuery)
	const filteredAll = filterByTitle(allWorkspaces, searchQuery)

	const tabs = {
		all: {
			label: "כל הסביבות",
			workspaces: filteredAll,
			isLoading: isAllWorkspacesLoading,
		},
		mine: {
			label: "הסביבות שלי",
			workspaces: filteredMine,
			isLoading: isMyWorkspacesLoading,
		},
	} satisfies Record<TabKey, TabType>

	const isLoading = tabs[activeTab].isLoading

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

	const searchInput = (
		<WorkspaceSearchInput
			placeholder="חפש סביבה"
			value={searchQuery}
			onChange={setSearchQuery}
		/>
	)

	return (
		<SpaceContainerCard>
			<TopSection>
				<HeaderRow>
					{!isMobile && (
						<ActionsRow>
							<WorkspaceRequestButton />
							{searchInput}
						</ActionsRow>
					)}
					<SectionTitle>סביבות מפקדים</SectionTitle>
				</HeaderRow>

				<TabsRow>
					{tabKeys.map((key) => (
						<Tab
							key={key}
							$active={activeTab === key}
							onClick={() => setActiveTab(key)}
						>
							{tabs[key].label}
						</Tab>
					))}
				</TabsRow>

				{isMobile && activeTab === "all" && searchInput}
			</TopSection>

			{isLoading ? (
				<LoadingSpace>
					<LoadingSpinner />
				</LoadingSpace>
			) : tabs[activeTab].workspaces.length === 0 ? (
				<EmptySpace>
					<EmptyCardState
						{...(searchQuery
							? emptyCardStatePropOptions.noWorkspacesFound
							: activeTab === "mine"
								? emptyCardStatePropOptions.noPermissionsForAnyWorkspace
								: emptyCardStatePropOptions.fallback)}
					/>
				</EmptySpace>
			) : (
				<ScrollContainer>
					<WorkspacesContainer>
						{tabs[activeTab].workspaces.map((ws) => (
							<WorkspaceCard key={ws.urlName} workspace={ws} />
						))}
					</WorkspacesContainer>
				</ScrollContainer>
			)}
		</SpaceContainerCard>
	)
}

const SpaceContainerCard = styled.div`
	display: flex;
	padding: 0;
	flex-direction: column;
	align-items: flex-start;
	gap: clamp(12px, 2.2vh, 24px);
	align-self: stretch;
	flex: 1;
	min-height: 0;
	border-radius: 8px;
	width: 100%;

	${MOBILE_MEDIA_QUERY} {
		flex: none;
		min-height: auto;
		overflow: visible;
	}
`

const HeaderRow = styled.div`
	direction: ltr;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
`

const SectionTitle = styled.h2`
	margin: 0;
	margin-inline-start: auto;
	font-size: clamp(20px, 1.5vw, 32px);
	font-weight: 400;
	line-height: clamp(30px, 4.3vh, 46px);
	color: var(--Color-Subtitle);
	white-space: nowrap;
`

const ActionsRow = styled.div`
	display: flex;
	align-items: center;
	gap: 16px;
`

const WorkspaceSearchInput = styled(SearchInput)`
	flex: none;
	width: 284px;

	${MOBILE_MEDIA_QUERY} {
		width: 100%;
	}
`

const TopSection = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
	gap: 16px;
`

const TabsRow = styled.div`
	display: flex;
	gap: 32px;
	justify-content: flex-end;
	padding-inline: 8px;
	width: auto;
`

const Tab = styled.button<{ $active: boolean }>`
	padding-bottom: 4px;
	border: none;
	border-bottom: 2px solid
		${({ $active }) => ($active ? "var(--primary)" : "transparent")};
	background: none;
	cursor: pointer;
	font-size: 14px;
	font-weight: ${({ $active }) => ($active ? 500 : 400)};
	color: ${({ $active }) =>
		$active ? "var(--primary)" : "var(--Text-color-text-placeholder)"};
	line-height: 22px;
	white-space: nowrap;
`

const ScrollContainer = styled.div`
	direction: ltr;
	flex: 1;
	width: 100%;
	min-width: 0;
	min-height: 0;
	overflow-y: auto;
	scrollbar-gutter: stable;

	${MOBILE_MEDIA_QUERY} {
		flex: none;
		min-height: auto;
		overflow: visible;
	}
`

const WorkspacesContainer = styled.div`
	direction: rtl;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
	grid-auto-rows: minmax(140px, auto);
	gap: 12px;
	padding-inline-end: 4px;
	padding-bottom: 8px;

	${MOBILE_MEDIA_QUERY} {
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
	}
`

const EmptySpace = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-evenly;
`

const LoadingSpace = styled.div`
	display: flex;
	flex: 1;
	width: 100%;
	min-height: 0;
`

const WorkspaceRequestButton = styled(NewWorkspaceButton)`
	font-size: var(--fs-btn);
`
