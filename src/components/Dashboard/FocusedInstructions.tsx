import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { useMemo, useState } from "react"
import {
	DeadlineType,
	type TaskRowDto,
	WorkspaceStatusType,
} from "src/api/model"
import { matchesQuickFilter } from "src/functions/filter-utils"
import { DASHBOARD_EMPTY_STATES } from "src/utils/empty-state-utils"
import { QuickFilter as FocusedTab, QuickFilter } from "src/utils/filter-utils"
import { EmptyCardState } from "../shared/EmptyCardState"
import { DashboardSection } from "./DashboardSection"
import { TaskPreviewTable } from "./TaskPreviewTable"
import { ViewMoreInstructions } from "./ViewMoreInstructions"

const VISIBLE_COLUMNS: (keyof TaskRowDto)[] = [
	"title",
	"status",
	"assignee",
	"deadlineType",
]

interface TabConfig {
	id: FocusedTab
	label: string
	count: number
	weekDelta: number
}

const TAB_LABELS: Pick<TabConfig, "id" | "label" | "weekDelta">[] = [
	{ id: FocusedTab.FLAGGED, label: "הנחיות חשובות", weekDelta: 0 },
	{ id: FocusedTab.APPROACHING, label: "הנחיות לביצוע מיידי", weekDelta: 0 },
	{ id: FocusedTab.OVERDUE, label: 'חריגות מתג"ב', weekDelta: 0 },
]

const TAB_FILTERS: Record<FocusedTab, (task: TaskRowDto) => boolean> = {
	[FocusedTab.FLAGGED]: (task) => matchesQuickFilter(task, QuickFilter.FLAGGED),
	[FocusedTab.APPROACHING]: (task) =>
		task.deadlineType === DeadlineType.IMMEDIATE,
	[FocusedTab.OVERDUE]: (task) => matchesQuickFilter(task, QuickFilter.OVERDUE),
}

interface FocusedInstructionProps {
	taskRows: TaskRowDto[]
	onUpdateStatusSuccess?(): void
	onClick?(taskId: number): void
}

export default function FocusedInstructions({
	taskRows,
	onUpdateStatusSuccess,
	onClick,
}: FocusedInstructionProps) {
	const [activeTab, setActiveTab] = useState<FocusedTab>(FocusedTab.FLAGGED)

	function handleTabClick(tabId: FocusedTab) {
		setActiveTab(tabId)
	}

	const notCompletedTasks = taskRows.filter(
		({ status }) => status?.type !== WorkspaceStatusType.COMPLETED,
	)

	const filteredTasks = useMemo(
		() => notCompletedTasks.filter(TAB_FILTERS[activeTab]),
		[activeTab, notCompletedTasks],
	)

	const tabs: TabConfig[] = useMemo(
		() =>
			TAB_LABELS.map((tab) => ({
				...tab,
				count: notCompletedTasks.filter(TAB_FILTERS[tab.id]).length,
			})),
		[notCompletedTasks],
	)

	return (
		<DashboardSection
			gap={0}
			tabButtons={
				<TabsButtons>
					<TabsHeader>
						{tabs.map((tab) => (
							<TabItem
								key={tab.id}
								$active={tab.id === activeTab}
								onClick={() => handleTabClick(tab.id)}
							>
								<TabTitle $active={tab.id === activeTab}>{tab.label}</TabTitle>
								<TabCount $active={tab.id === activeTab}>{tab.count}</TabCount>
							</TabItem>
						))}
					</TabsHeader>
					<ViewMoreInstructions
						tabFilter={
							activeTab === FocusedTab.APPROACHING ? undefined : activeTab
						}
						deadlineTypeFilter={
							activeTab === FocusedTab.APPROACHING
								? DeadlineType.IMMEDIATE
								: undefined
						}
					/>
				</TabsButtons>
			}
		>
			<TaskPreviewTable
				tasks={filteredTasks}
				visibleColumns={VISIBLE_COLUMNS}
				onUpdateStatusSuccess={onUpdateStatusSuccess}
				onClick={onClick}
				emptyState={<EmptyCardState {...DASHBOARD_EMPTY_STATES[activeTab]} />}
			/>
		</DashboardSection>
	)
}

const TabsButtons = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-width: 0;
`

const TabsHeader = styled.div`
  display: flex;
  position: relative;
  flex: 1;
  min-width: 0;
  max-width: 700px;
`

const TabItem = styled.button<{ $active: boolean }>`
  flex: 1;
  min-width: 0;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  cursor: pointer;
  margin-bottom: -1px;
  border: 1px solid var(--border);
  align-items: flex-start;
  background: ${({ $active }) => $active && "var(--background)"};
  border-color: ${({ $active }) => $active && "var(--Tabs-border-color)"};
  
  &:first-child {
	border-radius: 0 8px 0 0;
  }

  &:last-child {
	border-radius: 8px 0 0 0;
  }
`

const TabTitle = styled.span<{ $active: boolean }>`
  font-size: var(--fs-xl);
  font-weight: 400;
  white-space: nowrap;
  ${({ $active }) =>
		$active
			? css`
      background: linear-gradient(150deg, var(--purple-start) 0%, var(--purple-end) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    `
			: css`color: var(--sea-ink);`}
`

const TabCount = styled.span<{ $active: boolean }>`
  font-size: var(--fs-heading-3);
  font-weight: 400;
  line-height: 1.2;
  ${({ $active }) =>
		$active
			? css`
      background: linear-gradient(122deg, var(--purple-start) 0%, var(--purple-end) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    `
			: css`color: var(--foreground);`}
`
