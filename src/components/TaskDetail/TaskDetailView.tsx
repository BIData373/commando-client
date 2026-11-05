import type { NavigateOptions, RegisteredRouter } from "@tanstack/react-router"
import { useNavigate } from "@tanstack/react-router"
import type { TaskWithWorkspaceDto } from "src/api/model"
import { MobileViewTaskDetail } from "src/components/Mobile/task/MobileViewTaskDetail"
import { useIsMobile } from "src/hooks/use-mobile"
import TaskDetailPanel from "./TaskDetailPanel"

interface TaskDetailViewProps<
	TCloseTo extends string | undefined,
	TEditTo extends string | undefined,
> {
	task?: TaskWithWorkspaceDto
	showWorkspace?: boolean
	closeTo: NavigateOptions<RegisteredRouter, string, TCloseTo>
	editTo?: NavigateOptions<RegisteredRouter, string, TEditTo>
	isArchived?: boolean
	isPersonal?: boolean
}

function TaskDetailView<
	TCloseTo extends string | undefined,
	TEditTo extends string | undefined,
>({
	task,
	showWorkspace,
	closeTo,
	editTo,
	isArchived = false,
	isPersonal = false,
}: TaskDetailViewProps<TCloseTo, TEditTo>) {
	const navigate = useNavigate()
	const isMobile = useIsMobile()

	if (!task) {
		return null
	}

	return isMobile ? (
		<MobileViewTaskDetail task={task} />
	) : (
		<TaskDetailPanel
			task={task}
			showWorkspace={showWorkspace}
			onClose={() => navigate(closeTo)}
			onEdit={editTo ? () => navigate(editTo) : undefined}
			isArchived={isArchived}
			isPersonal={isPersonal}
		/>
	)
}

export default TaskDetailView
