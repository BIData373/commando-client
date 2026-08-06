import { keyframes } from "@emotion/react"
import styled from "@emotion/styled"
import { map } from "lodash"
import { useCallback, useEffect, useRef, useState } from "react"
import {
	DeadlineType,
	ExtractionStatus,
	SocketEvent,
	type SourceWithTasksDto,
	type TaskDto,
} from "src/api/model"
import {
	getGetSourceQueryKey,
	useExtractSource,
	useGetSource,
} from "src/api/source/source"
import aiLoadingSvg from "src/assets/icons/ai-loading.svg"
import { useSocketHandler } from "src/hooks/useSocketHandler"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { invalidateQueries } from "src/queryClient"
import { PrimaryButton } from "../shared/PrimaryButton"
import { DataTable } from "../ui/data-table"
import AIExtractionAlert from "./AIExtractionAlert"
import { DATA_CELL_ACTIVE_KEY } from "./DeadlineCell"
import TaskAssigneeExpansion from "./TaskAssigneeExpansion"
import columns, { type NewTaskRow, type TaskTableMeta } from "./TasksColumns"

// ─── Constants ──────────────────────────────────────────────────────────────

const TERMINAL_EXTRACTION_STATUSES = new Set<ExtractionStatus>([
	ExtractionStatus.FINISHED_WITH_TASKS,
	ExtractionStatus.FINISHED_WITHOUT_TASKS,
	ExtractionStatus.BACKEND_ERROR,
	ExtractionStatus.AI_SERVICE_ERROR,
])

const ACTIVE_EXTRACTION_STATUSES = new Set<ExtractionStatus>([
	ExtractionStatus.PENDING,
	ExtractionStatus.IN_PROGRESS,
])

interface CreateTasksTableProps {
	onSave: (tasks: NewTaskRow[]) => void
	onDeleteRow?: (row: NewTaskRow) => void
	onBack: () => void
	isLoading?: boolean
	sourceId?: number
}

// ─── Component ──────────────────────────────────────────────────────────────

