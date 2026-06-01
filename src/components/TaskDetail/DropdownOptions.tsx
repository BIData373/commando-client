import styled from "@emotion/styled"
import { MoreVertical } from "lucide-react"
import { PermissionDtoType } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { RowActionsMenu } from "../Tasks/RowActionsMenu"

interface DropdownOptions {
	onEdit(): void
	onArchive(): void
	onDelete(): void
}

export const DropdownOptions = ({
	onEdit,
	onArchive,
	onDelete,
}: DropdownOptions) => {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()
	const { data: myPermission } = useGetMyPermission({ workspaceId })

	return (
		<RowActionsMenu
			trigger={
				<DotsButton>
					<MoreVertical size={16} />
				</DotsButton>
			}
			onDelete={
				myPermission?.type === PermissionDtoType.MANAGER ? onDelete : undefined
			}
			onArchive={onArchive}
			onEdit={
				myPermission?.type === PermissionDtoType.MANAGER ? onEdit : undefined
			}
		/>
	)
}

const DotsButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  flex-shrink: 0;
  color: var(--sea-ink-soft);
  cursor: pointer;
  outline: none;

  &:hover {
    background: var(--button-hover);
    color: var(--sea-ink);
  }
`
