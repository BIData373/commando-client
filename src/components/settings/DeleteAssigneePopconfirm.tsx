import { useState } from "react"
import {
	getListAssigneesQueryKey,
	useDeleteAssignee,
} from "src/api/assignee/assignee"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { queryClient } from "src/queryClient"
import { ConfirmPopover } from "../shared/ConfirmPopover"
import { TrashButton } from "../shared/TrashButton"

interface DeleteAssigneePopconfirmProps {
	assigneeId: number
	tasksCount: number
}

export function DeleteAssigneePopconfirm({
	assigneeId,
	tasksCount,
}: DeleteAssigneePopconfirmProps) {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()
	const { isPending, mutate: deleteAssignee } = useDeleteAssignee({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: getListAssigneesQueryKey({ workspaceId }),
				})
			}
		}
	})

	const [open, setOpen] = useState(false)

	function handleTriggerClick(e: React.MouseEvent) {
		e.stopPropagation()
	}

	function handleConfirm() {
		deleteAssignee({ pathParams: { id: assigneeId } })
	}

	function handleCloseAutoFocus(e: Event) {
		e.preventDefault()
	}

	return (
		<ConfirmPopover
			open={open}
			onOpenChange={setOpen}
			trigger={<TrashButton onClick={handleTriggerClick} />}
			title="למחוק את האחראי"
			description={
				<>
					האם אתה בטוח? מחיקת האחראי תבטל את שיוך ההנחיות שהוא קיבל
					{tasksCount > 0 ? ` (סה"כ ${tasksCount} הנחיות פעילות)` : ''}
					<br />
					הנחיות אלו ימשיכו להופיע בלשכה
				</>
			}
			confirmLabel="מחק"
			cancelLabel="לא"
			isPending={isPending}
			side="bottom"
			align="start"
			sideOffset={8}
			onConfirm={handleConfirm}
			onCloseAutoFocus={handleCloseAutoFocus}
		/>
	)
}
