import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { useMemo } from "react"
import {
	DeadlineType,
	type TaskRowDto,
	WorkspaceStatusType,
} from "src/api/model"
import {
	QuickFilter as FocusedTab,
	QuickFilter,
} from "src/api/model/quick-filter"
import { matchesQuickFilter } from "src/functions/filter-utils"
import { useUserView } from "src/providers/UserViewProvider"
import { getDeadlineDisplayDate } from "src/utils/deadline-utils"
import { DASHBOARD_EMPTY_STATES } from "src/utils/empty-state-utils"
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
	{ id: FocusedTab.flagged, label: "הנחיות חשובות", weekDelta: 0 },
	{ id: FocusedTab.approaching, label: "הנחיות לביצוע מיידי", weekDelta: 0 },
	{ id: FocusedTab.overdue, label: 'חריגות מתג"ב', weekDelta: 0 },
]

const TAB_FILTERS: Record<FocusedTab, (task: TaskRowDto) => boolean> = {
	[FocusedTab.flagged]: (task) => matchesQuickFilter(task, QuickFilter.flagged),
	[FocusedTab.approaching]: (task) =>
		task.deadlineType === DeadlineType.IMMEDIATE,
	[FocusedTab.OVERDUE]: (task) =>
		matchesQuickFilter(task, QuickFilter.OVERDUE) ||
		task.deadlineType === DeadlineType.IMMEDIATE,
}

function compareByDeadlineDate(a: TaskRowDto, b: TaskRowDto): number {
	const dateA = getDeadlineDisplayDate(
		a.deadlineType,
		a.dueDate,
		a.source,
		a.createdAt,
	)
	const dateB = getDeadlineDisplayDate(
		b.deadlineType,
		b.dueDate,
		b.source,
		b.createdAt,
	)

	if (!dateA && !dateB) return 0
	if (!dateA) return 1
	if (!dateB) return -1

	return dateA.getTime() - dateB.getTime()
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
	const { view, updateView } = useUserView()

	const activeTab = view.dashboard.focusedInstructionsTab

	async function handleTabClick(focusedInstructionsTab: FocusedTab) {
		await updateView({
			...view,
			dashboard: {
				...view.dashboard,
				focusedInstructionsTab,
			},
		})
	}
	const notCompletedTasks = taskRows.filter(
		({ status }) => status?.type !== WorkspaceStatusType.COMPLETED,
	)

	const filteredTasks = useMemo(
		() =>
			notCompletedTasks
				.filter(TAB_FILTERS[activeTab])
				.sort(compareByDeadlineDate),
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
						quickFilter={
							activeTab === FocusedTab.approaching ? undefined : activeTab
						}
						deadlineTypeFilter={
							activeTab === FocusedTab.approaching
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
