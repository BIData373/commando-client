import styled from "@emotion/styled"
import { useNavigate, useParams } from "@tanstack/react-router"
import { ChevronDown, Plus } from "lucide-react"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { NewTaskMode } from "./NewTaskModal"
import { PrimaryButton } from "./PrimaryButton"

interface CreateTaskButtonProps {
	view?: TasksView
	context?: "tasks" | "dashboard"
}

export function CreateTaskButton({
	view = TasksView.TABLE,
	context = "tasks",
}: CreateTaskButtonProps) {
	const { urlName } = useParams({ from: "/workspace/$urlName" })
	const navigate = useNavigate()

	const newTaskTo =
		context === "dashboard"
			? "/workspace/$urlName/dashboard/new"
			: "/workspace/$urlName/tasks/new"

	function navigateToNew(mode: NewTaskMode) {
		navigate({ to: newTaskTo, params: { urlName }, search: { view, mode } })
	}

	function handleCreateSingle() {
		navigateToNew(NewTaskMode.SINGLE)
	}

	function handleCreateFromDiscussion() {
		navigateToNew(NewTaskMode.DISCUSSION)
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<PrimaryButton
					title={
						<>
							<Plus size={16} color="white" />
							צור הנחייה
							<ChevronDown size={16} color="white" />
						</>
					}
				/>
			</DropdownMenuTrigger>
			<StyledDropdownContent align="end" sideOffset={6}>
				<StyledDropdownItem onSelect={handleCreateFromDiscussion}>
					הנחיות מתוך דיון
				</StyledDropdownItem>
				<StyledDropdownItem onSelect={handleCreateSingle}>
					הנחייה בודדת
				</StyledDropdownItem>
			</StyledDropdownContent>
		</DropdownMenu>
	)
}

const StyledDropdownContent = styled(DropdownMenuContent)`
  direction: rtl;
  min-width: var(--radix-dropdown-menu-trigger-width);
  padding: 4px;
  border-radius: 8px;
  box-shadow:
    0px 9px 28px 0px rgba(0, 0, 0, 0.05),
    0px 3px 6px -4px rgba(0, 0, 0, 0.12),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08);
`

const StyledDropdownItem = styled(DropdownMenuItem)`
  direction: rtl;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 32px;
  padding-inline: 12px;
  padding-block: 5px;
  border-radius: 4px;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
  cursor: pointer;
`
