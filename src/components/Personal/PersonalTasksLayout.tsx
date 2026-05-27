import styled from "@emotion/styled";
import type { ColumnDef } from "@tanstack/react-table";
import { isThisWeek } from "date-fns";
import { useMemo, useState } from "react";
import {
	PERSONAL_TASKS,
	type PersonalTask,
	type Workspace,
} from "../../data/PersonalTasks";
import type { Task } from "../../data/Tasks";
import type { TaskColumn } from "../../hooks/useTaskColumns";
import { useTasks } from "../../providers/TasksProvider";
import { useTitleBar } from "../../providers/TitleBarProvider";
import { MultiSelectFilterDropdown } from "../shared/MultiSelectFilterDropdown";
import { ColumnHeaderWithActions } from "../Tasks/ColumnHeaderWithActions";
import { NoResultsFound } from "../Tasks/NoResultsFound";
import { TaskFilters } from "../Tasks/TaskFilters";
import type { TasksLayoutProps, View } from "../Tasks/TasksLayout";
import { TaskTable } from "../Tasks/TaskTable";
import { TooltipProvider } from "../ui/tooltip";
import { MetricsBar } from "./MetricsBar";

const WORKSPACE_COLUMN: ColumnDef<Task> = {
	id: "workspace",
	accessorFn: (row) => (row as PersonalTask).workspace.name,
	header: ({ column }) => (
		<ColumnHeaderWithActions label="מפקד מנחה" column={column} />
	),
	size: 170,
	enableColumnFilter: false,
	sortingFn: (rowA, rowB) =>
		(rowA.original as PersonalTask).workspace.name.localeCompare(
			(rowB.original as PersonalTask).workspace.name,
			"he",
		),
	cell: ({ row }) => {
		const { workspace } = row.original as PersonalTask;
		return (
			<WorkspaceCell>
				<WorkspaceIconImg src={workspace.iconUrl} alt={workspace.name} />
				<WorkspaceCellName>{workspace.name}</WorkspaceCellName>
			</WorkspaceCell>
		);
	},
};

const EXTRA_COLUMNS: Record<string, ColumnDef<Task>> = {
	workspace: WORKSPACE_COLUMN,
};

function PersonalTasksLayout({ view, urlName }: TasksLayoutProps) {
	const {
		tasks,
		clearQuickFilters,
		searchQuery,
		filteredTasks: baseFilteredTasks,
	} = useTasks();
	const [activeWorkspaceFilters, setActiveWorkspaceFilters] = useState<
		Set<number>
	>(new Set());

	const workspaces = useMemo(() => {
		const map = new Map<number, Workspace>();
		(tasks as PersonalTask[]).forEach((t) => {
			map.set(t.workspace.id, t.workspace);
		});
		return [...map.values()];
	}, [tasks]);

	const totalCount = tasks.length;
	const notStartedCount = tasks.filter(
		(t) => t.status === "not_started",
	).length;
	const inProgressCount = tasks.filter(
		(t) => t.status === "in_progress",
	).length;
	const weeklyNew = tasks.filter((t) =>
		isThisWeek(t.createdAt, { weekStartsOn: 0 }),
	).length;

	function clearAllFilters() {
		clearQuickFilters();
		setActiveWorkspaceFilters(new Set());
	}

	const filteredTasks = useMemo(() => {
		let result = baseFilteredTasks as PersonalTask[];

		if (activeWorkspaceFilters.size > 0) {
			result = result.filter((t) => activeWorkspaceFilters.has(t.workspace.id));
		}

		return result;
	}, [baseFilteredTasks, activeWorkspaceFilters]);

	function handleExport() {
		// placeholder for export
	}

	function handleViewChange(newView: View) {
		return newView;
		// placeholder for view change
	}

	useTitleBar(
		() => (
			<SegmentedControl>
				<SegmentedItem
					$selected={view === "TABLE"}
					onClick={() => handleViewChange("TABLE")}
				>
					טבלה
				</SegmentedItem>
				<SegmentedItem
					$selected={view === "CARDS"}
					onClick={() => handleViewChange("CARDS")}
				>
					כרטיסיות
				</SegmentedItem>
			</SegmentedControl>
		),
		[view, urlName],
	);

	return (
		<TooltipProvider>
			<PageRoot>
				<MetricsBar
					totalCount={totalCount}
					notStartedCount={notStartedCount}
					inProgressCount={inProgressCount}
					weeklyNew={weeklyNew}
				/>

				<TaskFilters
					onClearAllFilters={clearAllFilters}
					onExport={handleExport}
					hasExtraActiveFilters={activeWorkspaceFilters.size > 0}
					extraColumnsMeta={[
						{ id: "workspace" as TaskColumn, label: "מפקד מנחה" },
					]}
					extraFilters={
						<MultiSelectFilterDropdown
							label={
								activeWorkspaceFilters.size > 0
									? `סביבות (${activeWorkspaceFilters.size})`
									: "כל הסביבות"
							}
							options={workspaces.map((ws) => ({
								value: ws.id,
								label: ws.name,
								icon: <WorkspaceIcon src={ws.iconUrl} alt={ws.name} />,
							}))}
							activeValues={activeWorkspaceFilters}
							onApply={setActiveWorkspaceFilters}
							$active={activeWorkspaceFilters.size > 0}
						/>
					}
				/>

				{tasks.length === 0 ? (
					<NoResultsFound variant="empty" />
				) : searchQuery && filteredTasks.length === 0 ? (
					<NoResultsFound variant="no-search-results" />
				) : (
					<TaskTable
						tasks={filteredTasks as Task[]}
						extraColumns={EXTRA_COLUMNS}
					/>
				)}
			</PageRoot>
		</TooltipProvider>
	);
}

export default PersonalTasksLayout;

const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 32px;
  gap: 28px;
  height: 100%;
  overflow: hidden;
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
  background: ${({ $selected }) => ($selected ? "var(--background)" : "transparent")};
  color: ${({ $selected }) => ($selected ? "rgba(0, 0, 0, 0.88)" : "var(--text-color)")};
  box-shadow: ${({ $selected }) => ($selected ? "var(--card-shadow-default)" : "none")};
  &:hover {
    background: ${({ $selected }) => ($selected ? "var(--background)" : "rgba(0, 0, 0, 0.06)")};
  }
`;

const WorkspaceIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
`;

const WorkspaceCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
`;

const WorkspaceCellName = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const WorkspaceIconImg = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;
