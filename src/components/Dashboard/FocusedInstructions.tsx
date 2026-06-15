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
		() =>
			getFilteredTasks(activeTab, tasks)
				.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
				.slice(0, 7),
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
	})

	return (
		<Section>
			<SectionTitle>הנחיות במיקוד</SectionTitle>
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
					<DataTable
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
			<ViewMoreInstructions
				tabFilter={activeTab === FocusedTab.APPROACHING ? undefined : activeTab}
				deadlineTypeFilter={
					activeTab === FocusedTab.APPROACHING
						? DeadlineType.IMMEDIATE
						: undefined
				}
			/>
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
    grid-row: 1;
  }
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: var(--fs-heading-2);
  font-weight: 400;
  color: var(--sea-ink);
  text-align: start;
`

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
  border: 1px solid var(--border);
  border-bottom-color: ${({ $active }) => ($active ? "var(--background)" : "var(--border)")};
  border-radius: 6px 6px 0 0;
  background: ${({ $active }) => ($active ? "var(--background)" : "transparent")};
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  cursor: pointer;
  margin-bottom: -1px;
  align-items: flex-start;
  flex: 1;
`

const TabTitle = styled.span<{ $active: boolean }>`
  font-size: var(--fs-xl);
  font-weight: 400;
  ${({ $active }) =>
		$active
			? `
      background: linear-gradient(150deg, var(--purple-start) 0%, var(--purple-end) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    `
			: `color: var(--sea-ink);`}
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
			? `
      background: linear-gradient(122deg, var(--purple-start) 0%, var(--purple-end) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    `
			: `color: var(--foreground);`}
`

const ContentPanel = styled.div`
  flex: none;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
  border-start-start-radius: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 308px;
  overflow: hidden;

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
`
