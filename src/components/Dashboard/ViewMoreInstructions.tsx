import styled from "@emotion/styled"
import { useNavigate } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import type { DeadlineType, WorkspaceStatusType } from "src/api/model"
import type { QuickFilter } from "src/api/model/quick-filter"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { TasksView } from "src/routes/workspace/$urlName/tasks"

interface IViewInstruction {
	quickFilter?: QuickFilter
	statusFilter?: WorkspaceStatusType
	deadlineTypeFilter?: DeadlineType
}

export const ViewMoreInstructions = ({
	quickFilter,
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
				quickFilter: quickFilter ? [quickFilter] : [],
				statusFilter,
				deadlineTypeFilter,
			},
		})
	}

	return (
		<ViewMoreButton onClick={handleViewMore}>
			פרטים נוספים
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
  border: none;
  cursor: pointer;
  border-radius: 6px;
  align-self: flex-start;

  background: rgba(0, 0, 0, 0.04);

  :hover {
	background: var(--button-hover);
  }

  :active {
	background: var(--button-active);
  }
`
