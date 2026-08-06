import styled from "@emotion/styled"
import type { ColumnDef } from "@tanstack/react-table"
import { without } from "lodash"
import { useMemo } from "react"
import { useToggleWorkspaceTaskArchive } from "src/api/archived-workspace-assignee/archived-workspace-assignee"
import type { TaskRowDto } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { useListTaskRows } from "src/api/task/task"
import { formatDateShort } from "src/functions/date-utils"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import type { TaskArchiveEntry } from "src/hooks/useTaskColumns"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { invalidateQueries } from "src/queryClient"
import { TooltipProvider } from "../ui/tooltip"
import { ColumnHeaderWithActions } from "./ColumnHeaderWithActions"
import { TaskFilters } from "./TaskFilters"
import { TaskTable } from "./TaskTable"

const ARCHIVE_EXTRA_COLUMNS: ColumnDef<TaskRowDto>[] = [
	{
		id: "archivedAt",
		header: ({ column }) => (
			<ColumnHeaderWithActions label="הועבר לארכיון" column={column} />
		),
		size: 140,
		enableColumnFilter: false,
		accessorFn: (row) => row.archivedAt,
		cell: ({
			row: {
				original: { archivedAt },
			},
		}) => (
			<DateCell>{archivedAt && formatDateShort(new Date(archivedAt))}</DateCell>
		),
	},
]

function WorkspaceArchiveLayout() {
	const { columnOrder, hiddenColumns } = useTasksFilters()

	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	const {
		data: tasks = [],
		isLoading,
		queryKey,
	} = useListTaskRows({ workspaceId, isArchived: true })

	const { data: myPermission } = useGetMyPermission({ workspaceId })

	const { mutate: toggleArchive } = useToggleWorkspaceTaskArchive({
		mutation: { onSuccess: handleChangeSuccess },
	})

	const filteredTasks = useFilteredTasks(tasks)

	const noWorkspaceColumnOrder = useMemo(
		() => without(columnOrder, "workspace") as (keyof TaskRowDto)[],
		[columnOrder],
	)

	const noWorkspaceHiddenColumns = useMemo(
		() => new Set([...hiddenColumns].filter((item) => item !== "workspace")),
		[hiddenColumns],
	)

	function handleChangeSuccess() {
		invalidateQueries([queryKey])
	}

	function handleUnarchive(entries: TaskArchiveEntry[]) {
		entries.forEach(({ id, assigneeId }) => {
			toggleArchive({ pathParams: { id }, params: { assigneeId } })
		})
	}

	return (
		<TooltipProvider>
			<PageRoot>
				<TaskFilters<TaskRowDto>
					allTaskRows={tasks}
					filteredTasks={filteredTasks}
					columnOrder={noWorkspaceColumnOrder}
					hiddenColumns={noWorkspaceHiddenColumns}
					extraColumns={ARCHIVE_EXTRA_COLUMNS}
					extraColumnsMeta={[{ id: "archivedAt", label: "הועבר לארכיון" }]}
					exportFilePrefix="ארכיון סביבה"
				/>
				<TaskTable<TaskRowDto>
					tasks={filteredTasks}
					isLoading={isLoading}
					hideStatusAction
					showActionsColumn={true}
					columnOrder={noWorkspaceColumnOrder}
					hiddenColumns={noWorkspaceHiddenColumns}
					getPermissionType={() => myPermission?.type}
					onChangeSuccess={handleChangeSuccess}
					extraColumns={ARCHIVE_EXTRA_COLUMNS}
					onUnarchive={handleUnarchive}
				/>
			</PageRoot>
		</TooltipProvider>
	)
}

export default WorkspaceArchiveLayout

const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  padding-block-end: 24px;
  gap: 28px;
  height: 100%;
  overflow: hidden;
`

const DateCell = styled.span`
  font-size: var(--fs-sm);
  color: var(--sea-ink-soft);
  padding-inline: 6px;
`
