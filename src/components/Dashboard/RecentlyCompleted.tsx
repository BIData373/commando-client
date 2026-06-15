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
		searchQuery: "",
	})

	return (
		<Section>
			<SectionTitle>הנחיות שבוצעו לאחרונה</SectionTitle>
			<Card $hasContent={completedTasks.length > 0}>
				<DataTable
					columns={columns}
					data={completedTasks}
					showHeader={false}
					emptyState={<EmptyCardState {...DASHBOARD_EMPTY_STATES.completed} />}
					containerClassName="overflow-hidden"
				/>
			</Card>
			<ViewMoreInstructions statusFilter={WorkspaceStatusType.COMPLETED} />
		</Section>
	)
}

const Section = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 1300px) {
    grid-column: 1 / -1;
    grid-row: 3;
  }
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: var(--fs-heading-2);
  font-weight: 400;
  color: var(--sea-ink);
  text-align: start;
`

const Card = styled.div<{ $hasContent: boolean }>`
  flex: none;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
  height: 308px;
  overflow: hidden;
  box-shadow: 0 1px 2px oklch(0 0 0 / 0.03), 0 1px 6px -1px oklch(0 0 0 / 0.02), 0 2px 4px oklch(0 0 0 / 0.02);

  [data-slot="table-row"] {
    border-bottom: none;
    height: 44px;
  }

  [data-slot="table-cell"] {
    height: 44px;
    padding-block: 0;
    vertical-align: middle;
  }

  [data-slot="table-cell"]:first-child {
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
