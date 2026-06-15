import styled from "@emotion/styled"
import type { ColumnDef, FilterFn } from "@tanstack/react-table"
import { differenceInDays, startOfToday } from "date-fns"
import { concat, map, uniq } from "lodash"
import { AlertTriangle } from "lucide-react"
import { BsPaperclip as Paperclip } from "react-icons/bs"
import { useUpsertAssigneeTaskStatus } from "src/api/assignee-task-status/assignee-task-status"
import { DeadlineType, type TaskDto } from "src/api/model"
import { getGetTaskQueryKey } from "src/api/task/task"
import type { FilterOption, FilterOptions } from "src/functions/filter-utils"
import { invalidateQueries } from "src/queryClient"
import { formatMesibaIcon } from "src/utils/icon-utils"
import { TASK_COLUMNS_META, type TaskRow } from "src/utils/task-table-utils"
import DeadlineTag, { DEADLINE_LABELS } from "../components/shared/DeadlineTag"
import FlagIcon from "../components/shared/FlagIcon"
import HighlightMatch from "../components/shared/HighlightMatch"
import { AssigneeCell } from "../components/Tasks/AssigneeCell"
import { ColumnHeaderWithActions } from "../components/Tasks/ColumnHeaderWithActions"
import { RowActionsMenu } from "../components/Tasks/RowActionsMenu"
import { StatusDropdown } from "../components/Tasks/StatusDropdown"
import { TopicCell } from "../components/Tasks/TopicCell"
import { Checkbox } from "../components/ui/checkbox"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../components/ui/tooltip"
import { formatDateShort } from "../functions/date-utils"

const COLUMN_LABELS = Object.fromEntries(
	TASK_COLUMNS_META.map(({ id, label }) => [id, label]),
) as Record<keyof TaskRow, string>

interface SelectModeConfig {
	enabled: boolean
	tasks: TaskDto[]
	selectedTaskIds: number[]
	onSelectAll: (checked: boolean) => void
}

interface ActionsConfig {
	onEdit: (taskId: number) => void
	onDoubleClick?(taskId: number): void
	onArchive(taskIds: number[]): void
	onDelete(taskIds: number[]): void
	onEnterSelectMode(rowKey?: string): void
}

type ColumnsMap = Partial<Record<string, ColumnDef<TaskRow>>>

interface UseTaskColumnsOptions {
	visibleColumns: (keyof TaskRow)[]
	searchQuery: string
	filterOptionsMap?: Record<FilterOptions, FilterOption[]>
	selectMode?: SelectModeConfig
	actions?: ActionsConfig
	showMenuColumn?: boolean
	onUpdateStatusSuccess?(): void
}

