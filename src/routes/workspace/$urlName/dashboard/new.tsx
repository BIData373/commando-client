import { createFileRoute, useNavigate } from "@tanstack/react-router"
import {
	NewTaskModal,
	newTaskSearchSchema,
} from "src/components/shared/NewTaskModal"

export const Route = createFileRoute("/workspace/$urlName/dashboard/new")({
	component: DashboardNewTask,
	validateSearch: newTaskSearchSchema,
})

function DashboardNewTask() {
	const { urlName } = Route.useParams()
	const { mode } = Route.useSearch()
	const navigate = useNavigate()

	function handleClose() {
		navigate({
			to: "/workspace/$urlName/dashboard",
			params: { urlName },
		})
	}

	return <NewTaskModal mode={mode} onClose={handleClose} />
}
