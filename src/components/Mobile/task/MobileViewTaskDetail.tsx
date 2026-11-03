import styled from "@emotion/styled"
import { useRouter } from "@tanstack/react-router"
import type { TaskWithWorkspaceDto } from "src/api/model"
import MobileHeader from "../MobileHeader"
import { MobileTaskAssignees } from "./MobileTaskAssignees"
import { MobileTaskComments } from "./MobileTaskComments"
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
				<MobileHeader variant="task" onBack={handleBackRedirect} />
				<TaskContainer>
					<MobileTaskInfo task={task} />
					<Wrapper>
						<MobileTaskAssignees task={task} />
						<MobileTaskComments task={task} />
					</Wrapper>
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

const TaskContainer = styled.div`
	flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
	overflow-y: auto;
	min-height: 0;

	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}
`

const Wrapper = styled.div`
	background: white;
	border-radius: 8px;
`
