import { createFileRoute, useNavigate } from "@tanstack/react-router"
import {
	NewTaskModal,
	newTaskSearchSchema,
} from "src/components/shared/NewTaskModal"

export const Route = createFileRoute("/workspace/$urlName/tasks/new")({
	component: NewTask,
	validateSearch: newTaskSearchSchema,
})

function NewTask() {
	const { urlName } = Route.useParams()
	const { view, mode, sourceId } = Route.useSearch()
	const navigate = useNavigate()

	function handleClose() {
		navigate({
			to: "/workspace/$urlName/tasks",
			params: { urlName },
			search: { view },
		})
	}

	return <NewTaskModal mode={mode} onClose={handleClose} sourceId={sourceId} />
}
