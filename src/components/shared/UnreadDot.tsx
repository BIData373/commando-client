import styled from "@emotion/styled"

interface UnreadDotProps {
	right: number
	top: number
}

export function UnreadDot({ right, top }: UnreadDotProps) {
	return <Unread $right={right} $top={top} />
}

const Unread = styled.span<{ $right: number; $top: number }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: absolute;
  inset-inline-end: 6px;
  right: ${({ $right }) => $right}px;
  top: ${({ $top }) => $top}px;
  background-color: var(--active-color);
`
