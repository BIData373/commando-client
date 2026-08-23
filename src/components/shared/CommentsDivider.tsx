import styled from "@emotion/styled"
import type { RefObject } from "react"
import { useGetTask } from "src/api/task/task"

interface CommentsDividerProps {
	taskId: number
	dividerRef?: RefObject<HTMLDivElement | null>
}

export function CommentsDivider({ taskId, dividerRef }: CommentsDividerProps) {
	const { data: messageCount = 0 } = useGetTask(
		{ id: taskId },
		{ query: { select: ({ messageCount }) => messageCount } },
	)

	return (
		<Row ref={dividerRef}>
			<Line />
			<Label>{messageCount > 0 ? `תגובות (${messageCount})` : "תגובות"}</Label>
			<Line />
		</Row>
	)
}

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
`

const Line = styled.div`
  flex: 1;
  height: 1px;
  background: var(--line);
  min-width: 0;
`

const Label = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color);
  white-space: nowrap;
  flex-shrink: 0;
`
