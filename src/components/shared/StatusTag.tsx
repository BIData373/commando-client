import styled from "@emotion/styled"
import { ChevronDown } from "lucide-react"
import type { WorkspaceStatusDto } from "src/api/model"

interface StatusTagProps {
	status: WorkspaceStatusDto
	interactive?: boolean
	editable?: boolean
	withArrow?: boolean
	open?: boolean
}

export function StatusTag({
	status: { name, color },
	interactive,
	editable,
	withArrow = false,
	open = false,
}: StatusTagProps) {
	return (
		<Tag
			$fontColor={color}
			$backgroundColor={color}
			$interactive={interactive}
			$editable={editable}
			$withArrow={withArrow}
		>
			{name}
			{withArrow && <Arrow size={12} $open={open} />}
		</Tag>
	)
}

const Arrow = styled(ChevronDown)<{ $open: boolean }>`
  flex-shrink: 0;
  color: #00000073;
  transition: transform 0.2s ease;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
`

const Tag = styled.span<{
	$fontColor: string
	$backgroundColor: string
	$interactive?: boolean
	$editable?: boolean
	$withArrow?: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: ${({ $withArrow }) => ($withArrow ? "88px" : "72px")};
  padding: 1px 8px;
  border-radius: 999px;
  font-size: var(--fs-sm);
  line-height: 20px;
  white-space: nowrap;
  cursor: ${({ $interactive, $editable }) =>
		$interactive ? ($editable ? "pointer" : "not-allowed") : "default"};
  ${({ $fontColor }) => `color: ${$fontColor};`}
  ${({ $backgroundColor }) => `background:  rgb(from ${$backgroundColor} r g b / 0.1);`}

  :focus-visible {
    outline: none;
  }
`
