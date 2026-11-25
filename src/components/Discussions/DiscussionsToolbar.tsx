import styled from "@emotion/styled"
import type { ReactNode } from "react"

interface DiscussionsToolbarProps {
	/** Rendered at the inline-start edge (visual right in RTL) */
	startContent?: ReactNode
	/** Rendered at the inline-end edge (visual left in RTL) */
	endContent?: ReactNode
}

export function DiscussionsToolbar({
	startContent,
	endContent,
}: DiscussionsToolbarProps) {
	return (
		<Bar>
			<Group>{startContent}</Group>
			<Group>{endContent}</Group>
		</Bar>
	)
}

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 40px;
`

const Group = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`
