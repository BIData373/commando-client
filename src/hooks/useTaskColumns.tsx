import styled from "@emotion/styled"
import type { QueryKey } from "@tanstack/react-query"
import type { ColumnDef, FilterFn } from "@tanstack/react-table"
import { differenceInDays, startOfToday } from "date-fns"
import { concat, map, uniq } from "lodash"
import { AlertTriangle } from "lucide-react"
import { BsPaperclip as Paperclip } from "react-icons/bs"
import { useUpsertAssigneeTaskStatus } from "src/api/assignee-task-status/assignee-task-status"
import { DeadlineType, type TaskDto } from "src/api/model"
import { getGetTaskQueryKey } from "src/api/task/task"
import type { FilterOption, FilterOptions } from "src/functions/filter-utils"
import type { TaskRow } from "src/providers/TasksFiltersProvider"
import { invalidateQueries } from "src/queryClient"
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

export type TaskColumn =
	| keyof TaskDto
	| "status"
	| "discussionName"
	| "workspace"

export interface TaskColumnMeta {
	id: TaskColumn
	label: string
}

export const TASK_COLUMNS_META: TaskColumnMeta[] = [
	{ id: "id", label: 'מס"ד' },
	{ id: "title", label: "ההנחיה" },
	{ id: "status", label: "סטטוס" },
	{ id: "assigneeStatuses", label: "אחראי" },
	{ id: "deadlineType", label: 'תג"ב' },
	{ id: "discussionName", label: "מקור" },
	{ id: "tags", label: "נושא" },
	{ id: "notes", label: "הערות" },
	{ id: "createdAt", label: "תאריך יצירה" },
	{ id: "updatedAt", label: "עודכן ב" },
]

const COLUMN_LABELS: Record<TaskColumn, string> = Object.fromEntries(
	TASK_COLUMNS_META.map(({ id, label }) => [id, label]),
) as Record<TaskColumn, string>

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

interface SelectModeConfig {
	enabled: boolean
	tasks: TaskDto[]
	selectedTaskIds: number[]
	onSelectAll: (checked: boolean) => void
}

interface ActionsConfig {
	onEdit: (taskId: number) => void
	onDoubleClick?: (taskId: number) => void
	onArchive: (taskIds: number[]) => void
	onDelete: (taskIds: number[]) => void
	onEnterSelectMode: (taskId?: number) => void
}

interface UseTaskColumnsOptions {
	queryKey: QueryKey
	visibleColumns: TaskColumn[]
	searchQuery: string
	filterOptionsMap?: Record<FilterOptions, FilterOption[]>
	selectMode?: SelectModeConfig
	actions?: ActionsConfig
}

interface UseTaskColumnsReturn {
	columns: ColumnDef<TaskRow>[]
	availableColumns: TaskColumnMeta[]
}

