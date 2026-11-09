import styled from "@emotion/styled"
import type { RefObject } from "react"
import { useListMessages } from "src/api/message/message"
import { useGetTask } from "src/api/task/task"
import { UnreadDot } from "./UnreadDot"

interface CommentsDividerProps {
	taskId: number
	dividerRef?: RefObject<HTMLDivElement | null>
}

export function CommentsDivider({ taskId, dividerRef }: CommentsDividerProps) {
	const { data: task } = useGetTask({ id: taskId })
	const { data: messages = [] } = useListMessages({ taskIds: [taskId] })

	const count = task?.messageCount ?? 0
	const hasComments = count > 0
	const hasUnread = messages.some((message) => !message.viewed)

	return (
		<Row ref={dividerRef}>
			<Line />
			<Label>
				תגובות
				{hasComments && (
					<Count>
						({count}){hasUnread && <CountDot />}
					</Count>
				)}
			</Label>
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
  gap: 4px;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color);
  white-space: nowrap;
  flex-shrink: 0;
`

const Count = styled.span`
  position: relative;
`

const CountDot = styled(UnreadDot)`
  inset-inline-end: auto;
  left: auto;
  right: -2px;
  top: 0px;
`
