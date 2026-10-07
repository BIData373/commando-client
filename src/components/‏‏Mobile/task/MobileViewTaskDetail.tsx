import styled from "@emotion/styled"
import type { TaskWithWorkspaceDto } from "src/api/model"
import MobileHeader from "../MobileHeader"
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
			<MobileHeader title="sdfisdf" backRedirect={true}></MobileHeader>
			<TaskContainer>
				<MobileTaskDryInfo task={task}></MobileTaskDryInfo>
			</TaskContainer>
		</PageShell>
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
