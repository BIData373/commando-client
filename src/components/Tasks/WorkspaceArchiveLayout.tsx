import styled from "@emotion/styled"
import type { ColumnDef } from "@tanstack/react-table"
import {
	getListWorkspaceArchivedTasksQueryKey,
	useListWorkspaceArchivedTasks,
	useToggleWorkspaceTaskArchive,
} from "src/api/archived-workspace-assignee/archived-workspace-assignee"
import type { TaskRowWithWorkspaceDto } from "src/api/model"
import { sendRequest } from "src/axios"
import { formatDateShort } from "src/functions/date-utils"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { invalidateQueries } from "src/queryClient"
import { TooltipProvider } from "../ui/tooltip"
import { ColumnHeaderWithActions } from "./ColumnHeaderWithActions"
import { TaskFilters } from "./TaskFilters"
import { TaskTable } from "./TaskTable"

const ARCHIVE_EXTRA_COLUMNS: ColumnDef<TaskRowWithWorkspaceDto>[] = [
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
		}) => <DateCell>{formatDateShort(new Date(archivedAt))}</DateCell>,
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
	} = useListWorkspaceArchivedTasks({
		query: {
			queryKey: [...getListWorkspaceArchivedTasksQueryKey(), { workspaceId }],
			queryFn: ({ signal }) =>
				sendRequest<TaskRowWithWorkspaceDto[]>({
					url: "/archived-workspace-assignee-task",
					method: "GET",
					params: { workspaceId },
					signal,
				}),
		},
	})

	const { mutate: toggleArchive } = useToggleWorkspaceTaskArchive({
		mutation: {
			onSuccess: handleChangeSuccess,
			mutationFn: ({ pathParams }) =>
				sendRequest<void>({
					url: `/archived-workspace-assignee-task/${pathParams.id}`,
					method: "PATCH",
					params: { workspaceId },
				}),
		},
	})

	const filteredTasks = useFilteredTasks(tasks)

	function handleChangeSuccess() {
		invalidateQueries([queryKey])
	}

	function handleUnarchive(ids: number[]) {
		ids.forEach((id) => {
			toggleArchive({ pathParams: { id } })
		})
	}

	return (
		<TooltipProvider>
			<PageRoot>
				<TaskFilters
					allTaskRows={tasks}
					filteredTasks={filteredTasks}
					columnOrder={columnOrder}
					hiddenColumns={hiddenColumns}
					extraColumns={ARCHIVE_EXTRA_COLUMNS}
					extraColumnsMeta={[{ id: "archivedAt", label: "הועבר לארכיון" }]}
					exportFilePrefix="ארכיון סביבה"
				/>
				<TaskTable<TaskRowWithWorkspaceDto>
					tasks={filteredTasks}
					isLoading={isLoading}
					hideStatusAction
					showActionsColumn={true}
					columnOrder={columnOrder}
					hiddenColumns={hiddenColumns}
					getPermissionType={(task) => task?.workspace?.permissionType}
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