function useTaskColumns({
	visibleColumns,
	searchQuery,
	filterOptionsMap,
	selectMode,
	actions,
	showMenuColumn = true,
	onUpdateStatusSuccess,
}: UseTaskColumnsOptions) {
	const { mutate: upsertAssigneeTaskStatus } = useUpsertAssigneeTaskStatus({
		mutation: {
			onSuccess: ({ task: { id } }) => {
				invalidateQueries([getGetTaskQueryKey({ id })])
				onUpdateStatusSuccess?.()
			},
		},
	})

	const multiSelectFilter: FilterFn<TaskRow> = (
		row,
		columnId,
		filterValue: string[],
	) => {
		if (!filterValue?.length) return true
		const value = row.getValue(columnId)
		if (Array.isArray(value))
			return value.some((v: string) => filterValue.includes(v))
		return filterValue.includes(value as string)
	}

	function handleUpdateStatus(
		taskId: number,
		assigneeId: number,
		statusId: number,
	) {
		upsertAssigneeTaskStatus({ data: { taskId, assigneeId, statusId } })
	}

	const selectColumn: ColumnDef<TaskRow> | null = selectMode?.enabled
		? {
				id: "select",
				size: 35,
				enableSorting: false,
				enableColumnFilter: false,
				header: () => (
					<CheckboxCenter>
						<Checkbox
							checked={
								selectMode.tasks.length > 0 &&
								selectMode.selectedTaskIds.length === selectMode.tasks.length
							}
							onCheckedChange={(checked) => selectMode.onSelectAll(!!checked)}
						/>
					</CheckboxCenter>
				),
				cell: ({ row }) => (
					<CheckboxCenter>
						<Checkbox
							checked={row.getIsSelected()}
							onCheckedChange={(checked) => row.toggleSelected(!!checked)}
						/>
					</CheckboxCenter>
				),
			}
		: null

	const allColumns = [
		{
			id: "id",
			accessorKey: "id",
			header: ({ column }) => (
				<ColumnHeaderWithActions label={COLUMN_LABELS.id} column={column} />
			),
			size: 35,
			enableColumnFilter: false,
			cell: ({
				row: {
					original: { id },
				},
			}) => (
				<IdCell onDoubleClick={() => actions?.onDoubleClick?.(id)}>{id}</IdCell>
			),
		},
		{
			id: "title",
			accessorKey: "title",
			header: COLUMN_LABELS.title,
			size: 300,
			meta: { grow: true },
			enableSorting: false,
			enableColumnFilter: false,
			cell: ({
				row: {
					original: { id, title, description, flagged },
				},
			}) => (
				<TitleCell onDoubleClick={() => actions?.onDoubleClick?.(id)}>
					{flagged && <FlagIcon />}
					{description ? (
						<>
							<TitlePart>
								{searchQuery ? (
									<HighlightMatch
										text={title}
										query={searchQuery}
										variant="mark"
									/>
								) : (
									title
								)}
							</TitlePart>
							<TitleSeparator> - </TitleSeparator>
							<DetailsPart>
								{searchQuery ? (
									<HighlightMatch
										text={description}
										query={searchQuery}
										variant="mark"
									/>
								) : (
									description
								)}
							</DetailsPart>
						</>
					) : (
						<TitleFull>
							{searchQuery ? (
								<HighlightMatch
									text={title}
									query={searchQuery}
									variant="mark"
								/>
							) : (
								title
							)}
						</TitleFull>
					)}
				</TitleCell>
			),
		},
		{
			id: "status",
			accessorFn: (row) => row.status?.type,
			header: ({ column }) => (
				<ColumnHeaderWithActions
					label={COLUMN_LABELS.status}
					column={column}
					filterOptions={filterOptionsMap?.status}
				/>
			),
			size: 50,
			filterFn: multiSelectFilter,
			sortingFn: (rowA, rowB) =>
				(rowA.original.status?.id ?? 0) - (rowB.original.status?.id ?? 0),
			cell: ({
				row: {
					original: { id, status, assignee, workspaceId, editable },
				},
			}) =>
				status &&
				assignee && (
					<StatusDropdown
						status={status}
						assigneeId={assignee.id}
						editable={editable ?? false}
						taskId={id}
						workspaceId={workspaceId}
						onUpdate={handleUpdateStatus}
					/>
				),
		},
		{
			id: "assigneeStatuses",
			accessorFn: (row) => row.assignee?.name,
			header: ({ column }) => (
				<ColumnHeaderWithActions
					label={COLUMN_LABELS.assigneeStatuses}
					column={column}
					filterOptions={filterOptionsMap?.assigneeStatuses}
				/>
			),
			size: 60,
			filterFn: multiSelectFilter,
			sortingFn: "text",
			cell: ({
				row: {
					original: { assignee, otherAssignees },
				},
			}) =>
				assignee && (
					<AssigneeCell
						responsible={assignee}
						relatedDirectives={(otherAssignees ?? []).map((s) => ({
							assignee: s.assignee,
							status: s.status,
						}))}
					/>
				),
		},
		{
			id: "deadlineType",
			accessorKey: "deadlineType",
			header: ({ column }) => (
				<ColumnHeaderWithActions
					label={COLUMN_LABELS.deadlineType}
					column={column}
					filterOptions={filterOptionsMap?.deadlineType}
				/>
			),
			size: 90,
			filterFn: multiSelectFilter,
			sortingFn: (
				{ original: { dueDate: dueDateA } },
				{ original: { dueDate: dueDateB } },
			) => {
				const a = dueDateA ? new Date(dueDateA).getTime() : Infinity
				const b = dueDateB ? new Date(dueDateB).getTime() : Infinity
				return a > b ? 1 : a < b ? -1 : 0
			},
			cell: ({
				row: {
					original: { deadlineType: rawDeadlineType, dueDate },
				},
			}) => {
				const deadlineType = rawDeadlineType
				const today = startOfToday()
				const daysUntil = dueDate
					? differenceInDays(new Date(dueDate), today)
					: null
				const isOverdue =
					daysUntil !== null &&
					daysUntil < 0 &&
					deadlineType !== DeadlineType.IMMEDIATE
				const isApproaching =
					!isOverdue && daysUntil !== null && daysUntil >= 0 && daysUntil < 2

				return (
					<DeadlineCell>
						{deadlineType !== DeadlineType.DATE && (
							<DeadlineTag $type={deadlineType}>
								{DEADLINE_LABELS[deadlineType]}
							</DeadlineTag>
						)}
						{dueDate && (
							<DeadlineDateText>
								{formatDateShort(new Date(dueDate))}
							</DeadlineDateText>
						)}
						{(isOverdue || isApproaching) && (
							<DeadlineWarning>
								<TooltipProvider>
									<Tooltip>
										<WarningTrigger>
											{isOverdue ? (
												<OverdueIcon size={16} />
											) : (
												<ApproachingIcon size={16} />
											)}
										</WarningTrigger>
										<TooltipContent>
											{isOverdue
												? `חריגה של ${Math.abs(daysUntil!)} ימים`
												: daysUntil === 0
													? 'תג"ב היום'
													: 'תג"ב מחר'}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</DeadlineWarning>
						)}
					</DeadlineCell>
				)
			},
		},
		{
			id: "source",
			accessorFn: (row) => row.source?.name,
			header: ({ column }) => (
				<ColumnHeaderWithActions
					label={COLUMN_LABELS.source}
					column={column}
					filterOptions={filterOptionsMap?.source}
				/>
			),
			size: 120,
			filterFn: multiSelectFilter,
			sortingFn: "text",
			cell: ({
				row: {
					original: { source },
				},
			}) => {
				if (!source) {
					return
				}
				const parts = [source.name, formatDateShort(source.date)].filter(
					Boolean,
				)
				return (
					<SourceCell>
						{source.attachmentKey && <SourceIcon size={18} />}
						{parts.length > 0 && <SourceText>{parts.join(" | ")}</SourceText>}
					</SourceCell>
				)
			},
		},
		{
			id: "tags",
			accessorFn: (row) =>
				uniq(map(concat(row.tags, row.source?.tags ?? []), "name")),
			header: ({ column }) => (
				<ColumnHeaderWithActions
					label={COLUMN_LABELS.tags}
					column={column}
					filterOptions={filterOptionsMap?.tags}
				/>
			),
			size: 90,
			enableSorting: false,
			filterFn: multiSelectFilter,
			cell: ({
				row: {
					original: { tags, source },
				},
			}) => {
				const allNames = uniq(map(concat(tags, source?.tags ?? []), "name"))
				return <TopicCell tags={allNames} />
			},
		},
		{
			id: "notes",
			accessorKey: "notes",
			header: COLUMN_LABELS.notes,
			size: 110,
			enableSorting: false,
			enableColumnFilter: false,
			cell: ({ getValue }) => {
				const notes = getValue<string>()
				return notes ? (
					<NotesText dangerouslySetInnerHTML={{ __html: notes }} />
				) : null
			},
		},
		{
			id: "workspace",
			accessorFn: (row) => row.workspace?.title,
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
			cell: ({
				row: {
					original: { workspace },
				},
			}) =>
				workspace ? (
					<WorkspaceCell>
						{workspace.icon && (
							<WorkspaceIconImage
								src={formatMesibaIcon(workspace.icon)}
								alt={workspace.title}
							/>
						)}

						<WorkspaceCellName>{workspace.title}</WorkspaceCellName>
					</WorkspaceCell>
				) : null,
		},
		{
			id: "createdAt",
			accessorKey: "createdAt",
			header: ({ column }) => (
				<ColumnHeaderWithActions
					label={COLUMN_LABELS.createdAt}
					column={column}
				/>
			),
			size: 70,
			enableColumnFilter: false,
			sortingFn: "datetime",
			cell: ({ getValue }) => (
				<DateText>{formatDateShort(getValue<Date>())}</DateText>
			),
		},
		{
			id: "updatedAt",
			accessorKey: "updatedAt",
			header: ({ column }) => (
				<ColumnHeaderWithActions
					label={COLUMN_LABELS.updatedAt}
					column={column}
				/>
			),
			size: 70,
			enableColumnFilter: false,
			sortingFn: "datetime",
			cell: ({ getValue }) => (
				<DateText>{formatDateShort(getValue<Date>())}</DateText>
			),
		},
	] as ColumnDef<TaskRow>[]

	const columnMap: ColumnsMap = Object.fromEntries(
		allColumns.map((column) => [column.id, column]),
	)

	const visibleOrderedColumns = visibleColumns
		.filter((id) => columnMap[id])
		.map((id) => (selectColumn && id === "id" ? selectColumn : columnMap[id]))
		.filter((column) => !!column)

	const columns = [
		...visibleOrderedColumns,
		...(showMenuColumn && actions
			? [
					{
						id: "actions",
						size: 25,
						enableSorting: false,
						enableColumnFilter: false,
						cell: ({
							row: {
								original: { id, workspaceId, rowKey },
							},
						}) => (
							<RowActionsMenu
								workspaceId={workspaceId}
								onEdit={() => actions.onEdit(id)}
								onEnterSelect={() => actions.onEnterSelectMode(rowKey)}
								onDelete={() => actions.onDelete([id])}
							/>
						),
					} as ColumnDef<TaskRow>,
				]
			: []),
	]

	return {
		columns,
		availableColumns: TASK_COLUMNS_META,
	}
}

