import styled from "@emotion/styled"
import { useState } from "react"
import { useListAssignees } from "src/api/assignee/assignee"
import { useFilteredAssignees } from "src/hooks/useFilteredAssignees"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { AssigneeCardList } from "./AssigneeCardList"
import { AssigneesSettingsSections } from "./AssigneesSettingsSections"
import { AssigneesToolbar } from "./AssigneesToolbar"

export const assigneeStatusEditableId = "allow-status-update"

interface AssigneesContentProps {
	onOpenCreateDialog(): void
}

export function AssigneesContent({
	onOpenCreateDialog,
}: AssigneesContentProps) {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	const { data: assignees = [], isLoading } = useListAssignees({ workspaceId })

	const [searchQuery, setSearchQuery] = useState("")

	const filteredAssignees = useFilteredAssignees(assignees, searchQuery)

	return (
		<ContentRoot>
			<StyledContent>
				<AssigneesSettingsSections assignees={assignees} />
				<AssigneesToolbar
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					onCreate={onOpenCreateDialog}
				/>
			</StyledContent>
			<CardScroller>
				<AssigneeCardList
					assignees={filteredAssignees}
					isLoading={isLoading}
					searchQuery={searchQuery}
					workspaceId={workspaceId}
				/>
			</CardScroller>
		</ContentRoot>
	)
}

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`

const ContentRoot = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`

const CardScroller = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: none;
  direction: ltr;
`
