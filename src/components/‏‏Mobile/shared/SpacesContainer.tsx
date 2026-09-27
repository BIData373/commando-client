import styled from "@emotion/styled"
import { useState } from "react"
import {
	useGetPermittedWorkspaces,
	useListWorkspaces,
} from "src/api/workspace/workspace"
import emptyWorkspacesImage from "src/assets/empty-states/empty-workspace.svg"
import noResultsFound from "src/assets/empty-states/no-results-found.svg"
import WorkspaceCard from "src/components/SpacesContainer/WorkspaceCard"
import { EmptyCardState } from "src/components/shared/EmptyCardState"
import { LoadingSpinner } from "src/components/shared/LoadingSpinner"
import SearchInput from "./SearchInput"

function filterByTitle<T extends { title: string }>(items: T[], query: string) {
	const lower = query.toLowerCase()
	return items.filter((item) => item.title.toLowerCase().includes(lower))
}

export default function SpacesContainer() {
	const { data: allWorkspaces = [], isLoading: isAllWorkspacesLoading } =
		useListWorkspaces()
	const { data: myWorkspaces = [], isLoading: isMyWorkspacesLoading } =
		useGetPermittedWorkspaces()
	const [searchQuery, setSearchQuery] = useState("")
	const [activeTab, setActiveTab] = useState<"mine" | "all">("mine")

	const tabs: { key: "mine" | "all"; label: string }[] = [
		{ key: "mine", label: "הסביבות שלי" },
		{ key: "all", label: "כל הסביבות" },
	]

	const filteredMine = filterByTitle(myWorkspaces, searchQuery)
	const filteredAll = filterByTitle(allWorkspaces, searchQuery)

	const displayedWorkspaces = activeTab === "mine" ? filteredMine : filteredAll
	const isLoading =
		activeTab === "mine" ? isMyWorkspacesLoading : isAllWorkspacesLoading

	return (
		<SpaceContainerCard>
			<TopSection>
				<HeaderRow>
					<SectionTitle>סביבות מפקדים</SectionTitle>
					<TabsRow>
						{tabs.map(({ key, label }) => (
							<Tab
								key={key}
								$active={activeTab === key}
								onClick={() => setActiveTab(key)}
							>
								{label}
							</Tab>
						))}
					</TabsRow>
					{activeTab === "all" && (
						<ActionsRow>
							<SearchInput
								placeholder="חפש סביבה"
								value={searchQuery}
								onChange={(newSearch) => {
									setSearchQuery(newSearch)
								}}
							/>
						</ActionsRow>
					)}
				</HeaderRow>
			</TopSection>

			{isLoading ? (
				<LoadingSpace>
					<LoadingSpinner />
				</LoadingSpace>
			) : displayedWorkspaces.length === 0 ? (
				<EmptySpace>
					{searchQuery ? (
						<EmptyCardState
							imgSrc={noResultsFound}
							title="לא נמצאו סביבות"
							description={`לא נמצאו סביבות התואמות ל-"${searchQuery}"`}
						/>
					) : (
						activeTab === "mine" && (
							<EmptyCardState
								imgSrc={emptyWorkspacesImage}
								title="לא נמצאו הרשאות לסביבות"
								description="ניתן לפנות למנהל סביבה כדי לקבל הרשאות"
							/>
						)
					)}
				</EmptySpace>
			) : (
				<ScrollContainer>
					<WorkspacesContainer>
						{displayedWorkspaces.map((ws) => (
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
  padding: clamp(12px, 1.9vh, 20px) clamp(24px, 2.5vw, 48px) 0;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(12px, 2.2vh, 24px);
  align-self: stretch;
  border-radius: 8px;
  width: 100%;
`

const HeaderRow = styled.div`
  direction: ltr;
  display: flex;
  flex-direction: column;
  width: 100%;
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: clamp(20px, 1.5vw, 32px);
  font-weight: 400;
  line-height: clamp(30px, 4.3vh, 46px);
  color: var(--Color-Subtitle);
  white-space: nowrap;
  text-align: end;
`

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
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
  margin: 16px 0;
  width: auto;
`

const Tab = styled.button<{ $active: boolean }>`
  padding-bottom: 4px;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? "var(--primary)" : "transparent")};
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 500 : 400)};
  color: ${({ $active }) => ($active ? "var(--primary)" : "var(--Text-color-text-placeholder)")};
  line-height: 22px;
  white-space: nowrap;
`

const ScrollContainer = styled.div`
  direction: ltr;
  width: 100%;
  scrollbar-gutter: stable;
  min-height: 0;
`

const WorkspacesContainer = styled.div`
  direction: rtl;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); 
  grid-auto-rows: minmax(140px, 1fr); 
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
