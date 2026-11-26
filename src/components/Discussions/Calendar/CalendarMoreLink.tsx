import styled from "@emotion/styled"
import { ChevronDown, ChevronUp } from "lucide-react"

interface CalendarMoreLinkProps {
	hiddenCount: number
	isExpanded: boolean
	onToggle: () => void
}

export function CalendarMoreLink({
	hiddenCount,
	isExpanded,
	onToggle,
}: CalendarMoreLinkProps) {
	return (
		<Root type="button" onClick={onToggle}>
			{isExpanded ? "כווץ" : `+${hiddenCount}`}
			{isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
		</Root>
	)
}

const Root = styled.button`
  display: flex;
  align-items: center;
  width: fit-content;
  margin-inline-start: auto;
  gap: 8px;
  height: 24px;
  padding-inline: 7px;
  border: none;
  border-radius: 4px;
  background: none;
  font-size: var(--fs-btn);
  line-height: 22px;
  color: var(--text-color-400);
  cursor: pointer;

  &:hover {
    background: var(--button-hover);
  }
`
