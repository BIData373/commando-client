import styled from "@emotion/styled"
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react"
import { useTaskTable } from "src/providers/TaskTableProvider"
import { COLUMN_LABELS } from "src/utils/task-table-utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip"

export function TitleColumnHeader() {
	const { titleExpanded, onToggleTitleExpanded } = useTaskTable()

	return (
		<HeaderWrapper>
			<Label>{COLUMN_LABELS.title}</Label>
			<Tooltip>
				<TooltipTrigger asChild>
					<ToggleButton onClick={onToggleTitleExpanded}>
						{titleExpanded ? (
							<ChevronsDownUp size={16} />
						) : (
							<ChevronsUpDown size={16} />
						)}
					</ToggleButton>
				</TooltipTrigger>
				<TooltipContent>
					{titleExpanded ? "צמצם תצוגת טקסט" : "הצג טקסט מלא"}
				</TooltipContent>
			</Tooltip>
		</HeaderWrapper>
	)
}

// ─── Styled ──────────────────────────────────────────────────────────────────

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 100%;
  width: 100%;
`

const Label = styled.span`
  white-space: normal;
  overflow-wrap: break-word;
`

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: var(--text-color-400);
  flex-shrink: 0;

  &:hover {
    background: var(--button-hover);
    color: var(--text-color);

  }
`
