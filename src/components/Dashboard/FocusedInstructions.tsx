import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { useMemo, useState } from "react"
import { DeadlineType } from "src/api/model"
import { matchesQuickFilter } from "src/functions/filter-utils"
import { DASHBOARD_EMPTY_STATES } from "src/utils/empty-state-utils"
import { QuickFilter as FocusedTab, QuickFilter } from "src/utils/filter-utils"
import type { TaskRow } from "src/utils/task-table-utils"
import { useTaskColumns } from "../../hooks/useTaskColumns"
import { EmptyCardState } from "../shared/EmptyCardState"
import { DataTable } from "../ui/data-table"
import { DashboardSection } from "./DashboardSection"
import { ViewMoreInstructions } from "./ViewMoreInstructions"

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

function getFilteredTasks(tab: FocusedTab, tasks: TaskRow[]): TaskRow[] {
	switch (tab) {
		case FocusedTab.FLAGGED:
			return tasks.filter((t) => matchesQuickFilter(t, QuickFilter.FLAGGED))
		case FocusedTab.APPROACHING:
			return tasks.filter((t) => t.deadlineType === DeadlineType.IMMEDIATE)
		case FocusedTab.OVERDUE:
			return tasks.filter((t) => matchesQuickFilter(t, QuickFilter.OVERDUE))
	}
}

interface FocusedInstructionProps {
	tasks: TaskRow[]
	onUpdateStatusSuccess?(): void
	onTaskDoubleClick?(taskId: number): void
}

export default function FocusedInstructions({
	tasks,
	onUpdateStatusSuccess,
	onTaskDoubleClick,
}: FocusedInstructionProps) {
	const [activeTab, setActiveTab] = useState<FocusedTab>(FocusedTab.FLAGGED)

	function handleTabClick(tabId: FocusedTab) {
		setActiveTab(tabId)
	}

	const filteredTasks = useMemo(
		() => getFilteredTasks(activeTab, tasks),
		[activeTab, tasks],
	)

	const tabs: TabConfig[] = TAB_LABELS.map((tab) => ({
		...tab,
		count:
			tab.id === FocusedTab.FLAGGED
				? tasks.filter((t) => matchesQuickFilter(t, QuickFilter.FLAGGED)).length
				: tab.id === FocusedTab.APPROACHING
					? tasks.filter((t) => t.deadlineType === DeadlineType.IMMEDIATE)
							.length
					: tasks.filter((t) => matchesQuickFilter(t, QuickFilter.OVERDUE))
							.length,
	}))

	const { columns } = useTaskColumns({
		onUpdateStatusSuccess,
		visibleColumns: ["title", "status", "assigneeStatuses", "deadlineType"],
		searchQuery: "",
		onTitleDoubleClick: onTaskDoubleClick,
	})

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
			<DataTable
				columns={columns}
				data={filteredTasks}
				showHeader={false}
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
  gap: 2px;
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
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  margin-bottom: -1px;
  border: 1px solid var(--line);
  align-items: flex-start;
`

const TabTitle = styled.span<{ $active: boolean }>`
  font-size: var(--fs-xl);
  font-weight: 400;
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