function CreateTasksTable({
	onSave,
	onDeleteRow,
	onBack,
	isLoading,
	sourceId,
}: CreateTasksTableProps) {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	const nextRowId = useRef(1)

	const [finalStatus, setFinalStatus] = useState<ExtractionStatus | null>(null)
	const [alertDismissed, setAlertDismissed] = useState(false)
	const [extractedCount, setExtractedCount] = useState(0)

	const { data: source } = useGetSource(
		{ id: sourceId ?? 0 },
		{ query: { enabled: sourceId !== undefined } },
	)

	const { mutateAsync: extractSource, isPending: isRetrying } =
		useExtractSource()

	const isExtracting =
		sourceId !== undefined &&
		finalStatus === null &&
		source?.draft &&
		source?.extractionStatus !== null &&
		ACTIVE_EXTRACTION_STATUSES.has(source?.extractionStatus)

	async function handleRetry() {
		if (sourceId !== undefined) {
			setFinalStatus(null)
			setAlertDismissed(false)
			await extractSource({ pathParams: { id: sourceId } })
		}
	}

	const createEmptyRow = useCallback((): NewTaskRow => {
		const id = nextRowId.current++
		return {
			workspaceId,
			id,
			rowKey: String(id),
			title: "",
			deadlineType: DeadlineType.DATE,
			dueDate: null,
			assigneeIds: [],
			assigneeDetails: {},
			notes: "",
			flagged: false,
		}
	}, [workspaceId])

	const mapTaskDtoToRow = useCallback((task: TaskDto): NewTaskRow => {
		const id = nextRowId.current++
		return {
			workspaceId: task.workspaceId,
			id,
			rowKey: String(id),
			taskId: task.id,
			creationType: task.creationType,
			title: task.title,
			deadlineType: task.deadlineType,
			dueDate: task.dueDate,
			assigneeIds: task.assigneeStatuses.map((s) => s.assignee.id),
			assigneeDetails: Object.fromEntries(
				task.assigneeStatuses.map((s) => [s.assignee.id, s.description]),
			),
			notes: task.notes ?? "",
			flagged: task.flagged,
		}
	}, [])

	useSocketHandler({
		[SocketEvent.TASK_EXTRACTION_FINISHED]: (dto: SourceWithTasksDto) => {
			if (sourceId !== undefined) {
				if (dto.id !== sourceId) {
					return
				}

				invalidateQueries([getGetSourceQueryKey({ id: sourceId })])

				setFinalStatus(dto.extractionStatus)
				setAlertDismissed(false)

				if (dto.extractionStatus === ExtractionStatus.FINISHED_WITH_TASKS) {
					setExtractedCount(dto.tasks.length)
					setRows([...map(dto.tasks, mapTaskDtoToRow), createEmptyRow()])
				}
			}
		},
	})

	useEffect(() => {
		if (!source?.extractionStatus) {
			return
		}

		if (source.tasks.length > 0) {
			const mapped = source.tasks.map(mapTaskDtoToRow)

			setExtractedCount(mapped.length)
			setRows([...mapped, createEmptyRow()])
		}

		if (TERMINAL_EXTRACTION_STATUSES.has(source.extractionStatus)) {
			setFinalStatus(source.extractionStatus)
		}
	}, [source, createEmptyRow, mapTaskDtoToRow])

	const [rows, setRows] = useState<NewTaskRow[]>([createEmptyRow()])
	const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

	function removeExpandedRow(id: number) {
		setExpandedRows((prev) => {
			const next = new Set(prev)
			next.delete(id)
			return next
		})
	}

	function updateRow(id: number, updates: Partial<NewTaskRow>) {
		setRows((prev) => {
			const next = prev.map((r) =>
				r.id === id ? { ...r, ...updates, touched: true } : r,
			)
			const last = next[next.length - 1]
			if (last.title.trim()) {
				next.push(createEmptyRow())
			}
			return next
		})

		if ("assigneeIds" in updates) {
			const newIds = updates.assigneeIds!
			if (newIds.length > 1) {
				setExpandedRows((prev) => new Set(prev).add(id))
			} else {
				removeExpandedRow(id)
			}
		}
	}

	function toggleRowExpansion(id: number) {
		setExpandedRows((prev) => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})
	}

	function deleteRow(id: number) {
		const row = rows.find((r) => r.id === id)
		if (row) onDeleteRow?.(row)

		setRows((prev) => {
			const next = prev.filter((r) => r.id !== id)
			if (next.length === 0) return [createEmptyRow()]
			return next
		})
		removeExpandedRow(id)
	}

	function handleSave() {
		const filled = rows.filter((r) => r.title.trim())
		onSave(filled)
	}

	function dismissAlert() {
		setAlertDismissed(true)
	}

	const filledCount = rows.filter((r) => r.title.trim()).length
	const hasAnyTask = filledCount > 0 || isLoading

	const meta: TaskTableMeta = {
		updateRow,
		expandedRows,
		toggleRowExpansion,
		deleteRow,
		isLastRow: (index: number) => index === rows.length - 1,
	}

	return isExtracting ? (
		<ExtractionWrapper>
			<LoaderContainer>
				<LoaderImage src={aiLoadingSvg} alt="" />
				<SpinnerRing />
				<LoaderTitle>אנחנו מחלצים את ההנחיות</LoaderTitle>
				<LoaderSubtext>
					התהליך עשוי לקחת כמה דקות,
					<br />
					נא לא לסגור את החלונית
				</LoaderSubtext>
			</LoaderContainer>

			<FooterRow>
				<PrimaryButton
					onClick={handleSave}
					disabled={!hasAnyTask}
					title="שמור"
					width={123}
				/>
			</FooterRow>
		</ExtractionWrapper>
	) : (
		<TableWrapper>
			{finalStatus !== null && !alertDismissed && (
				<AIExtractionAlert
					status={finalStatus}
					count={extractedCount}
					onRetry={handleRetry}
					isRetrying={isRetrying}
					onDismiss={dismissAlert}
				/>
			)}

			<TableOuterContainer>
				<DataTable
					columns={columns}
					data={rows}
					getRowId={(row) => row.rowKey}
					meta={meta}
					containerClassName="overflow-x-hidden"
					expansionColSpan={columns.length - 1}
					renderRowExpansion={(row) =>
						row.original.assigneeIds.length > 1 &&
						expandedRows.has(row.original.id) ? (
							<TaskAssigneeExpansion
								workspaceId={workspaceId}
								row={row.original}
								onUpdateRow={(updates) => updateRow(row.original.id, updates)}
								onCollapse={() => toggleRowExpansion(row.original.id)}
							/>
						) : null
					}
				/>
			</TableOuterContainer>

			<FooterRow>
				<PrimaryButton
					onClick={handleSave}
					disabled={!hasAnyTask}
					title={`שמור${hasAnyTask ? ` (${filledCount})` : ""}`}
					width={123}
					loading={isLoading}
				/>
				<BackButton onClick={onBack}>חזור</BackButton>
			</FooterRow>
		</TableWrapper>
	)
}

