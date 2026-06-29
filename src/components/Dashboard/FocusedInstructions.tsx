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
import { DashboardTableCard } from "./DashboardTableCard"
import { ViewMoreInstructions } from "./ViewMoreInstructions"

interface TabConfig {
	id: FocusedTab
	label: string
	count: number
	weekDelta: number
}

const TAB_LABELS: Pick<TabConfig, "id" | "label" | "weekDelta">[] = [
	{ id: FocusedTab.FLAGGED, label: "הנחיות חשובות", weekDelta: 0 },
	{ id: FocusedTab.APPROACHING, label: "הנחיות לביצוע מידיות", weekDelta: 0 },
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
}

export default function FocusedInstructions({
	tasks,
	onUpdateStatusSuccess,
}: FocusedInstructionProps) {
	const [activeTab, setActiveTab] = useState<FocusedTab>(FocusedTab.FLAGGED)

	function handleTabClick(tabId: FocusedTab) {
		setActiveTab(tabId)
	}

	const filteredTasks = useMemo(
		() => getFilteredTasks(activeTab, tasks).slice(0, 7),
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
	})

	return (
		<DashboardSection
			title="הנחיות במיקוד"
			viewMore={
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
			}
		>
			<TabsWrapper>
				<TabsHeader>
					{tabs.map((tab) => (
						<TabItem
							key={tab.id}
							$active={tab.id === activeTab}
							onClick={() => handleTabClick(tab.id)}
						>
							<TabTitle $active={tab.id === activeTab}>{tab.label}</TabTitle>
							<TabBottom>
								<TabCount $active={tab.id === activeTab}>{tab.count}</TabCount>
							</TabBottom>
						</TabItem>
					))}
				</TabsHeader>
				<ContentPanel>
					<StyledTable
						columns={columns}
						data={filteredTasks}
						showHeader={false}
						emptyState={
							<EmptyCardState {...DASHBOARD_EMPTY_STATES[activeTab]} />
						}
						containerClassName="overflow-hidden"
					/>
				</ContentPanel>
			</TabsWrapper>
		</DashboardSection>
	)
}

const TabsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const TabsHeader = styled.div`
  display: flex;
  gap: 2px;
  position: relative;
  max-width: 840px;
`

const TabItem = styled.button<{ $active: boolean }>`
  word-wrap: break-word;
  min-width: 0;
  padding: 8px 16px;
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  margin-bottom: -1px;
  align-items: flex-start;
  flex: 1;
  border-width: 1px;
  border-style: solid;

  ${({ $active }) =>
		$active
			? css`
		border-bottom-color: var(--background);
		background: var(--background);
		opacity: 1;
		border-color: #f5f5f5;
	`
			: css`
		border-bottom-color: var(--border);
		background: var(--transparent);
		opacity: 0.5;
		border-color: var(--border);
	`}
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

const TabBottom = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
`

const TabCount = styled.span<{ $active: boolean }>`
  font-size: var(--fs-heading-1);
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

const ContentPanel = styled(DashboardTableCard)`
  flex: none;
  background: var(--background);
  border-radius: 8px;
  border-start-start-radius: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 308px;
  overflow: hidden;
  min-width: 0;
  width: 100%;
`

const StyledTable = styled(DataTable<TaskRow>)`
	width: 100%;
`
