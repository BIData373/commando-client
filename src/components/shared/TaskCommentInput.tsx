import styled from "@emotion/styled"
import { useSearch } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"
import { useCreateMessage } from "src/api/message/message"
import { invalidateTaskComments } from "src/functions/comment-utils"
import { MOBILE_MEDIA_QUERY, useIsMobile } from "src/hooks/use-mobile"
import { CommentSendButton } from "./CommentSendButton"
import { SpinIcon } from "./SpinIcon"

interface TaskCommentInputProps {
	taskId: number
}

function TaskCommentInput({ taskId }: TaskCommentInputProps) {
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

	const { mutate: createMessage, isPending: isSendingComment } =
		useCreateMessage({
			mutation: {
				meta: { toast: { error: true } },
				onSettled: () => invalidateTaskComments(taskId),
				onSuccess() {
					setCommentValue("")
				},
			},
		})

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

	return (
		<TextareaRow>
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
			{isMobile && commentValue && (
				<CommentSendButton
					isSending={isSendingComment}
					onSend={submitComment}
				/>
			)}
			{!isMobile && isSendingComment && <SpinIcon size={16} />}
		</TextareaRow>
	)
}

export default TaskCommentInput

const TextareaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-top: 0.75rem;

  ${MOBILE_MEDIA_QUERY} {
    position: sticky;
    bottom: 0;
    padding: 0.75rem 1.5rem 1.5rem;
    background: white;
    flex-shrink: 0;
    border-top: 1px solid var(--button-hover);
    gap: 16px;
    align-items: flex-end;
  }
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
