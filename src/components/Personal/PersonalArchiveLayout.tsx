import styled from "@emotion/styled"
import type { ColumnDef } from "@tanstack/react-table"
import { useToggleUserTaskArchive } from "src/api/archived-user-assignee-task/archived-user-assignee-task"
import type { TaskRowWithWorkspaceDto } from "src/api/model"
import { useListPersonalTaskRows } from "src/api/task/task"
import { formatDateShort } from "src/functions/date-utils"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import type { TaskArchiveEntry } from "src/hooks/useTaskColumns"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { invalidateQueries } from "src/queryClient"
import WorkspaceCell from "../shared/WorkspaceCell"
import { ColumnHeaderWithActions } from "../Tasks/ColumnHeaderWithActions"
import { TaskFilters } from "../Tasks/TaskFilters"
import { TaskTable } from "../Tasks/TaskTable"
import { TooltipProvider } from "../ui/tooltip"
import { PersonalSectionDropdown } from "./PersonalSectionDropdown"

const ARCHIVE_EXTRA_COLUMNS: ColumnDef<TaskRowWithWorkspaceDto>[] = [
	{
		id: "workspace",
		header: ({ column }) => (
			<ColumnHeaderWithActions label="מפקד מנחה" column={column} />
		),
		size: 170,
		enableColumnFilter: false,
		sortingFn: (rowA, rowB) => {
			const a = rowA.original.workspace?.title ?? ""
			const b = rowB.original.workspace?.title ?? ""
			return a.localeCompare(b, "he")
		},
		accessorFn: (row) => row.workspace?.title,
		cell: ({
			row: {
				original: { workspace },
			},
		}) => <WorkspaceCell workspace={workspace} />,
	},
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
		}) => <DateCell>{archivedAt && formatDateShort(archivedAt)}</DateCell>,
	},
]

function PersonalArchiveLayout() {
	const { columnOrder, hiddenColumns } = useTasksFilters()

	const {
		data: tasks = [],
		isLoading,
		queryKey,
	} = useListPersonalTaskRows({ isArchived: true })

	const { mutate: toggleArchive } = useToggleUserTaskArchive({
		mutation: { onSuccess: handleChangeSuccess },
	})

	const filteredTasks = useFilteredTasks(tasks)

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
			<PersonalSectionDropdown current="archive" />
			<PageRoot>
				<TaskFilters
					allTaskRows={tasks}
					filteredTasks={filteredTasks}
					columnOrder={columnOrder}
					hiddenColumns={hiddenColumns}
					extraColumns={ARCHIVE_EXTRA_COLUMNS}
					extraColumnsMeta={[
						{ id: "workspace", label: "מפקד מנחה" },
						{ id: "archivedAt", label: "הועבר לארכיון" },
					]}
					exportFilePrefix="ארכיון אישי"
				/>
				<TaskTable<TaskRowWithWorkspaceDto>
					tasks={filteredTasks}
					isLoading={isLoading}
					hideStatusAction
					showActionsColumn={true}
					columnOrder={columnOrder}
					hiddenColumns={hiddenColumns}
					onChangeSuccess={handleChangeSuccess}
					getPermissionType={(task) => task?.workspace?.permissionType}
					extraColumns={ARCHIVE_EXTRA_COLUMNS}
					onUnarchive={handleUnarchive}
				/>
			</PageRoot>
		</TooltipProvider>
	)
}

export default PersonalArchiveLayout

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
