import styled from "@emotion/styled"
import type { RefObject } from "react"
import { MOBILE_MEDIA_QUERY, useIsMobile } from "src/hooks/use-mobile"
import { CommentsDivider } from "./CommentsDivider"
import TaskCommentInput from "./TaskCommentInput"
import TaskCommentList from "./TaskCommentList"

interface TaskCommentsSectionProps {
	taskId: number
	isManager: boolean
	commentsDividerRef?: RefObject<HTMLDivElement | null>
}

function TaskCommentsSection({
	taskId,
	isManager,
	commentsDividerRef,
}: TaskCommentsSectionProps) {
	const isMobile = useIsMobile()

	return (
		<Wrapper>
			{commentsDividerRef && (
				<CommentsDivider taskId={taskId} dividerRef={commentsDividerRef} />
			)}

			{isMobile ? (
				<>
					<CommentsSection>
						<TaskCommentList taskId={taskId} isManager={isManager} />
					</CommentsSection>
					<TaskCommentInput taskId={taskId} />
				</>
			) : (
				<>
					<TaskCommentInput taskId={taskId} />
					<TaskCommentList taskId={taskId} isManager={isManager} />
				</>
			)}
		</Wrapper>
	)
}

export default TaskCommentsSection

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding-bottom: 12px;

  ${MOBILE_MEDIA_QUERY} {
    gap: 0;
    padding-bottom: 0;
    min-height: 70vh;
  }
`

const CommentsSection = styled.div`
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 0.75rem 1.5rem 0;
	overflow-y: auto;
    scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}
`
