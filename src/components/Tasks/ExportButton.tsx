import styled from "@emotion/styled"
import { Download } from "lucide-react"
import { useState } from "react"
import { useListMessages } from "src/api/message/message"
import type { ListMessagesParams, MessageDto, TaskRowDto } from "src/api/model"
import { SpinIcon } from "src/components/shared/SpinIcon"
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
	const [isExporting, setIsExporting] = useState(false)

	const needsMessages = !hiddenColumns.has(
		TASK_COLUMN_ID.lastMessage as keyof TTask,
	)

	const { refetch } = useListMessages(messagesParams, {
		query: { enabled: false },
	})

	async function handleExport() {
		setIsExporting(true)
		try {
			let messages: MessageDto[] = []
			if (needsMessages) {
				const { data = [] } = await refetch()
				messages = data
			}

			exportTasksToExcel(
				exportRows,
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
