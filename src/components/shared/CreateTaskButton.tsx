import styled from "@emotion/styled"
import { useNavigate, useParams } from "@tanstack/react-router"
import { ChevronDown, Plus } from "lucide-react"
import { PermissionType } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import { NewTaskMode } from "src/routes/workspace/$urlName/tasks/new"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"

interface CreateTaskButtonProps {
	view?: TasksView
	workspaceId: number
}

export function CreateTaskButton({
	view = TasksView.TABLE,
	workspaceId,
}: CreateTaskButtonProps) {
	const { urlName } = useParams({ from: "/workspace/$urlName" })
	const navigate = useNavigate()

	const { data: myPermission, isLoading } = useGetMyPermission({ workspaceId })

	if (isLoading || myPermission?.type !== PermissionType.MANAGER) {
		return null
	}

	function handleCreateSingle() {
		navigate({
			to: "/workspace/$urlName/tasks/new",
			params: { urlName },
			search: { view, mode: NewTaskMode.SINGLE },
		})
	}

	function handleCreateFromDiscussion() {
		navigate({
			to: "/workspace/$urlName/tasks/new",
			params: { urlName },
			search: { view, mode: NewTaskMode.DISCUSSION },
		})
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<StyledCreateButton>
					<Plus size={16} color="white" />
					<ButtonText>צור הנחייה</ButtonText>
					<ChevronDown size={16} color="white" />
				</StyledCreateButton>
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

const StyledCreateButton = styled.button`
  direction: rtl;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding-inline: 15px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(165deg, var(--purple-start) 0%, var(--purple-end) 100%);
  color: white;
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 24px;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  outline: none;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
    pointer-events: none;
  }

  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.85;
  }
`

const ButtonText = styled.span`
  direction: rtl;
`

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
