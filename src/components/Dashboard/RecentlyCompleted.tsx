import styled from "@emotion/styled"
import { useMemo } from "react"
import { type TaskRowDto, WorkspaceStatusType } from "src/api/model"
import { DASHBOARD_EMPTY_STATES } from "src/utils/empty-state-utils"
import { useTaskColumns } from "../../hooks/useTaskColumns"
import { EmptyCardState } from "../shared/EmptyCardState"
import { DataTable } from "../ui/data-table"
import { DashboardSection } from "./DashboardSection"
import { ViewMoreInstructions } from "./ViewMoreInstructions"

interface RecentlyCompletedProps {
	tasks: TaskRowDto[]
	onUpdateStatusSuccess?(): void
	onDoubleClick?(taskId: number): void
}

export default function RecentlyCompleted({
	tasks,
	onUpdateStatusSuccess,
	onDoubleClick,
}: RecentlyCompletedProps) {
	const completedTasks = useMemo(
		() => tasks.filter((t) => t.status?.type === WorkspaceStatusType.COMPLETED),
		[tasks],
	)

	const { columns } = useTaskColumns({
		onUpdateStatusSuccess,
		visibleColumns: ["title", "status", "assignee"],
		showMenuColumn: false,
		actions: {
			onDoubleClick,
		},
	})

	return (
		<DashboardSection
			gap={20}
			tabButtons={
				<TabsButtons>
					<SectionTitle>הנחיות שבוצעו לאחרונה</SectionTitle>
					<ViewMoreInstructions statusFilter={WorkspaceStatusType.COMPLETED} />
				</TabsButtons>
			}
		>
			<DataTable
				columns={columns}
				data={completedTasks}
				showHeader={false}
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
