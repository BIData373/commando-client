import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { z } from "zod"
import CreateTaskModal from "../../../../components/CreateTasks/CreateTaskModal"
import CreateDiscussionModal from "../../../../components/CreateTasksFromDiscussion/CreateDiscussionModal"
import { TasksView } from "../tasks"

export enum NewTaskMode {
	SINGLE = "SINGLE",
	DISCUSSION = "DISCUSSION",
}

const NewTaskSearchSchema = z.object({
	view: z.nativeEnum(TasksView).default(TasksView.TABLE),
	mode: z.nativeEnum(NewTaskMode).default(NewTaskMode.SINGLE),
})

export const Route = createFileRoute("/workspace/$urlName/tasks/new")({
	component: NewTask,
	validateSearch: NewTaskSearchSchema,
})

function NewTask() {
	const { urlName } = Route.useParams()
	const { view, mode } = Route.useSearch()
	const navigate = useNavigate()

	function handleClose() {
		navigate({
			to: "/workspace/$urlName/tasks",
			params: { urlName },
			search: { view },
		})
	}

	return (
		<>
			{mode === NewTaskMode.DISCUSSION ? (
				<CreateDiscussionModal onClose={handleClose} />
			) : (
				<CreateTaskModal onClose={handleClose} />
			)}
		</>
	)
}
