import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { useMemo } from "react"
import { WorkspaceStatusType } from "src/api/model"
import { DASHBOARD_EMPTY_STATES } from "src/utils/empty-state-utils"
import type { TaskRow } from "src/utils/task-table-utils"
import { useTaskColumns } from "../../hooks/useTaskColumns"
import { EmptyCardState } from "../shared/EmptyCardState"
import { DataTable } from "../ui/data-table"
import { DashboardSection } from "./DashboardSection"
import { DashboardTableCard } from "./DashboardTableCard"
import { ViewMoreInstructions } from "./ViewMoreInstructions"

interface RecentlyCompletedProps {
	tasks: TaskRow[]
	onUpdateStatusSuccess?(): void
}

export default function RecentlyCompleted({
	tasks,
	onUpdateStatusSuccess,
}: RecentlyCompletedProps) {
	const completedTasks = useMemo(
		() => tasks.filter((t) => t.status?.type === WorkspaceStatusType.COMPLETED),
		[tasks],
	)

	const { columns } = useTaskColumns({
		onUpdateStatusSuccess,
		visibleColumns: ["title", "status", "assigneeStatuses"],
	})

	return (
		<DashboardSection
			title="הנחיות שבוצעו לאחרונה"
			viewMore={
				<ViewMoreInstructions statusFilter={WorkspaceStatusType.COMPLETED} />
			}
		>
			<Card $hasContent={completedTasks.length > 0}>
				<DataTable
					columns={columns}
					data={completedTasks}
					showHeader={false}
					emptyState={<EmptyCardState {...DASHBOARD_EMPTY_STATES.completed} />}
					containerClassName="overflow-hidden"
				/>
			</Card>
		</DashboardSection>
	)
}

const Card = styled(DashboardTableCard)<{ $hasContent: boolean }>`
  flex: none;
  background: var(--background);
  border-radius: 8px;
  height: 308px;
  overflow: hidden;
  box-shadow: 0 1px 2px oklch(0 0 0 / 0.03), 0 1px 6px -1px oklch(0 0 0 / 0.02), 0 2px 4px oklch(0 0 0 / 0.02);
  ${({ $hasContent }) =>
		$hasContent
			? css`
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
    `
			: css`
      display: flex;
      align-items: center;
      justify-content: center;
    `}
`
