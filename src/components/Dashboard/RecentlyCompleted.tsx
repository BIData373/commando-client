import styled from "@emotion/styled"
import { useMemo } from "react"
import { WorkspaceStatusType } from "src/api/model"
import { DASHBOARD_EMPTY_STATES } from "src/utils/empty-state-utils"
import type { TaskRow } from "src/utils/task-table-utils"
import { useTaskColumns } from "../../hooks/useTaskColumns"
import { EmptyCardState } from "../shared/EmptyCardState"
import { DataTable } from "../ui/data-table"
import { ViewMoreInstructions } from "./ViewMoreInstructions"

interface RecentlyCompletedProps {
	tasks: TaskRow[]
	onUpdateStatusSuccess?(): void
	onTaskDoubleClick?(taskId: number): void
}

export default function RecentlyCompleted({
	tasks,
	onUpdateStatusSuccess,
	onTaskDoubleClick,
}: RecentlyCompletedProps) {
	const completedTasks = useMemo(
		() => tasks.filter((t) => t.status?.type === WorkspaceStatusType.COMPLETED),
		[tasks],
	)

	const { columns } = useTaskColumns({
		onUpdateStatusSuccess,
		visibleColumns: ["title", "status", "assigneeStatuses"],
		searchQuery: "",
		onTitleDoubleClick: onTaskDoubleClick,
	})

	return (
		<Section>
			<TabsButtons>
				<SectionTitle>הנחיות שבוצעו לאחרונה</SectionTitle>
				<ViewMoreInstructions statusFilter={WorkspaceStatusType.COMPLETED} />
			</TabsButtons>
			<Card $hasContent={completedTasks.length > 0}>
				<DataTable
					columns={columns}
					data={completedTasks}
					showHeader={false}
					emptyState={<EmptyCardState {...DASHBOARD_EMPTY_STATES.completed} />}
				/>
			</Card>
		</Section>
	)
}

const Section = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 1300px) {
    grid-column: 1 / -1;
    grid-row: 3;
  }
`

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

const Card = styled.div<{ $hasContent: boolean }>`
  min-height: 352px;
  max-height: 352px;
  background: var(--background);
  border-radius: 8px;
  overflow: hidden;

  [data-slot="table-container"] {
    overflow-y: auto;
    max-height: 352px;
    direction: ltr;
  }

  table {
    direction: rtl;
  }

  [data-slot="table-row"] {
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.04);
    height: 44px;
  }

  [data-slot="table-row"]:last-of-type {
    border-bottom: none;
  }
  
  [data-slot="table-cell"] {
    height: 44px;
    padding-block: 0;
    vertical-align: middle;
    border-inline-start: 0.5px solid rgba(0, 0, 0, 0.04);
  }


  [data-slot="table-cell"]:first-child {
    border-inline-start: none;
    max-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  ${({ $hasContent }) =>
		$hasContent
			? `
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
    `
			: `
      display: flex;
      align-items: center;
      justify-content: center;
    `}
`
