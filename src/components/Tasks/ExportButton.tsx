import styled from "@emotion/styled"
import { useQueryClient } from "@tanstack/react-query"
import { Download } from "lucide-react"
import { useState } from "react"
import { getListMessagesQueryKey, listMessages } from "src/api/message/message"
import type { ListMessagesParams, MessageDto, TaskRowDto } from "src/api/model"
import { SpinIcon } from "src/components/shared/SpinIcon"
import { exportTasksToExcel } from "src/functions/export-excel"
import { TASK_COLUMN_ID } from "src/utils/task-table-utils"

export interface TaskExport<TTask extends TaskRowDto> {
	rows: TTask[]
	messagesParams: ListMessagesParams
}

interface ExportButtonProps<TTask extends TaskRowDto> {
	getExport(): TaskExport<TTask>
	columnOrder: (keyof TTask)[]
	hiddenColumns: Set<keyof TTask>
	exportFilePrefix?: string
}

function ExportButton<TTask extends TaskRowDto>({
	getExport,
	columnOrder,
	hiddenColumns,
	exportFilePrefix,
}: ExportButtonProps<TTask>) {
	const queryClient = useQueryClient()
	const [isExporting, setIsExporting] = useState(false)

	const needsMessages = !hiddenColumns.has(
		TASK_COLUMN_ID.lastMessage as keyof TTask,
	)

	async function fetchMessages(params: ListMessagesParams) {
		try {
			return await queryClient.fetchQuery({
				queryKey: getListMessagesQueryKey(params),
				queryFn: ({ signal }) => listMessages(params, signal),
				staleTime: 0,
			})
		} catch {
			return []
		}
	}

	async function handleExport() {
		setIsExporting(true)
		try {
			const { rows, messagesParams } = getExport()
			const messages: MessageDto[] = needsMessages
				? await fetchMessages(messagesParams)
				: []

			exportTasksToExcel(
				rows,
				columnOrder,
				hiddenColumns,
				messages,
				exportFilePrefix,
			)
		} finally {
			setIsExporting(false)
		}
	}

	return (
		<ActionButton onClick={handleExport} disabled={isExporting}>
			{isExporting ? <SpinIcon size={18} /> : <Download size={18} />}
		</ActionButton>
	)
}

export { ExportButton }

const ActionButton = styled.button`
  display: flex;
  padding: 0 15px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--card-border);
  background: var(--background);
  box-shadow: var(--shadow-button);
  cursor: pointer;
  white-space: nowrap;

  &:hover {
	background: var(--link-bg-hover);
  }
`
