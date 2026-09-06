import styled from "@emotion/styled"
import { Download } from "lucide-react"
import { listMessages } from "src/api/message/message"
import type { ListMessagesParams, TaskRowDto } from "src/api/model"
import { exportTasksToExcel } from "src/functions/export-excel"
import { TASK_COLUMN_ID } from "src/utils/task-table-utils"

interface ExportButtonProps<TTask extends TaskRowDto> {
	exportRows: TTask[]
	columnOrder: (keyof TTask)[]
	hiddenColumns: Set<keyof TTask>
	messagesParams: ListMessagesParams
	exportFilePrefix?: string
}

function ExportButton<TTask extends TaskRowDto>({
	exportRows,
	columnOrder,
	hiddenColumns,
	messagesParams,
	exportFilePrefix,
}: ExportButtonProps<TTask>) {
	async function handleExport() {
		const messages = !hiddenColumns.has(
			TASK_COLUMN_ID.lastMessage as keyof TTask,
		)
			? await listMessages(messagesParams)
			: []

		exportTasksToExcel(
			exportRows,
			columnOrder,
			hiddenColumns,
			messages,
			exportFilePrefix,
		)
	}

	return (
		<ActionButton onClick={handleExport}>
			<Download size={18} />
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
