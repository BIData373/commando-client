import styled from "@emotion/styled"
import { useNavigate, useParams } from "@tanstack/react-router"
import { ChevronDown } from "lucide-react"
import { TEST_IDS } from "src/consts/test-ids"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { CreateButton } from "./CreateButton"
import { NewTaskMode } from "./NewTaskModal"

interface CreateTaskButtonProps {
	context?: "tasks" | "dashboard"
}

export function CreateTaskButton({ context = "tasks" }: CreateTaskButtonProps) {
	const { urlName = "" } =
		useParams({ from: "/workspace/$urlName", shouldThrow: false }) ?? {}
	const navigate = useNavigate()

	const newTaskTo =
		context === "dashboard"
			? "/workspace/$urlName/dashboard/new"
			: "/workspace/$urlName/tasks/new"

	function navigateToNew(mode: NewTaskMode) {
		navigate({ to: newTaskTo, params: { urlName }, search: { mode } })
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
				<CreateButton
					data-testid={TEST_IDS.shared.createTaskButton}
					label="צור הנחיה"
					endIcon={<ChevronDown size={18} />}
				/>
			</DropdownMenuTrigger>
			<StyledDropdownContent align="end" sideOffset={6}>
				<StyledDropdownItem
					data-testid={TEST_IDS.shared.createTaskDiscussion}
					onSelect={handleCreateFromDiscussion}
				>
					הנחיות מתוך דיון
				</StyledDropdownItem>
				<StyledDropdownItem
					data-testid={TEST_IDS.shared.createTaskSingle}
					onSelect={handleCreateSingle}
				>
					הנחיה בודדת
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
