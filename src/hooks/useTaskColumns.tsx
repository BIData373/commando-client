import styled from "@emotion/styled"
import type { ColumnDef } from "@tanstack/react-table"
import { differenceInDays, startOfToday } from "date-fns"
import { useCallback, useMemo } from "react"
import { BsPaperclip as Paperclip } from "react-icons/bs"
import { useUpsertAssigneeTaskStatus } from "src/api/assignee-task-status/assignee-task-status"
import {
	DeadlineType,
	type TaskRowDto,
	type WorkspaceStatusDto,
	WorkspaceStatusType,
} from "src/api/model"
import { getGetTaskQueryKey } from "src/api/task/task"
import type { FilterOption, FilterOptions } from "src/functions/filter-utils"
import { invalidateQueries } from "src/queryClient"
import {
	COLUMN_LABELS,
	DEFAULT_COLUMN_ORDER,
	TASK_COLUMN_DEFINITIONS,
} from "src/utils/task-table-utils"
import { DeadlineTypeTag } from "../components/shared/DeadlineTypeTag"
import EllipsisTooltip from "../components/shared/EllipsisTooltip"
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
import { getDeadlineDisplayDate } from "../utils/deadline-utils"

interface SelectModeConfig<TTask extends TaskRowDto> {
	enabled: boolean
	tasks: TTask[]
	selectedTaskIds: number[]
	onSelectAll: (checked: boolean) => void
}

export interface TaskArchiveEntry {
	id: number
	assigneeId?: number
}

interface ActionsConfig {
	onEdit?: (taskId: number) => void
	onArchive?(tasks: TaskArchiveEntry[]): void
	onUnarchive?(tasks: TaskArchiveEntry[]): void
	onDelete?(taskIds: number[]): void
	onEnterSelectMode(rowKey?: string): void
}

interface UseTaskColumnsOptions<TTask extends TaskRowDto> {
	columnOrder?: (keyof TTask)[]
	hiddenColumns?: Set<keyof TTask>
	extraColumns?: ColumnDef<TTask>[]
	searchQuery?: string
	filterOptionsMap?: Record<FilterOptions, FilterOption[]>
	selectMode?: SelectModeConfig<TTask>
	actions?: ActionsConfig
	showMenuColumn?: boolean
	statuses?: WorkspaceStatusDto[]
	onUpdateStatusSuccess?(): void
	onTitleDoubleClick?: (taskId: number) => void
}

