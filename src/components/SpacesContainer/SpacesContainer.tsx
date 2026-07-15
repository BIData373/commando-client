import styled from "@emotion/styled"
import { useQueries } from "@tanstack/react-query"
import { Plus, Search } from "lucide-react"
import { useMemo, useState } from "react"
import { getGetMyPermissionQueryOptions } from "src/api/permission/permission"
import { useListWorkspaces } from "src/api/workspace/workspace"
import emptyWorkspacesImage from "src/assets/empty-states/empty-workspace.svg"
import { EmptyCardState } from "src/components/shared/EmptyCardState"
import WorkspaceCard from "./WorkspaceCard"

export default function SpacesContainer() {
	const { data: workspaces = [] } = useListWorkspaces()
	const [searchQuery, setSearchQuery] = useState("")
	const [activeTab, setActiveTab] = useState<"mine" | "all">("mine")

	const permissionQueries = useQueries({
		queries: workspaces.map((ws) =>
			getGetMyPermissionQueryOptions({ workspaceId: ws.id }),
		),
	})

	const myWorkspaceIds = useMemo(() => {
		const ids = new Set<number>()
		for (const query of permissionQueries) {
			if (query.data) {
				ids.add(query.data.workspaceId)
			}
		}
		return ids
	}, [permissionQueries])

	const allQueriesLoaded =
		permissionQueries.length > 0 && permissionQueries.every((q) => !q.isLoading)

	const hasNoPermissions = allQueriesLoaded && myWorkspaceIds.size === 0

	function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
		setSearchQuery(e.target.value)
	}

	// function handleNewWorkspace() {
	// 	navigate({ to: "/new-workspace" })
	// }

	const searchFiltered = workspaces.filter((ws) =>
		ws.title.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	const filtered =
		activeTab === "mine"
			? searchFiltered.filter((ws) => myWorkspaceIds.has(ws.id))
			: searchFiltered

	return (
		<SpaceContainerCard>
			<TopSection>
				<HeaderRow>
					<ActionsRow>
						{/* <NewWorkspaceButton onClick={handleNewWorkspace}>
							<GradientText>בקשה לסביבה חדשה</GradientText>
							<GradientIcon size={18} />
						</NewWorkspaceButton> */}

						<SearchWrapper>
							<SearchInput
								placeholder="חפש סביבה"
								value={searchQuery}
								onChange={handleSearchChange}
							/>
							<SearchIconWrapper>
								<Search size={24} />
							</SearchIconWrapper>
						</SearchWrapper>
					</ActionsRow>

					<SectionTitle>סביבות מפקדים</SectionTitle>
				</HeaderRow>

				<TabsRow>
					<Tab
						$active={activeTab === "mine"}
						onClick={() => setActiveTab("mine")}
					>
						הסביבות שלי
					</Tab>
					<Tab
						$active={activeTab === "all"}
						onClick={() => setActiveTab("all")}
					>
						כל הסביבות
					</Tab>
				</TabsRow>
			</TopSection>

			{hasNoPermissions && activeTab === "mine" ? (
				<EmptySpace>
					<EmptyCardState
						imgSrc={emptyWorkspacesImage}
						title="לא נמצאו הרשאות לסביבות"
						description="ניתן לפנות למנהל סביבה כדי לקבל הרשאות"
					/>
				</EmptySpace>
			) : (
				<WorkspacesContainer>
					{filtered.map((ws) => (
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

// const NewWorkspaceButton = styled.button`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 8px;
//   height: 40px;
//   padding: 0 15px;
//   background: var(--background);
//   border: 1px solid var(--primary);
//   border-radius: 8px;
//   cursor: pointer;
//   box-shadow: var(--shadow-button);
//   color: var(--primary);

//   &:hover {
//     border-color: var(--hover-primary);
//     color: var(--hover-primary);
//   }
// `

// const GradientText = styled.span`
//   font-size: var(--fs-base);
//   font-weight: 400;
//   line-height: 24px;
//   color: inherit;
//   white-space: nowrap;
// `

// const GradientIcon = styled(Plus)`
//   color: inherit;
// `

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
