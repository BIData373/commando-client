import styled from "@emotion/styled"
import type { WorkspaceStatusDto } from "src/api/model"

interface StatusTagProps {
	status: WorkspaceStatusDto
	interactive?: boolean
}

export function StatusTag({
	status: { name, color },
	interactive,
}: StatusTagProps) {
	return (
		<Tag $fontColor={color} $backgroundColor={color} $interactive={interactive}>
			{name}
		</Tag>
	)
}

const Tag = styled.span<{
	$fontColor: string
	$backgroundColor: string
	$interactive?: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  cursor: ${({ $interactive }) => ($interactive ? "pointer" : "default")};
  ${({ $fontColor }) => `color: ${$fontColor};`}
  ${({ $backgroundColor }) => `background:  rgb(from ${$backgroundColor} r g b / 0.1);`}

  :focus-visible {
    outline: none;
  }
`
