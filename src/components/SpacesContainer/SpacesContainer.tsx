import styled from "@emotion/styled"
import { Search, X } from "lucide-react"
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
import { useIsMobile } from "src/hooks/use-mobile"
import { filterByTitle } from "src/utils/workspace-utils"
import SearchInput from "../Mobile/shared/SearchInput"
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

	function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
		setSearchQuery(e.target.value)
	}

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

	return (
		<SpaceContainerCard $isMobile={isMobile}>
			<TopSection>
				<HeaderRow>
					{!isMobile && (
						<ActionsRow>
							<WorkspaceRequestButton />
							<SearchWrapper>
								<DesktopSearchInput
									placeholder="חפש סביבה"
									value={searchQuery}
									onChange={handleSearchChange}
								/>
								<SearchIconWrapper>
									<Search size={24} />
								</SearchIconWrapper>
								{searchQuery && (
									<ClearIconWrapper>
										<ClearIcon size={14} onClick={() => setSearchQuery("")} />
									</ClearIconWrapper>
								)}
							</SearchWrapper>
						</ActionsRow>
					)}
					<SectionTitle $isMobile>סביבות מפקדים</SectionTitle>
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

				{isMobile && (
					<MobileSearchWrapper>
						<SearchInput
							placeholder="חפש סביבה"
							value={searchQuery}
							onChange={setSearchQuery}
						/>
					</MobileSearchWrapper>
				)}
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
				<ScrollContainer $isMobile={isMobile}>
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

const SpaceContainerCard = styled.div<{ $isMobile: boolean }>`
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

	${({ $isMobile }) =>
		$isMobile &&
		`
			flex: none;
			min-height: auto;
			overflow: visible;
		`}
`

const HeaderRow = styled.div`
	direction: ltr;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
`

const SectionTitle = styled.h2<{ $isMobile: boolean }>`
	margin: 0;

  margin-inline-start: ${({ $isMobile }) => ($isMobile ? "auto" : "0")};
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

const SearchWrapper = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	width: 284px;
`

const DesktopSearchInput = styled.input`
	direction: rtl;
	width: 100%;
	height: 40px;
	box-sizing: border-box;
	padding: 8px;
	padding-inline-start: 40px;
	padding-inline-end: 28px;
	border: 1px solid var(--card-border);
	border-radius: 8px;
	background: var(--background);
	font-size: var(--fs-base);
	color: var(--sea-ink);
	outline: none;
	text-align: start;

	&::placeholder {
		color: var(--Text-color-text-placeholder);
	}

	&:focus {
		border-color: var(--primary);
	}
`

const SearchIconWrapper = styled.span`
	position: absolute;
	inset-inline-end: 8px;
	display: flex;
	color: var(--Text-color-text-placeholder);
	pointer-events: none;
`

const ClearIconWrapper = styled.span`
	position: absolute;
	inset-inline-start: 8px;
	display: flex;
`

const ClearIcon = styled(X)`
	color: var(--background);
	cursor: pointer;
	background: var(--icon-background);
	border-radius: 50%;
	padding: 2px;

	&:hover {
		background: var(--text-color);
	}
`

const TopSection = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
	gap: 16px;
`

const MobileSearchWrapper = styled.div`
	direction: ltr;
	width: 100%;
	min-width: 0;
`

const TabsRow = styled.div`
	display: flex;
	gap: 32px;
	justify-content: flex-end;
	padding-inline: 8px;
	width: auto;
	border-bottom: 1px solid var(--line);
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

const ScrollContainer = styled.div<{ $isMobile: boolean }>`
	direction: ltr;
	flex: 1;
	width: 100%;
	min-width: 0;
	min-height: 0;
	overflow-y: ${({ $isMobile }) => ($isMobile ? "visible" : "auto")};
	scrollbar-gutter: stable;

	${({ $isMobile }) =>
		$isMobile &&
		`
			flex: none;
			min-height: auto;
			overflow: visible;
		`}
`

const WorkspacesContainer = styled.div`
	direction: rtl;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
	grid-auto-rows: minmax(140px, auto);
	gap: 12px;
	padding-inline-end: 4px;
	padding-bottom: 8px;
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