export function useTaskColumns<TTask extends TaskRowDto>({
	columnOrder = DEFAULT_COLUMN_ORDER as (keyof TTask)[],
	hiddenColumns = new Set<keyof TTask>(),
	extraColumns = [],
	searchQuery,
	filterOptionsMap,
	selectMode,
	actions,
	showMenuColumn = true,
	statuses,
	onUpdateStatusSuccess,
}: UseTaskColumnsOptions<TTask>) {
	const { mutate: upsertAssigneeTaskStatus } = useUpsertAssigneeTaskStatus({
		mutation: {
			onSuccess: ({ task: { id } }) => {
				invalidateQueries([getGetTaskQueryKey({ id })])
				onUpdateStatusSuccess?.()
			},
		},
	})

	const handleUpdateStatus = useCallback(
		(taskId: number, assigneeId: number, statusId: number) => {
			upsertAssigneeTaskStatus({ data: { taskId, assigneeId, statusId } })
		},
		[upsertAssigneeTaskStatus],
	)

	const columns = useMemo<ColumnDef<TTask>[]>(() => {
		// TODO Move all constant fields to task-table-utils

		const today = startOfToday()

		const pinnedStartColumn: ColumnDef<TTask> = selectMode?.enabled
			? {
					id: "select",
					size: 61,
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
			: {
					id: "id",
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
						<IdCell>
							<HighlightMatch
								text={String(id)}
								query={searchQuery ?? ""}
								variant="mark"
							/>
						</IdCell>
					),
				}

		const pinnedEndColumn: ColumnDef<TTask> | undefined =
			showMenuColumn && actions
				? {
						id: "actions",
						size: 45,
						enableSorting: false,
						enableColumnFilter: false,
						cell: ({
							row: {
								original: { id, workspaceId, rowKey, assignee },
							},
						}) => {
							const handleEdit = actions.onEdit
								? () => actions.onEdit?.(id)
								: undefined
							const handleArchive = actions.onArchive
								? () => actions.onArchive?.([{ id, assigneeId: assignee?.id }])
								: undefined
							const handleUnarchive = actions.onUnarchive
								? () =>
										actions.onUnarchive?.([{ id, assigneeId: assignee?.id }])
								: undefined
							const handleEnterSelect = () =>
								actions.onEnterSelectMode?.(rowKey)
							const handleDelete = actions.onDelete
								? () => actions.onDelete?.([id])
								: undefined

							return (
								<RowActionsMenu
									workspaceId={workspaceId}
									onEdit={handleEdit}
									onArchive={handleArchive}
									onUnarchive={handleUnarchive}
									onEnterSelect={handleEnterSelect}
									onDelete={handleDelete}
								/>
							)
						},
					}
				: undefined

		const middleColumns = [
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
						original: { title, description, flagged },
					},
				}) => (
					<TitleCell>
						{flagged && <FlagIcon />}
						<TitleContent
							tooltip={`${title}${description ? ` - ${description}` : ""}`}
						>
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
							{description && (
								<>
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
							)}
						</TitleContent>
					</TitleCell>
				),
			},
			{
				id: "status",
				header: ({ column }) => (
					<ColumnHeaderWithActions
						label={COLUMN_LABELS.status}
						column={column}
						filterOptions={filterOptionsMap?.status}
					/>
				),
				size: 100,
				...TASK_COLUMN_DEFINITIONS.status,
				cell: ({
					row: {
						original: {
							id,
							status,
							assignee,
							workspaceId,
							editable,
							archivedAt,
						},
					},
				}) =>
					status && (
						<StatusDropdown
							status={status}
							statuses={statuses}
							workspaceId={workspaceId}
							assigneeId={assignee?.id}
							editable={!archivedAt && editable}
							taskId={id}
							onUpdate={handleUpdateStatus}
						/>
					),
			},
			{
				id: "assignee",
				header: ({ column }) => (
					<ColumnHeaderWithActions
						label={COLUMN_LABELS.assignee}
						column={column}
						filterOptions={filterOptionsMap?.assignee}
					/>
				),
				size: 100,
				...TASK_COLUMN_DEFINITIONS.assignee,
				cell: ({
					row: {
						original: { assignee, otherAssignees },
					},
				}) =>
					assignee && (
						<AssigneeCell
							assignee={assignee}
							otherAssignees={otherAssignees ?? []}
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
				size: 150,
				...TASK_COLUMN_DEFINITIONS.deadlineType,
				cell: ({
					row: {
						original: {
							deadlineType: rawDeadlineType,
							dueDate,
							status,
							source,
							createdAt,
						},
					},
				}) => {
					const deadlineType = rawDeadlineType
					const daysUntil = dueDate
						? differenceInDays(new Date(dueDate), today)
						: null
					const isOverdue =
						daysUntil !== null &&
						daysUntil < 0 &&
						deadlineType !== DeadlineType.IMMEDIATE

					const isApproaching =
						!isOverdue && daysUntil !== null && daysUntil >= 0 && daysUntil < 2

					const displayDate = getDeadlineDisplayDate(
						deadlineType,
						dueDate,
						source,
						createdAt,
					)

					const deadlineTooltipText = isOverdue
						? `חריגה של ${Math.abs(daysUntil)} ימים`
						: isApproaching
							? daysUntil === 0
								? 'תג"ב היום'
								: 'תג"ב מחר'
							: null

					const showDeadlineTooltip =
						status?.type !== WorkspaceStatusType.COMPLETED &&
						deadlineTooltipText !== null

					return (
						<DeadlineCell>
							<DeadlineTypeTag type={deadlineType} />
							{displayDate &&
								(showDeadlineTooltip ? (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<DeadlineDateText
													$isOverdue={isOverdue}
													$isApproaching={isApproaching}
												>
													{formatDateShort(displayDate)}
												</DeadlineDateText>
											</TooltipTrigger>

											<TooltipContent>{deadlineTooltipText}</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								) : (
									<DeadlineDateText
										$isOverdue={isOverdue}
										$isApproaching={isApproaching}
									>
										{formatDateShort(displayDate)}
									</DeadlineDateText>
								))}
						</DeadlineCell>
					)
				},
			},
			{
				id: "source",
				header: ({ column }) => (
					<ColumnHeaderWithActions
						label={COLUMN_LABELS.source}
						column={column}
						filterOptions={filterOptionsMap?.source}
					/>
				),
				size: 240,
				...TASK_COLUMN_DEFINITIONS.source,
				cell: ({
					row: {
						original: { source },
					},
				}) => {
					if (!source) {
						return null
					}

					const sourceText = [
						source.name,
						...(source.date ? [formatDateShort(source.date)] : []),
					]
						.filter(Boolean)
						.join(" | ")

					return (
						<SourceCell>
							{source.attachmentKey && <SourceAttachmentIcon size={18} />}

							{sourceText && (
								<SourceText>
									<HighlightMatch
										text={sourceText}
										query={searchQuery ?? ""}
										variant="mark"
									/>
								</SourceText>
							)}
						</SourceCell>
					)
				},
			},
			{
				id: "tags",
				header: ({ column }) => (
					<ColumnHeaderWithActions
						label={COLUMN_LABELS.tags}
						column={column}
						filterOptions={filterOptionsMap?.tags}
					/>
				),
				size: 100,
				enableSorting: false,
				...TASK_COLUMN_DEFINITIONS.tags,
				meta: { grow: true },
				cell: ({ getValue }) => (
					<TopicCell tags={getValue<string[]>()} searchQuery={searchQuery} />
				),
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
				size: 120,
				enableColumnFilter: false,
				...TASK_COLUMN_DEFINITIONS.createdAt,
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
				size: 100,
				enableColumnFilter: false,
				...TASK_COLUMN_DEFINITIONS.updatedAt,
				cell: ({ getValue }) => (
					<DateText>{formatDateShort(getValue<Date>())}</DateText>
				),
			},
		] as ColumnDef<TTask>[]

		const orderableColumns = [...middleColumns, ...extraColumns]
		const columnsById = new Map(
			orderableColumns.map((column) => [column.id as string, column]),
		)

		const orderedColumns = columnOrder
			.map((id) => columnsById.get(id as string))
			.filter((column): column is ColumnDef<TTask> => !!column)

		const filteredColumns = orderedColumns.filter(
			({ id }) => !hiddenColumns.has(id as keyof TTask),
		)

		return [
			pinnedStartColumn,
			...filteredColumns,
			...(pinnedEndColumn ? [pinnedEndColumn] : []),
		]
	}, [
		columnOrder,
		hiddenColumns,
		extraColumns,
		searchQuery,
		filterOptionsMap,
		selectMode,
		actions,
		showMenuColumn,
		statuses,
		handleUpdateStatus,
	])

	return { columns }
}

const CheckboxCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const IdCell = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.65);
  width: 100%;
  height: 100%;
  cursor: pointer;
`

const TitleCell = styled.div<{ $clickable?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--sea-ink);
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 20px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  cursor: pointer;
`

const TitleContent = styled(EllipsisTooltip)`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`

const TitlePart = styled.span`
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 50%;
  flex-shrink: 0;

  &:only-child {
    max-width: 100%;
    flex: 1;
  }
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

const DeadlineCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const DeadlineDateText = styled.span<{
	$isOverdue?: boolean
	$isApproaching?: boolean
}>`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  white-space: nowrap;

  color: ${({ $isOverdue, $isApproaching }) => {
		if ($isOverdue) {
			return "var(--Colors-Brand-Error-colorErrorActive)"
		}

		if ($isApproaching) {
			return "var(--Colors-Brand-Warning-colorWarningText)"
		}

		return "var(--sea-ink-soft)"
	}};
`

const SourceCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--sea-ink-soft);
`

const SourceAttachmentIcon = styled(Paperclip)`
  flex-shrink: 0;
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

const DateText = styled.span`
  font-size: var(--fs-btn);
  color: var(--sea-ink-soft);
`