function useTaskColumns({
	queryKey,
	visibleColumns,
	searchQuery,
	filterOptionsMap,
	selectMode,
	actions,
}: UseTaskColumnsOptions): UseTaskColumnsReturn {
	const { mutate: upsertAssigneeTaskStatus } = useUpsertAssigneeTaskStatus({
		mutation: {
			onSuccess: ({ task }) => {
				invalidateQueries([queryKey, getGetTaskQueryKey({ id: task.id })])
			},
		},
	})

	function onUpdateStatus(
		taskId: number,
		assigneeId: number,
		statusId: number,
	) {
		upsertAssigneeTaskStatus({ data: { taskId, assigneeId, statusId } })
	}

	const selectColumn: ColumnDef<TaskRow> | null = selectMode?.enabled
		? {
				id: "select",
				size: 70,
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

	const columnMap: Partial<Record<TaskColumn, ColumnDef<TaskRow>>> = {
		id: {
			accessorKey: "id",
			header: ({ column }) => (
				<ColumnHeaderWithActions label={COLUMN_LABELS.id} column={column} />
			),
			size: 70,
			enableColumnFilter: false,
			cell: ({
				row: {
					original: { id },
				},
			}) => (
				<IdCell onDoubleClick={() => actions?.onDoubleClick?.(id)}>{id}</IdCell>
			),
		},
		title: {
			accessorKey: "title",
			header: COLUMN_LABELS.title,
			size: 400,
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
		status: {
			id: "status",
			accessorFn: (row) => row.status?.type,
			header: ({ column }) => (
				<ColumnHeaderWithActions
					label={COLUMN_LABELS.status}
					column={column}
					filterOptions={filterOptionsMap?.status}
				/>
			),
			size: 100,
			filterFn: multiSelectFilter,
			sortingFn: (rowA, rowB) =>
				(rowA.original.status?.id ?? 0) - (rowB.original.status?.id ?? 0),
			cell: ({
				row: {
					original: { id, status, assignee, workspaceId },
				},
			}) =>
				status &&
				assignee && (
					<StatusDropdown
						status={status}
						assigneeId={assignee.id}
						taskId={id}
						workspaceId={workspaceId}
						onUpdate={onUpdateStatus}
					/>
				),
		},
		assigneeStatuses: {
			id: "assigneeStatuses",
			accessorFn: (row) => row.assignee?.name,
			header: ({ column }) => (
				<ColumnHeaderWithActions
					label={COLUMN_LABELS.assigneeStatuses}
					column={column}
					filterOptions={filterOptionsMap?.assigneeStatuses}
				/>
			),
			size: 115,
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
		deadlineType: {
			accessorKey: "deadlineType",
			header: ({ column }) => (
				<ColumnHeaderWithActions
					label={COLUMN_LABELS.deadlineType}
					column={column}
					filterOptions={filterOptionsMap?.deadlineType}
				/>
			),
			size: 160,
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
		discussionName: {
			id: "discussionName",
			accessorFn: (row) => row.source?.name,
			header: ({ column }) => (
				<ColumnHeaderWithActions
					label={COLUMN_LABELS.discussionName}
					column={column}
					filterOptions={filterOptionsMap?.discussionName}
				/>
			),
			size: 260,
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
		tags: {
			accessorKey: "tags",
			header: ({ column }) => (
				<ColumnHeaderWithActions
					label={COLUMN_LABELS.tags}
					column={column}
					filterOptions={filterOptionsMap?.tags}
				/>
			),
			size: 160,
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
		notes: {
			accessorKey: "notes",
			header: COLUMN_LABELS.notes,
			size: 220,
			enableSorting: false,
			enableColumnFilter: false,
			cell: ({ getValue }) => {
				const notes = getValue<string>()
				return notes ? (
					<NotesText dangerouslySetInnerHTML={{ __html: notes }} />
				) : null
			},
		},
		createdAt: {
			accessorKey: "createdAt",
			header: ({ column }) => (
				<ColumnHeaderWithActions
					label={COLUMN_LABELS.createdAt}
					column={column}
				/>
			),
			size: 132,
			enableColumnFilter: false,
			sortingFn: "datetime",
			cell: ({ getValue }) => (
				<DateText>{formatDateShort(getValue<Date>())}</DateText>
			),
		},
		updatedAt: {
			accessorKey: "updatedAt",
			header: ({ column }) => (
				<ColumnHeaderWithActions
					label={COLUMN_LABELS.updatedAt}
					column={column}
				/>
			),
			size: 100,
			enableColumnFilter: false,
			sortingFn: "datetime",
			cell: ({ getValue }) => (
				<DateText>{formatDateShort(getValue<Date>())}</DateText>
			),
		},
	}

	const actionsColumn: ColumnDef<TaskRow> | null = actions
		? {
				id: "actions",
				size: 43,
				enableSorting: false,
				enableColumnFilter: false,
				cell: ({
					row: {
						original: { id, workspaceId },
					},
				}) => (
					<RowActionsMenu
						workspaceId={workspaceId}
						onEdit={() => actions.onEdit(id)}
						onEnterSelect={() => actions.onEnterSelectMode(id)}
						onDelete={() => actions.onDelete([id])}
					/>
				),
			}
		: null

	const visibleOrderedColumns = visibleColumns
		.filter((id) => columnMap[id])
		.map((id) => (selectColumn && id === "id" ? selectColumn : columnMap[id]!))

	const columns: ColumnDef<TaskRow>[] = [
		...visibleOrderedColumns,
		...(actionsColumn ? [actionsColumn] : []),
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

const DateText = styled.span`
  font-size: var(--fs-btn);
  color: var(--sea-ink-soft);
`
