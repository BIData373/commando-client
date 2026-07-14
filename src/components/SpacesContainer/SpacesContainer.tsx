import styled from "@emotion/styled"
import { useQueries } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { Plus, Search } from "lucide-react"
import { useMemo, useState } from "react"
import { getGetMyPermissionQueryOptions } from "src/api/permission/permission"
import { useListWorkspaces } from "src/api/workspace/workspace"
import emptyWorkspacesImage from "src/assets/empty-states/empty-workspace.svg"
import { EmptyCardState } from "src/components/shared/EmptyCardState"
import WorkspaceCard from "./WorkspaceCard"

export default function SpacesContainer() {
	const navigate = useNavigate()
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

	function handleNewWorkspace() {
		navigate({ to: "/new-workspace" })
	}

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
						<NewWorkspaceButton onClick={handleNewWorkspace}>
							<GradientText>בקשה לסביבה חדשה</GradientText>
							<GradientIcon size={18} />
						</NewWorkspaceButton>

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

			{hasNoPermissions ? (
				<EmptyCardState
					imgSrc={emptyWorkspacesImage}
					title="לא נמצאו הרשאות לסביבות"
					description="ניתן לפנות למנהל סביבה כדי לקבל הרשאות"
				/>
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
  height: 412px;
  padding: 20px 48px 0 48px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03),
    0 1px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px 0 rgba(0, 0, 0, 0.02);
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
  font-size: 34px;
  font-weight: 400;
  line-height: 46px;
  color: #1d293d;
  white-space: nowrap;
`

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const NewWorkspaceButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 15px;
  background: white;
  border: 1px solid #6866ff;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
  color: #6866ff;

  &:hover {
    border-color: #9a99ff;
    color: #9a99ff;
  }
`

const GradientText = styled.span`
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 24px;
  color: inherit;
  white-space: nowrap;
`

const GradientIcon = styled(Plus)`
  color: inherit;
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
  border: 1px solid var(--line);
  border-radius: 8px;
  background: white;
  font-size: var(--fs-lg);
  color: var(--sea-ink);
  outline: none;
  text-align: start;

  &::placeholder {
    color: rgba(0, 0, 0, 0.25);
  }

  &:focus {
    border-color: #6866ff;
  }
`

const SearchIconWrapper = styled.span`
  position: absolute;
  inset-inline-end: 8px;
  display: flex;
  color: rgba(0, 0, 0, 0.25);
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
  border-bottom: 1px solid #f0f0f0;
`

const Tab = styled.button<{ $active: boolean }>`
  padding-bottom: 4px;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? "#6866ff" : "transparent")};
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 500 : 400)};
  color: ${({ $active }) => ($active ? "#6866ff" : "rgba(0, 0, 0, 0.25)")};
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
