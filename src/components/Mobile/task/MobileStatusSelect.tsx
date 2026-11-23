import styled from "@emotion/styled"
import type { PropsWithChildren } from "react"

interface MobileStatusSelectProps extends PropsWithChildren {
	onSelect(): void
	selected: boolean
	testId?: string
	entityId?: number
}

export function MobileStatusSelect({
	children,
	onSelect,
	selected,
	testId,
	entityId,
}: MobileStatusSelectProps) {
	return (
		<StatusSelect
			data-testid={testId}
			data-entity-id={entityId}
			data-selected={selected || undefined}
			$selected={selected}
			onClick={onSelect}
		>
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
  background: ${({ $selected }) => ($selected ? "var(--drawer-status-select)" : "transparent")};
  cursor: pointer;
  outline: none;
`
