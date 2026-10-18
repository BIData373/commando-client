import styled from "@emotion/styled"

export const UnreadDot = styled.span<{ $right?: number; $top?: number }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  position: absolute;
  inset-inline-end: 6px;
  right: ${({ $right }) => $right ?? 0}px;
  top: ${({ $top }) => $top ?? 0}px;
  background-color: var(--active-color);
`
