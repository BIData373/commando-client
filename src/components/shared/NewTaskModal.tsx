import { PermissionType } from "src/api/model"
import CreateTaskModal from "src/components/CreateTasks/CreateTaskModal"
import CreateDiscussionModal from "src/components/CreateTasksFromDiscussion/CreateDiscussionModal"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import { AuthorizationWrapper } from "src/wrappers/AuthorizationWrapper"
import { z } from "zod"

export enum NewTaskMode {
	SINGLE = "SINGLE",
	DISCUSSION = "DISCUSSION",
}

export const newTaskSearchSchema = z.object({
	mode: z.nativeEnum(NewTaskMode).default(NewTaskMode.SINGLE),
	view: z.nativeEnum(TasksView).default(TasksView.TABLE),
})

interface NewTaskModalProps {
	mode: NewTaskMode
	onClose: () => void
}

export function NewTaskModal({ mode, onClose }: NewTaskModalProps) {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	return (
		<AuthorizationWrapper type={PermissionType.MANAGER}>
			{mode === NewTaskMode.DISCUSSION ? (
				<CreateDiscussionModal onClose={onClose} />
			) : (
				<CreateTaskModal
					workspaceId={workspaceId}
					onClose={onClose}
					onCancel={onClose}
				/>
			)}
		</AuthorizationWrapper>
	)
}