export default CreateTasksTable

// ─── Loader Styled Components ────────────────────────────────────────────────

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const ExtractionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  min-height: 0;
  justify-content: space-between;
`

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 16px;
`

const LoaderImage = styled.img`
  width: 88px;
  height: 100px;
`

const SpinnerRing = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    rgba(var(--purple-accent-rgb), 0) 0deg,
    rgba(var(--purple-accent-rgb), 0.15) 60deg,
    #6866ff 200deg,
    #7604c8 310deg,
    rgba(118, 4, 200, 0) 360deg
  );
  animation: ${spin} 1.1s linear infinite;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    background: var(--background);
  }
`

const LoaderTitle = styled.p`
  font-size: var(--fs-lg);
  font-weight: 500;
  color: var(--foreground);
  margin: 0;
  text-align: center;
`

const LoaderSubtext = styled.p`
  font-size: var(--fs-base);
  font-weight: 400;
  color: var(--text-color-2);
  margin: 0;
  text-align: center;
  line-height: 24px;
`

// ─── Table Styled Components ────────────────────────────────────────────────

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  min-height: 0;
  gap: 16px;
  overflow-x: auto;
  `

const TableOuterContainer = styled.div`
  direction: ltr;
  flex: 1;
  min-height: 0;
  overflow-x: auto;
  overflow-y: auto;

  table {
    direction: rtl;
    border-collapse: separate;
    border-spacing: 0;
    table-layout: fixed;
    min-width: 0 !important;
    width: 100% !important;
  }

  th {
    height: 48px;
    padding: 12px;
    background: var(--background);
    border-top: 0.5px solid var(--Background-color-bg-text-active);
    border-bottom: 0.5px solid var(--Background-color-bg-text-active);
    border-inline-end: 0.5px solid var(--Background-color-bg-text-active);
    text-align: start;
    vertical-align: middle;
    white-space: nowrap;

    &:first-of-type {
      border-inline-start: 0.5px solid var(--Background-color-bg-text-active);
      border-start-start-radius: 8px;
    }

    &:nth-last-of-type(2) {
      border-start-end-radius: 8px;
    }

    &:last-of-type {
      border: none;
      background: var(--background);
      padding: 0;
    }
  }

  tr[data-slot="table-row"] {
    position: relative;

    &:hover td {
      background: var(--background-area);
    }

    &:hover td:last-of-type {
      background: var(--background);
    }

    &:last-of-type td:first-of-type {
      border-end-start-radius: 8px;
    }

    &:last-of-type td:nth-last-of-type(2) {
      border-end-end-radius: 8px;
    }
  }

  td {
    height: 44px;
    padding: 0px 12px;
    background: var(--background);
    vertical-align: middle;

    &:not(:last-of-type) {
      border-bottom: 0.5px solid var(--Background-color-bg-text-active);
      border-inline-end: 0.5px solid var(--Background-color-bg-text-active);
    }

    &:first-of-type {
      border-inline-start: 0.5px solid var(--Background-color-bg-text-active);
    }

    tr:not([data-expansion-row]) > &:last-of-type {
      border: none;
      background: transparent;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &:focus-within:not(:last-of-type) {
    &:focus-within,
    &:has([${DATA_CELL_ACTIVE_KEY}="true"]) {
      outline: 1px solid var(--button-color-hover);
      outline-offset: -2px;
    }
  }
}
`

// ─── Footer ─────────────────────────────────────────────────────────────────

const FooterRow = styled.div`
  direction: ltr;
  display: flex;
  margin-top: 16px;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 133px;
  height: 40px;
  border: 1px solid var(--Background-color-bg-text-active);
  border-radius: 8px;
  background: white;
  color: var(--text-color-2);
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 24px;
  cursor: pointer;
  white-space: nowrap;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: var(--shadow-inset);
    pointer-events: none;
  }

  &:hover {
    border-color: var(--button-color-hover);
    color: var(--button-color-hover);
  }
`
