import { PermissionType, type TaskRowDto } from "src/api/model"
import type { RowMenuActions } from "../components/Tasks/RowMenuItems"

export interface TaskArchiveEntry {
	id: number
	assigneeId?: number
}

export interface TaskRowHandlers<TTask extends TaskRowDto = TaskRowDto> {
	onEdit?(taskId: number): void
	onAddComment?(taskId: number): void
	onArchive?(tasks: TaskArchiveEntry[]): void
	onUnarchive?(tasks: TaskArchiveEntry[]): void
	onDelete?(taskIds: number[]): void
	onEnterSelectMode?(rowKey: string): void
	getPermissionType?(task: TTask): PermissionType | null | undefined
}

export function buildRowMenuActions<TTask extends TaskRowDto>(
	handlers: TaskRowHandlers<TTask>,
	task: TTask,
): RowMenuActions {
	const {
		onEdit,
		onAddComment,
		onArchive,
		onUnarchive,
		onDelete,
		onEnterSelectMode,
	} = handlers
	const { id, rowKey, assignee } = task
	const archiveEntries = [{ id, assigneeId: assignee?.id }]
	const isManager =
		handlers.getPermissionType?.(task) === PermissionType.MANAGER

	return {
		onEdit: onEdit && isManager ? () => onEdit(id) : undefined,
		onAddComment: onAddComment && (() => onAddComment(id)),
		onArchive: onArchive && (() => onArchive(archiveEntries)),
		onUnarchive: onUnarchive && (() => onUnarchive(archiveEntries)),
		onEnterSelect: onEnterSelectMode && (() => onEnterSelectMode(rowKey)),
		onDelete: onDelete && isManager ? () => onDelete([id]) : undefined,
	}
}
