import styled from "@emotion/styled"
import type { CellContext } from "@tanstack/react-table"
import { BsPaperclip as Paperclip } from "react-icons/bs"
import type { TaskRowDto } from "src/api/model"
import { useTaskTable } from "src/providers/TaskTableProvider"
import type { AppTableFeatures } from "src/utils/table-features"
import { formatDateShort } from "../../../functions/date-utils"
import HighlightMatch from "../../shared/HighlightMatch"

export function SourceCell<TTask extends TaskRowDto, TValue>({
	row: {
		original: { source },
	},
}: CellContext<AppTableFeatures, TTask, TValue>) {
	const { searchQuery } = useTaskTable()

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
		<CellRoot>
			{source.attachmentKey && <SourceAttachmentIcon size={18} />}

			{sourceText && (
				<SourceText>
					<HighlightMatch
						text={sourceText}
						query={searchQuery}
						variant="mark"
					/>
				</SourceText>
			)}
		</CellRoot>
	)
}

const CellRoot = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--sea-ink-soft);
`

const SourceAttachmentIcon = styled(Paperclip)`
  flex-shrink: 0;
  color: var(--text-color-400);
`

const SourceText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color);
`
