import styled from "@emotion/styled"
import { layerFill } from "../../../functions/color-utils"

interface CalendarDiscussionChipProps {
	title: string
	isToday: boolean
}

export function CalendarDiscussionChip({
	title,
	isToday,
}: CalendarDiscussionChipProps) {
	return (
		<Root $isToday={isToday} title={title}>
			{title}
		</Root>
	)
}

const Root = styled.div<{ $isToday: boolean }>`
  width: 100%;
  height: 28px;
  padding-block: 2px;
  padding-inline: 8px;
  border: 1px solid var(--colors-base-neutral-11);
  border-radius: 4px;
  background: ${({ $isToday }) => ($isToday ? "var(--background)" : "var(--card-background)")};
  font-size: var(--fs-btn);
  line-height: 22px;
  color: var(--text-color-2);
  text-align: start;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;

  /* On today's purple cell, state fills sit over white so the purple doesn't show through */
  &:hover {
    background: ${({ $isToday }) =>
			$isToday
				? layerFill(
						"var(--Components-Dropdown-Global-controlItemBgHover)",
						"var(--background)",
					)
				: "var(--button-hover)"};
  }

  &:active {
    background: ${({ $isToday }) =>
			$isToday
				? layerFill(
						"var(--Background-color-bg-text-active)",
						"var(--background)",
					)
				: "var(--Background-color-bg-text-active)"};
  }
`
