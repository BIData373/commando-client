import styled from "@emotion/styled"
import { MoreVertical, Trash2 } from "lucide-react"
import { type RefObject, useState } from "react"
import {
	getListMessagesQueryKey,
	useCreateMessage,
	useDeleteMessage,
	useListMessages,
} from "src/api/message/message"
import {
	getListPersonalTaskRowsQueryKey,
	getListTaskRowsQueryKey,
} from "src/api/task/task"
import { useCurrentUser } from "src/hooks/useCurrentUser"
import { invalidateQueries } from "src/queryClient"
import { formatDateMonthYear, formatMinutesHours } from "src/utils/time-format"
import { CommentsDivider } from "../shared/CommentsDivider"
import { SpinIcon } from "../shared/SpinIcon"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"

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
	const currentUser = useCurrentUser()

	const { data: messages = [] } = useListMessages({ taskId })

	const { mutate: createMessage, isPending: isSendingComment } =
		useCreateMessage()
	const { mutate: deleteMessage } = useDeleteMessage({
		mutation: {
			onSuccess() {
				invalidateQueries([getListMessagesQueryKey({ taskId })])
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
		createMessage(
			{ data: { taskId, content } },
			{
				onSuccess() {
					setCommentValue("")
					invalidateQueries([
						getListMessagesQueryKey({ taskId }),
						getListTaskRowsQueryKey(),
						getListPersonalTaskRowsQueryKey(),
					])
				},
			},
		)
	}

	return (
		<Wrapper>
			<CommentsDivider taskId={taskId} dividerRef={commentsDividerRef} />
			<TextareaRow>
				<CommentsTextarea
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
				<CommentCard key={msg.id}>
					<CommentMainRow>
						{(isManager || msg.user.upn === currentUser.upn) && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<CommentMenuButton>
										<MoreVertical size={14} />
									</CommentMenuButton>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" side="bottom">
									<DeleteMenuItem
										onClick={() =>
											deleteMessage({
												pathParams: { id: msg.id },
											})
										}
									>
										מחק תגובה
										<Trash2 size={16} />
									</DeleteMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
						<CommentContent>{msg.content}</CommentContent>
					</CommentMainRow>
					<CommentFooter>
						<CommentDate>
							{formatMinutesHours(msg.createdAt)} ·{" "}
							{formatDateMonthYear(msg.createdAt)}
						</CommentDate>
						<CommentUserDetails>
							<CommentUserMeta>
								{msg.user.upn}
								{msg.user.info?.displayName &&
									` - ${msg.user.info.displayName}`}
							</CommentUserMeta>
							<CommentUserName>
								{msg.user.info?.name ?? msg.user.upn}
							</CommentUserName>
						</CommentUserDetails>
					</CommentFooter>
				</CommentCard>
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

const CommentCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--card-background);
  width: 100%;
  direction: ltr;
`

const CommentMainRow = styled.div`
  display: flex;
  gap: 4px;
  align-items: flex-start;
  width: 100%;
`

const CommentMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  flex-shrink: 0;
  color: var(--sea-ink-soft);
  cursor: pointer;
  outline: none;

  &:hover,
  &[data-state="open"] {
    background: var(--Background-color-bg-text-active);
    color: var(--sea-ink);
  }
`

const DeleteMenuItem = styled(DropdownMenuItem)`
  color: var(--Components-Form-Component-labelRequiredMarkColor);
  gap: 8px;
  justify-content: flex-end;
  cursor: pointer;
`

const CommentContent = styled.p`
  flex: 1;
  min-width: 0;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--sea-ink);
  text-align: end;
  width: 100%;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  margin: 0;
`

const CommentFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: var(--fs-sm);
  line-height: 20px;
  white-space: nowrap;
`

const CommentDate = styled.span`
  font-weight: 400;
  color: var(--text-color-400);
`

const CommentUserDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: end;
`

const CommentUserMeta = styled.span`
  font-weight: 400;
  color: var(--sea-ink-soft);
`

const CommentUserName = styled.span`
  font-weight: 500;
  color: var(--sea-ink);
`
