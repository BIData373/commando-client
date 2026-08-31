import styled from "@emotion/styled"
import { useMemo } from "react"
import { type TaskRowDto, WorkspaceStatusType } from "src/api/model"
import { DASHBOARD_EMPTY_STATES } from "src/utils/empty-state-utils"
import { EmptyCardState } from "../shared/EmptyCardState"
import { DashboardSection } from "./DashboardSection"
import { TaskPreviewTable } from "./TaskPreviewTable"
import { ViewMoreInstructions } from "./ViewMoreInstructions"

const VISIBLE_COLUMNS: (keyof TaskRowDto)[] = ["title", "status", "assignee"]

interface RecentlyCompletedProps {
	tasks: TaskRowDto[]
	onClick?(taskId: number): void
}

export default function RecentlyCompleted({
	tasks,
	onClick,
}: RecentlyCompletedProps) {
	const completedTasks = useMemo(
		() => tasks.filter((t) => t.status?.type === WorkspaceStatusType.COMPLETED),
		[tasks],
	)

	return (
		<DashboardSection
			gap={20}
			tabButtons={
				<TabsButtons>
					<SectionTitle>הנחיות שבוצעו</SectionTitle>
					<ViewMoreInstructions statusFilter={WorkspaceStatusType.COMPLETED} />
				</TabsButtons>
			}
		>
			<TaskPreviewTable
				tasks={completedTasks}
				visibleColumns={VISIBLE_COLUMNS}
				onClick={onClick}
				emptyState={<EmptyCardState {...DASHBOARD_EMPTY_STATES.completed} />}
			/>
		</DashboardSection>
	)
}

const TabsButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SectionTitle = styled.h2`
  margin: 0;
  line-height: 1;
  font-size: var(--fs-xl);
  font-weight: 400;
  color: var(--sea-ink);
  text-align: start;
`
