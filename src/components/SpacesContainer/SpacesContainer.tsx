import styled from "@emotion/styled"
import { Search, X } from "lucide-react"
import { useState } from "react"
import {
	useGetPermittedWorkspaces,
	useListWorkspaces,
} from "src/api/workspace/workspace"
import emptyWorkspacesImage from "src/assets/empty-states/empty-workspace.svg"
import noResultsFound from "src/assets/empty-states/no-results-found.svg"
import { EmptyCardState } from "src/components/shared/EmptyCardState"
// import NewWorkspaceButton from "./NewWorkspaceButton"
import WorkspaceCard from "./WorkspaceCard"

function filterByTitle<T extends { title: string }>(items: T[], query: string) {
	const lower = query.toLowerCase()
	return items.filter((item) => item.title.toLowerCase().includes(lower))
}

export default function SpacesContainer() {
	const { data: allWorkspaces = [] } = useListWorkspaces()
	const { data: myWorkspaces = [] } = useGetPermittedWorkspaces()
	const [searchQuery, setSearchQuery] = useState("")
	const [activeTab, setActiveTab] = useState<"mine" | "all">("mine")

	const tabs: { key: "mine" | "all"; label: string }[] = [
		{ key: "mine", label: "הסביבות שלי" },
		{ key: "all", label: "כל הסביבות" },
	]

	function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
		setSearchQuery(e.target.value)
	}

	const filteredMine = filterByTitle(myWorkspaces, searchQuery)
	const filteredAll = filterByTitle(allWorkspaces, searchQuery)

	const displayedWorkspaces = activeTab === "mine" ? filteredMine : filteredAll

	return (
		<SpaceContainerCard>
			<TopSection>
				<HeaderRow>
					<ActionsRow>
						{/* <NewWorkspaceButton /> */}

						<SearchWrapper>
							<SearchInput
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

					<SectionTitle>סביבות מפקדים</SectionTitle>
				</HeaderRow>

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
			</TopSection>

			{displayedWorkspaces.length === 0 ? (
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
				<WorkspacesContainer>
					{displayedWorkspaces.map((ws) => (
						<WorkspaceCard key={ws.urlName} workspace={ws} />
					))}
				</WorkspacesContainer>
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
  flex: 1;
  min-height: 0;
  border-radius: 8px;
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
  font-size: clamp(22px, 1.8vw, 34px);
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

const SearchInput = styled.input`
  direction: rtl;
  width: 100%;
  height: 40px;
  padding: 8px;
  padding-inline-start: 40px;
  padding-inline-end: 28px;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  background: var(--background);
  font-size: var(--fs-lg);
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
  border-bottom: 2px solid ${({ $active }) => ($active ? "var(--primary)" : "transparent")};
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 500 : 400)};
  color: ${({ $active }) => ($active ? "var(--primary)" : "var(--Text-color-text-placeholder)")};
  line-height: 22px;
  white-space: nowrap;
`

const WorkspacesContainer = styled.div`
  direction: ltr;
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  overflow-y: auto;
  min-height: 0;
  padding-bottom: 16px;
  justify-content: flex-end;
  padding-right: 4px;
`

const EmptySpace = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
`