export { useTaskColumns }
// ─── Styled Components ───────────────────────────────────────────────────────

const CheckboxCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const IdCell = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 24px;
  color:rgba(0, 0, 0, 0.65);
`

const TitleCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--sea-ink);
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 20px;
  overflow: hidden;
`

const TitlePart = styled.span`
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 50%;
  flex-shrink: 0;
`

const TitleSeparator = styled.span`
  flex-shrink: 0;
  white-space: nowrap;
`

const DetailsPart = styled.span`
  font-weight: 300;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
`

const TitleFull = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const DeadlineCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const DeadlineDateText = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.65);
  white-space: nowrap;
`

const DeadlineWarning = styled.span`
  margin-inline-start: auto;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
`

const WarningTrigger = styled(TooltipTrigger)`
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: default;
  line-height: 0;
`

const OverdueIcon = styled(AlertTriangle)`
  color: #f5222d;
  flex-shrink: 0;
`

const ApproachingIcon = styled(AlertTriangle)`
  color: rgba(212, 107, 8, 0.9);
  flex-shrink: 0;
`

const SourceCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--sea-ink-soft);
`

const SourceIcon = styled(Paperclip)`
  color: rgba(0, 0, 0, 0.45);
`

const SourceText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.65);
`

const NotesText = styled.div`
  overflow: hidden;
  max-height: 40px;

  font-size: var(--fs-btn);
  line-height: 20px;
  color: var(--sea-ink-soft);

  p {
    margin: 0;
  }

  ol {
    margin: 0;
    padding-inline-start: 20px;
    list-style-type: decimal;
  }

  li {
    margin: 0;
  }

  li p {
    display: inline;
  }

  strong {
    font-weight: 600;
  }

  u {
    text-decoration: underline;
  }
`

const WorkspaceCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
`

const WorkspaceCellName = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const WorkspaceIconImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`

const DateText = styled.span`
  font-size: var(--fs-btn);
  color: var(--sea-ink-soft);
`
