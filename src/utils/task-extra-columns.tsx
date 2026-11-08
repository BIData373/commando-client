import { createColumnHelper } from "@tanstack/react-table"
import type { TaskRowDto, TaskRowWithWorkspaceDto } from "src/api/model"
import WorkspaceCell from "../components/shared/WorkspaceCell"
import { DateCell } from "../components/Tasks/cells/DateCell"
import { TaskColumnHeader } from "../components/Tasks/cells/TaskColumnHeader"
import type { AppTableFeatures } from "../consts/table-features"
import { useTaskTable } from "../providers/TaskTableProvider"
import { localeSortBy } from "./sort-utils"
import { TASK_COLUMN_ID } from "./task-table-utils"

const taskColumnHelper = createColumnHelper<AppTableFeatures, TaskRowDto>()

const personalTaskColumnHelper = createColumnHelper<
	AppTableFeatures,
	TaskRowWithWorkspaceDto
>()

const ARCHIVED_AT_COLUMN_OPTIONS = {
	header: TaskColumnHeader,
	size: 140,
	enableColumnFilter: false,
	cell: DateCell,
}

export const PERSONAL_EXTRA_COLUMNS = personalTaskColumnHelper.columns([
	personalTaskColumnHelper.accessor((row) => row.workspace?.title, {
		id: TASK_COLUMN_ID.workspace,
		header: TaskColumnHeader,
		size: 170,
		enableColumnFilter: false,
		sortFn: localeSortBy<TaskRowWithWorkspaceDto>("workspace.title"),
		cell: ({ row: { original } }) => {
			const { searchQuery } = useTaskTable()

			return (
				<WorkspaceCell
					workspace={original.workspace}
					createdBy={original.createdBy}
					searchQuery={searchQuery}
				/>
			)
		},
	}),
])

export const PERSONAL_ARCHIVE_EXTRA_COLUMNS = personalTaskColumnHelper.columns([
	personalTaskColumnHelper.accessor((row) => row.personalArchivedAt, {
		...ARCHIVED_AT_COLUMN_OPTIONS,
		id: TASK_COLUMN_ID.personalArchivedAt,
	}),
])

export const WORKSPACE_ARCHIVE_EXTRA_COLUMNS = taskColumnHelper.columns([
	taskColumnHelper.accessor((row) => row.workspaceArchivedAt, {
		...ARCHIVED_AT_COLUMN_OPTIONS,
		id: TASK_COLUMN_ID.workspaceArchivedAt,
	}),
])
