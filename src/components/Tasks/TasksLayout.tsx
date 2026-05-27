import styled from "@emotion/styled";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import type { QuickFilter } from "src/utils/filterUtils";
import type { DirectiveStatus } from "src/utils/statusUtils";
import { exportTasksToExcel } from "../../functions/export-excel";
import { applyAllFilters } from "../../functions/filter-utils";
import { useTasks } from "../../providers/TasksProvider";
import { useTitleBar } from "../../providers/TitleBarProvider";
import type { DeadlineType } from "../shared/DeadlineTag";
import { MultiSelectFilterDropdown } from "../shared/MultiSelectFilterDropdown";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { TooltipProvider } from "../ui/tooltip";
import { NoResultsFound } from "./NoResultsFound";
import { TaskCardGrid } from "./TaskCardGrid";
import { TaskFilters } from "./TaskFilters";
import { TaskTable } from "./TaskTable";

export type View = "TABLE" | "CARDS";

export interface TasksLayoutProps {
	view: View;
	urlName: string;
	tabFilter: QuickFilter[];
	statusFilter: DirectiveStatus[];
	deadlineTypeFilter: DeadlineType[];
}

function TasksLayout({
	view,
	urlName,
	tabFilter,
	statusFilter,
	deadlineTypeFilter,
}: TasksLayoutProps) {
	const navigate = useNavigate();
	const {
		tasks,
		searchQuery,
		columnOrder,
		hiddenColumns,
		filteredTasks: baseFilteredTasks,
	} = useTasks();

	const tabFilterSet = new Set<QuickFilter>(tabFilter);

	const [activeTopicFilters, setActiveTopicFilters] = useState<Set<string>>(
		new Set(),
	);

	type PrevSearch = { tabFilter?: QuickFilter[]; statusFilter?: DirectiveStatus[]; deadlineTypeFilter?: DeadlineType[]; view?: View };

	function prevFilters(prev: PrevSearch) {
		return {
			tabFilter: prev.tabFilter ?? [],
			statusFilter: prev.statusFilter ?? [],
			deadlineTypeFilter: prev.deadlineTypeFilter ?? [],
		};
	}

	function navigateToTasks(overrides: { view?: View; tabFilter?: QuickFilter[]; statusFilter?: DirectiveStatus[]; deadlineTypeFilter?: DeadlineType[] } = {}) {
		navigate({
			to: "/workspace/$urlName/tasks",
			params: { urlName },
			search: (prev) => {
				const base = prevFilters(prev);
				return {
					view: overrides.view ?? prev.view ?? view,
					tabFilter: overrides.tabFilter ?? base.tabFilter,
					statusFilter: overrides.statusFilter ?? base.statusFilter,
					deadlineTypeFilter: overrides.deadlineTypeFilter ?? base.deadlineTypeFilter,
				};
			},
		});
	}

	function navigateWithMode(mode: "single" | "discussion") {
		navigate({
			to: "/workspace/$urlName/tasks/new",
			params: { urlName },
			search: (prev) => ({ view, mode, ...prevFilters(prev) }),
		});
	}

	function handleEdit(taskId: number) {
		navigate({
			to: "/workspace/$urlName/tasks/$taskId",
			params: { urlName, taskId: String(taskId) },
			search: (prev) => ({ view, ...prevFilters(prev) }),
		});
	}

	function handleCreateTask() {
		navigateWithMode("single")
	}

	function handleCreateTaskFromDiscussion() {
		navigateWithMode("discussion")
	}

	function handleToggleTabFilter(filter: QuickFilter) {
		const next = tabFilter.includes(filter)
			? tabFilter.filter((f) => f !== filter)
			: [...tabFilter, filter];
		navigateToTasks({ tabFilter: next });
	}

	function clearAllFilters() {
		setActiveTopicFilters(new Set());
		navigateToTasks({ tabFilter: [], statusFilter: [], deadlineTypeFilter: [] });
	}

	function handleColumnFiltersChange(
		newStatusFilter: DirectiveStatus[],
		newDeadlineTypeFilter: DeadlineType[],
	) {
		navigateToTasks({ statusFilter: newStatusFilter, deadlineTypeFilter: newDeadlineTypeFilter });
	}

	const allTopics = [...new Set(tasks.flatMap((t) => t.tags))];

	const filteredTasks = useMemo(
		() =>
			tabFilterSet.size > 0 || activeTopicFilters.size > 0
				? applyAllFilters(tasks, tabFilterSet, activeTopicFilters, searchQuery)
				: baseFilteredTasks,
		[tasks, searchQuery, tabFilterSet, activeTopicFilters, baseFilteredTasks],
	);

	function handleExport() {
		exportTasksToExcel(filteredTasks, { columnOrder, hiddenColumns });
	}

	function handleViewChange(newView: View) {
		navigateToTasks({ view: newView });
	}

	useTitleBar(
		() => (
			<ButtonGroup>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<CreateButton>
							<Plus size={18} color="white" />
							<CreateButtonText>צור הנחייה</CreateButtonText>
							<ChevronDown size={18} color="white" />
						</CreateButton>
					</DropdownMenuTrigger>
					<StyledDropdownContent align="end" sideOffset={6}>
						<StyledDropdownItem onSelect={handleCreateTaskFromDiscussion}>
							הנחיות מתוך דיון
						</StyledDropdownItem>
						<StyledDropdownItem onSelect={handleCreateTask}>
							הנחייה בודדת
						</StyledDropdownItem>
					</StyledDropdownContent>
				</DropdownMenu>
				<SectionDivider />
				<SegmentedControl>
					<SegmentedItem
						$selected={view === "CARDS"}
						onClick={() => handleViewChange("CARDS")}
					>
						כרטיסיות
					</SegmentedItem>
					<SegmentedItem
						$selected={view === "TABLE"}
						onClick={() => handleViewChange("TABLE")}
					>
						טבלה
					</SegmentedItem>
				</SegmentedControl>
			</ButtonGroup>
		),
		[view, urlName],
	);

	return (
		<TooltipProvider>
			<TasksRoot>
				<TaskFilters
					onClearAllFilters={clearAllFilters}
					onExport={handleExport}
					tabFilter={tabFilter}
					onToggleTabFilter={handleToggleTabFilter}
					hasExtraActiveFilters={activeTopicFilters.size > 0}
					extraFilters={
						<MultiSelectFilterDropdown
							label="נושא"
							options={allTopics.map((t) => ({ value: t, label: t }))}
							activeValues={activeTopicFilters}
							onApply={setActiveTopicFilters}
							$active={activeTopicFilters.size > 0}
						/>
					}
				/>

				{tasks.length === 0 ? (
					<NoResultsFound variant="empty" />
				) : searchQuery && filteredTasks.length === 0 ? (
					<NoResultsFound variant="no-search-results" />
				) : view === "TABLE" ? (
					<TaskTable
						tasks={filteredTasks}
						onEdit={handleEdit}
						statusFilter={statusFilter}
						deadlineTypeFilter={deadlineTypeFilter}
						onFiltersChange={handleColumnFiltersChange}
						onDoubleClick={handleEdit}
					/>
				) : (
					<TaskCardGrid tasks={filteredTasks} />
				)}
			</TasksRoot>
			<Outlet />
		</TooltipProvider>
	);
}

