import styled from "@emotion/styled"
import { useSearch } from "@tanstack/react-router"
import { Send } from "lucide-react"
import { type RefObject, useEffect, useRef, useState } from "react"
import {
	useCreateMessage,
	useDeleteMessage,
	useListMessages,
} from "src/api/message/message"
import { handleSettled } from "src/functions/comment-utils"
import { useIsMobile } from "src/hooks/use-mobile"
import { useCurrentUser } from "src/hooks/useCurrentUser"
import { CommentsDivider } from "./CommentsDivider"
import { SpinIcon } from "./SpinIcon"
import TaskComment from "./TaskComment"

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
	const [commentValue, setCommentValue] = useState("")
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const { focusComment } = useSearch({ strict: false }) as {
		focusComment?: boolean
	}

	useEffect(() => {
		if (focusComment) {
			requestAnimationFrame(() => {
				textareaRef.current?.scrollIntoView({ behavior: "smooth" })
				textareaRef.current?.focus()
			})
		}
	}, [focusComment])

	const { data: messages = [] } = useListMessages({ taskIds: [taskId] })

	const currentUser = useCurrentUser()

	const { mutate: createMessage, isPending: isSendingComment } =
		useCreateMessage({
			mutation: {
				meta: { toast: { error: true } },
				onSettled: () => handleSettled(taskId),
				onSuccess() {
					setCommentValue("")
				},
			},
		})
	const { mutate: deleteMessage } = useDeleteMessage({
		mutation: {
			meta: { toast: { error: true } },
			onSettled: () => handleSettled(taskId),
		},
	})

	function handleDeleteComment(id: number) {
		deleteMessage({ pathParams: { id } })
	}

	function handleCommentInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
		setCommentValue(e.target.value)
	}

	function handleCommentKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault()
			submitComment()
		}
	}

	function submitComment() {
		const content = commentValue.trim()
		if (!content) return
		createMessage({ data: { taskId, content } })
	}

	const commentList = messages.map((msg) => (
		<TaskComment
			key={msg.id}
			message={msg}
			canDelete={isManager || msg.user.upn === currentUser.upn}
			onDelete={handleDeleteComment}
		/>
	))

	const commentsTextArea = (
		<CommentsTextarea
			ref={textareaRef}
			value={commentValue}
			onChange={handleCommentInput}
			onKeyDown={handleCommentKeyDown}
			placeholder="הוספת תגובה"
			disabled={isSendingComment}
			dir="rtl"
			rows={1}
		/>
	)

	return (
		<Wrapper $isMobile={isMobile}>
			{commentsDividerRef && (
				<CommentsDivider taskId={taskId} dividerRef={commentsDividerRef} />
			)}

			{isMobile ? (
				<>
					<CommentsSection>{commentList}</CommentsSection>
					<MobileTextareaRow>
						{commentsTextArea}
						{commentValue ? (
							isSendingComment ? (
								<IconContainer $withBorder={false}>
									<SpinIcon size={16} />
								</IconContainer>
							) : (
								<IconContainer $withBorder={true} onClick={submitComment}>
									<Send size={16} color="var(--active-color)" />
								</IconContainer>
							)
						) : null}
					</MobileTextareaRow>
				</>
			) : (
				<>
					<TextareaRow>
						{commentsTextArea}
						{isSendingComment && <SpinIcon size={16} />}
					</TextareaRow>
					{commentList}
				</>
			)}
		</Wrapper>
	)
}

export default TaskCommentsSection

const Wrapper = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? "none" : "20px")};
  width: 100%;
  padding-bottom: ${({ $isMobile }) => ($isMobile ? "none" : "12px")};
  min-height: ${({ $isMobile }) => ($isMobile ? "70vh" : "auto")};
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

const TextareaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-top: 0.75rem;
`

const MobileTextareaRow = styled(TextareaRow)`
  position: sticky;
  bottom: 0;
  padding: 0.75rem 1.5rem 1.5rem;
  background: white;
  flex-shrink: 0;
  border-top: 1px solid var(--button-hover);
  gap: 16px;
  align-items: flex-end;
`

const CommentsTextarea = styled.textarea`
  field-sizing: content;
  width: 100%;
  min-height: 32px;
  max-height: 124px;
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 4px 11px;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  font-family: inherit;
  color: var(--sea-ink);
  background: var(--background);
  text-align: start;
  outline: none;
  resize: none;
  overflow-y: auto;

  &::placeholder {
    color: var(--Text-color-text-placeholder);
  }

  &:hover {
    border-color: var(--button-color-hover);
  }

  &:focus {
    border-color: var(--active-color);
    box-shadow: var(--shadow-textarea-focus);
  }
`

const IconContainer = styled.button<{ $withBorder: boolean }>`
	flex-shrink: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 32px;
	width: 32px;
	border: ${({ $withBorder }) => ($withBorder ? "1px solid var(--active-color)" : "none")};
	border-radius: 8px;
`
