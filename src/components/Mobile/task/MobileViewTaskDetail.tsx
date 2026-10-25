import styled from "@emotion/styled"
import { useRouter } from "@tanstack/react-router"
import type { TaskWithWorkspaceDto } from "src/api/model"
import MobileHeader from "../MobileHeader"
import { MobileTaskInfo } from "./MobileTaskInfo"

interface MobileViewTaskDetailProps {
	task?: TaskWithWorkspaceDto
}

export function MobileViewTaskDetail({ task }: MobileViewTaskDetailProps) {
	const router = useRouter()

	function handleBackRedirect() {
		router.history.back()
	}

	return (
		task && (
			<PageShell>
				<MobileHeader variant="task" onBack={handleBackRedirect} title="" />
				<TaskContainer>
					<MobileTaskInfo task={task} />
				</TaskContainer>
			</PageShell>
		)
	)
}

const PageShell = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
`

const TaskContainer = styled.main`
    display: flex;
    flex-direction: column;
    padding: 1rem;
`
