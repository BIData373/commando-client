import styled from "@emotion/styled"
import type { PropsWithChildren } from "react"

interface MobileStatusSelectProps extends PropsWithChildren {
	onSelect(): void
	selected: boolean
}

export function MobileStatusSelect({
	children,
	onSelect,
	selected,
}: MobileStatusSelectProps) {
	return (
		<StatusSelect $selected={selected} onClick={onSelect}>
			{children}
		</StatusSelect>
	)
}

const StatusSelect = styled.div<{
	$selected: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  border-radius: 4px;
  background: ${({ $selected }) => ($selected ? "rgba(230, 244, 255, 0.25)" : "transparent")};
  cursor: pointer;
  outline: none;
`
