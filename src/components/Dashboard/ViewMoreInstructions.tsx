import styled from "@emotion/styled"
import { useNavigate } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import type { DeadlineType, WorkspaceStatusType } from "src/api/model"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import type { QuickFilter } from "src/utils/filter-utils"

interface IViewInstruction {
	tabFilter?: QuickFilter
	statusFilter?: WorkspaceStatusType
	deadlineTypeFilter?: DeadlineType
}

export const ViewMoreInstructions = ({
	tabFilter,
	statusFilter,
	deadlineTypeFilter,
}: IViewInstruction) => {
	const {
		workspace: { urlName },
	} = useWorkspace()

	const navigate = useNavigate()

	function handleViewMore() {
		navigate({
			to: "/workspace/$urlName/tasks",
			params: { urlName },
			search: {
				view: TasksView.TABLE,
				tabFilter,
				statusFilter,
				deadlineTypeFilter,
			},
		})
	}

	return (
		<ViewMoreButton onClick={handleViewMore}>
			צפה בעוד הנחיות
			<ChevronLeft size={16} />
		</ViewMoreButton>
	)
}

const ViewMoreButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 15px;
  font-size: var(--fs-btn);
  color: var(--foreground);
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  align-self: flex-end;

  &:hover {
    background: var(--chip-bg);
  }
`
