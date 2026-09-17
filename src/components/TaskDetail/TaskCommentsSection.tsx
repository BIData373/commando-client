import styled from "@emotion/styled"
import { useSearch } from "@tanstack/react-router"
import { type RefObject, useEffect, useRef, useState } from "react"
import {
	getListMessagesQueryKey,
	useCreateMessage,
	useDeleteMessage,
	useListMessages,
} from "src/api/message/message"
import {
	getGetTaskQueryKey,
	getListPersonalTaskRowsQueryKey,
	getListTaskRowsQueryKey,
} from "src/api/task/task"
import { useCurrentUser } from "src/hooks/useCurrentUser"
import { invalidateQueries } from "src/query-client"
import { CommentsDivider } from "../shared/CommentsDivider"
import { SpinIcon } from "../shared/SpinIcon"
import TaskComment from "./TaskComment"

interface TaskCommentsSectionProps {
	taskId: number
	isManager: boolean
	commentsDividerRef: RefObject<HTMLDivElement | null>
}

function TaskCommentsSection({
	taskId,
	isManager,
	commentsDividerRef,
}: TaskCommentsSectionProps) {
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

	const currentUser = useCurrentUser()

	const { data: messages = [] } = useListMessages({ taskIds: [taskId] })

	function handleSettled() {
		invalidateQueries([
			getListMessagesQueryKey({ taskIds: [taskId] }),
			getGetTaskQueryKey({ id: taskId }),
			getListTaskRowsQueryKey(),
			getListPersonalTaskRowsQueryKey(),
		])
	}

	const { mutate: createMessage, isPending: isSendingComment } =
		useCreateMessage({
			mutation: {
				meta: { toast: { error: true } },
				onSettled: handleSettled,
				onSuccess() {
					setCommentValue("")
				},
			},
		})
	const { mutate: deleteMessage } = useDeleteMessage({
		mutation: {
			meta: { toast: { error: true } },
			onSettled: handleSettled,
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

	return (
		<Wrapper>
			<CommentsDivider taskId={taskId} dividerRef={commentsDividerRef} />
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
				{isSendingComment && <SpinIcon size={16} />}
			</TextareaRow>
			{messages.map((msg) => (
				<TaskComment
					key={msg.id}
					message={msg}
					canDelete={isManager || msg.user.upn === currentUser.upn}
					onDelete={handleDeleteComment}
				/>
			))}
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
`

const TextareaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-top: 12px;
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
