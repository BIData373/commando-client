import { useDeleteMessage, useListMessages } from "src/api/message/message"
import { invalidateTaskComments } from "src/functions/comment-utils"
import { useCurrentUser } from "src/hooks/useCurrentUser"
import TaskComment from "./TaskComment"

interface TaskCommentListProps {
	taskId: number
	isManager: boolean
}

function TaskCommentList({ taskId, isManager }: TaskCommentListProps) {
	const { data: messages = [] } = useListMessages({ taskIds: [taskId] })
	const currentUser = useCurrentUser()

	const { mutate: deleteMessage } = useDeleteMessage({
		mutation: {
			meta: { toast: { error: true } },
			onSettled: () => invalidateTaskComments(taskId),
		},
	})

	function handleDeleteComment(id: number) {
		deleteMessage({ pathParams: { id } })
	}

	return messages.map((msg) => (
		<TaskComment
			key={msg.id}
			message={msg}
			canDelete={isManager || msg.user.upn === currentUser.upn}
			onDelete={handleDeleteComment}
		/>
	))
}

export default TaskCommentList
