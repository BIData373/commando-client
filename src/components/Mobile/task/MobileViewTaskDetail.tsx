import styled from "@emotion/styled"
import type { TaskWithWorkspaceDto } from "src/api/model"
import MobileHeader from "../MobileHeader"
import { MobileTaskAssignees } from "./MobileTaskAssignees"
import { MobileTaskDryInfo } from "./MobileTaskDryInfo"

interface MobileViewTaskDetailProps {
	task?: TaskWithWorkspaceDto
}

export function MobileViewTaskDetail({ task }: MobileViewTaskDetailProps) {
	if (!task) {
		return null
	}
	return (
		<PageShell>
			<MobileHeader backRedirect={true} />
			<TaskContainer>
				<MobileTaskDryInfo task={task} />
				<MobileTaskAssignees task={task} />
			</TaskContainer>
		</PageShell>
	)
}

const PageShell = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
	overflow-y: auto;
`

const TaskContainer = styled.main`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
`