export default TasksLayout;

// ─── Layout ───────────────────────────────────────────────────────────────────

const TasksRoot = styled.div`
  padding-block: 24px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

// ─── Title Bar Actions ───────────────────────────────────────────────────────

const ButtonGroup = styled.div`
  direction: ltr;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CreateButton = styled.button`
  direction: rtl;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding-inline: 15px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(165deg, #615FFF 0%, #9810FA 100%);
  color: white;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  outline: none;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
    pointer-events: none;
  }

  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.85;
  }
`;

const CreateButtonText = styled.span`
  direction: rtl;
`;

const SectionDivider = styled.div`
  width: 1px;
  height: 39px;
  background: rgba(0, 0, 0, 0.15);
`;

const SegmentedControl = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 2px;
  background: var(--colors-base-neutral-3);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
`;

const SegmentedItem = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 100%;
  padding-inline: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
  background: ${({ $selected }) => ($selected ? "white" : "transparent")};
  color: ${({ $selected }) => ($selected ? "rgba(0, 0, 0, 0.88)" : "rgba(0, 0, 0, 0.65)")};
  box-shadow: ${({ $selected }) =>
		$selected
			? "0px 1px 2px 0px rgba(0, 0, 0, 0.03), 0px 1px 6px -1px rgba(0, 0, 0, 0.02), 0px 2px 4px 0px rgba(0, 0, 0, 0.02)"
			: "none"};
  &:hover {
    background: ${({ $selected }) => ($selected ? "white" : "rgba(0, 0, 0, 0.06)")};
  }
`;

// ─── Create Dropdown ─────────────────────────────────────────────────────────

const StyledDropdownContent = styled(DropdownMenuContent)`
  direction: rtl;
  min-width: var(--radix-dropdown-menu-trigger-width);
  padding: 4px;
  border-radius: 8px;
  box-shadow:
    0px 9px 28px 0px rgba(0, 0, 0, 0.05),
    0px 3px 6px -4px rgba(0, 0, 0, 0.12),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08);
`;

const StyledDropdownItem = styled(DropdownMenuItem)`
  direction: rtl;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 32px;
  padding-inline: 12px;
  padding-block: 5px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
  cursor: pointer;
`;
