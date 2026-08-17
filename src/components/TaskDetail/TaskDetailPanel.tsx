import { keyframes } from "@emotion/react"
import styled from "@emotion/styled"
import { concat, uniqBy } from "lodash"
import {
	Calendar,
	Loader2,
	MoreVertical,
	Paperclip,
	Pencil,
	Trash2,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import {
	getListMessagesQueryKey,
	useCreateMessage,
	useDeleteMessage,
	useListMessages,
} from "src/api/message/message"
import {
	DeadlineType,
	PermissionType,
	type TaskDetailsDto,
} from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { getAttachmentSignedUrl } from "src/api/s3/s3"
import {
	getGetTaskQueryKey,
	getListPersonalTaskRowsQueryKey,
	getListTaskRowsQueryKey,
	useDeleteTask,
} from "src/api/task/task"
import { useListTaskHistory } from "src/api/task-history/task-history"
import { downloadFromUrl } from "src/functions/download-utils"
import { useCurrentUser } from "src/hooks/useCurrentUser"
import { invalidateQueries } from "src/queryClient"
import { getDeadlineDisplayDate } from "src/utils/deadline-utils"
import { formatDateMonthYear, formatMinutesHours } from "src/utils/time-format"
import EditDiscussionModal from "../CreateTasksFromDiscussion/EditDiscussionModal"
import { DeadlineTypeTag } from "../shared/DeadlineTypeTag"
import FlagIcon from "../shared/FlagIcon"
import { ModalContent } from "../shared/ModalContent"
import { StatusTag } from "../shared/StatusTag"
import WorkspaceCell from "../shared/WorkspaceCell"
import { RowActionsMenu } from "../Tasks/RowActionsMenu"
import { Dialog } from "../ui/dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { AssigneeSection } from "./AssigneeSection"
import TaskHistoryPanel from "./TaskHistoryPanel"

interface TaskDetailPanelProps {
	task: TaskDetailsDto
	onClose: () => void
	onEdit?: () => void
	showWorkspace?: boolean
	isArchived?: boolean
}

function TaskDetailPanel({
	task: {
		id,
		title,
		flagged,
		deadlineType,
		dueDate,
		updatedAt,
		createdAt,
		source,
		tags,
		assigneeStatuses,
		status,
		workspace,
		workspace: { id: workspaceId, permissionType },
	},
	showWorkspace = false,
	onClose,
	onEdit,
	isArchived = false,
}: TaskDetailPanelProps) {
	const [showHistory, setShowHistory] = useState(false)
	const [showEditDiscussion, setShowEditDiscussion] = useState(false)
	const [commentValue, setCommentValue] = useState("")
	const [commentsDividerStuck, setCommentsDividerStuck] = useState(false)
	const commentsDividerRef = useRef<HTMLDivElement>(null)
	const scrollRef = useRef<HTMLDivElement>(null)
	const [scrollShadow, setScrollShadow] = useState({
		top: false,
		bottom: false,
	})

	function checkCommentsDividerVisibility() {
		const el = scrollRef.current
		const divider = commentsDividerRef.current
		if (!el || !divider) return
		const scrollRect = el.getBoundingClientRect()
		const dividerRect = divider.getBoundingClientRect()
		setCommentsDividerStuck(dividerRect.top > scrollRect.bottom)
	}

	useEffect(() => {
		requestAnimationFrame(checkCommentsDividerVisibility)
	}, [])

	const currentUser = useCurrentUser()
	const { data: myPermission } = useGetMyPermission({ workspaceId })
	const isManager = myPermission?.type === PermissionType.MANAGER

	const { data: history } = useListTaskHistory({ taskId: id })
	const { data: messages = [], isLoading: isLoadingMessages } = useListMessages(
		{ taskId: id },
	)

	function handleSuccess() {
		invalidateQueries([
			getListTaskRowsQueryKey({ workspaceId }),
			getListPersonalTaskRowsQueryKey(),
		])
	}

	const { mutate: deleteTaskMutate } = useDeleteTask({
		mutation: { onSuccess: handleSuccess },
	})

	const displayDate = getDeadlineDisplayDate(
		deadlineType,
		dueDate,
		source,
		createdAt,
	)
	const showDueDateMeta = deadlineType !== DeadlineType.IMMEDIATE

	const allTags = uniqBy(concat(tags, source?.tags ?? []), "id")

	const [isDownloadingAttachment, setIsDownloadingAttachment] = useState(false)

	async function handleAttachmentDownload() {
		if (
			!source?.attachmentKey ||
			!source?.attachmentName ||
			isDownloadingAttachment
		)
			return
		setIsDownloadingAttachment(true)
		try {
			const { url } = await getAttachmentSignedUrl({
				key: source.attachmentKey,
				filename: source.attachmentName,
			})
			if (url) await downloadFromUrl(url, source.attachmentName)
		} finally {
			setIsDownloadingAttachment(false)
		}
	}

	function handleScroll() {
		const el = scrollRef.current
		if (!el) return
		const atTop = el.scrollTop <= 0
		const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
		setScrollShadow({ top: !atTop, bottom: !atBottom })
		checkCommentsDividerVisibility()
	}

	function handleCloseEditDiscussion() {
		setShowEditDiscussion(false)
	}

	const { mutate: createMessage, isPending: isSendingComment } =
		useCreateMessage()
	const { mutate: deleteMessage } = useDeleteMessage({
		mutation: {
			onSuccess() {
				invalidateQueries([getListMessagesQueryKey({ taskId: id })])
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
			{ data: { taskId: id, content } },
			{
				onSuccess() {
					setCommentValue("")
					invalidateQueries([getListMessagesQueryKey({ taskId: id })])
				},
			},
		)
	}

	function handleOpenChange(open: boolean) {
		if (!open) onClose()
	}

	function handleEdit() {
		if (!onEdit) return
		handleSuccess()
		onEdit()
	}

	function handleDelete() {
		deleteTaskMutate({ pathParams: { id } })
		onClose()
	}

	function handleEditDiscussionSuccess() {
		invalidateQueries([
			getListTaskRowsQueryKey({ workspaceId }),
			getGetTaskQueryKey({ id }),
		])
	}

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<Panel
				headerActions={
					<>
						<TaskIdLabel>#{id}</TaskIdLabel>
						<RowActionsMenu
							workspaceId={workspaceId}
							onEdit={isManager && onEdit ? handleEdit : undefined}
							onDelete={isManager ? handleDelete : undefined}
						/>
					</>
				}
			>
				<HeaderRow>
					{showWorkspace && (
						<WorkspaceCell workspace={workspace} iconSize={20} />
					)}

					<TitleRow $shadow={scrollShadow.top}>
						<TextWrapper>
							{flagged && <FlagIcon size={20} />}
							<TitleText title={title}>{title}</TitleText>
						</TextWrapper>
					</TitleRow>
				</HeaderRow>

				<ScrollContent ref={scrollRef} onScroll={handleScroll}>
					<DeadlineSection>
						<SectionLabel>תג"ב</SectionLabel>
						<MetaRow>
							<DueDateGroup>
								<DeadlineTypeTag type={deadlineType} />
								{displayDate && (
									<DateContainer>
										{showDueDateMeta && <MetaLabel>עד</MetaLabel>}
										<DueDateText>
											{formatDateMonthYear(displayDate)}
										</DueDateText>
										{showDueDateMeta && <Calendar size={16} />}
									</DateContainer>
								)}
							</DueDateGroup>
							<CreatedGroup>
								{/* <HistoryButton onClick={() => setShowHistory(true)}>
										<History size={16} />
									</HistoryButton> */}
								<MetaText>
									{formatMinutesHours(updatedAt)} -{" "}
									{formatDateMonthYear(updatedAt)}
								</MetaText>
							</CreatedGroup>
						</MetaRow>
					</DeadlineSection>

					{assigneeStatuses.length > 0 ? (
						<AssigneeSection
							taskId={id}
							workspaceId={workspaceId}
							assigneeStatuses={assigneeStatuses}
							isArchived={isArchived}
						/>
					) : (
						status && (
							<StatusTagContainer>
								<StatusTag status={status} />
							</StatusTagContainer>
						)
					)}

					<InfoGrid>
						{!!source && (
							<InfoBlock>
								<SectionLabel>מקור הנחיה</SectionLabel>
								<SourceRow>
									{permissionType === PermissionType.MANAGER && (
										<PencilButton onClick={() => setShowEditDiscussion(true)}>
											<Pencil size={14} />
										</PencilButton>
									)}
									<SourceName>{source.name}</SourceName>
									{source.date && (
										<SourceDate>{formatDateMonthYear(source.date)}</SourceDate>
									)}
								</SourceRow>
								<InfoAttachment>
									{source.attachmentKey && (
										<>
											<Paperclip size={16} />
											<AttachmentDownloadButton
												onClick={handleAttachmentDownload}
												disabled={isDownloadingAttachment}
											>
												{source.attachmentName}
												{isDownloadingAttachment && (
													<AttachmentSpinIcon size={12} />
												)}
											</AttachmentDownloadButton>
										</>
									)}
								</InfoAttachment>
							</InfoBlock>
						)}
						{allTags.length > 0 && (
							<InfoBlock>
								<SectionLabel>נושא</SectionLabel>
								<TagsRow>
									{allTags.map((tag) => (
										<TagChip key={tag.id}>{tag.name}</TagChip>
									))}
								</TagsRow>
							</InfoBlock>
						)}
					</InfoGrid>

					<CommentsSection>
						<CommentsDividerRow ref={commentsDividerRef}>
							<CommentsDividerLine />
							<CommentsDividerLabel>
								{isLoadingMessages
									? "תגובות"
									: messages.length > 0
										? `תגובות (${messages.length})`
										: "תגובות"}
								{isLoadingMessages && <AttachmentSpinIcon size={14} />}
							</CommentsDividerLabel>
							<CommentsDividerLine />
						</CommentsDividerRow>
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
							{isSendingComment && <AttachmentSpinIcon size={16} />}
						</TextareaRow>
						{[...messages].reverse().map((msg) => {
							const canDelete = isManager || msg.user.upn === currentUser.upn
							return (
								<CommentCard key={msg.id}>
									<CommentMainRow>
										{canDelete && (
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
							)
						})}
					</CommentsSection>
				</ScrollContent>

				{commentsDividerStuck && (
					<FixedCommentsBar>
						<CommentsDividerLine />
						<CommentsDividerLabel>
							{isLoadingMessages
								? "תגובות"
								: messages.length > 0
									? `תגובות (${messages.length})`
									: "תגובות"}
							{isLoadingMessages && <AttachmentSpinIcon size={14} />}
						</CommentsDividerLabel>
						<CommentsDividerLine />
					</FixedCommentsBar>
				)}

				{showHistory && (
					<>
						<HistoryOverlay />
						<TaskHistoryPanel
							history={history ?? []}
							onClose={() => setShowHistory(false)}
						/>
					</>
				)}
				{showEditDiscussion && source && (
					<EditDiscussionModal
						sourceId={source.id}
						workspaceId={workspaceId}
						onClose={handleCloseEditDiscussion}
						onSuccess={handleEditDiscussionSuccess}
					/>
				)}
			</Panel>
		</Dialog>
	)
}

export default TaskDetailPanel

// ─── Layout ────────────────────────────────────────────────────────────────────

const Panel = styled(ModalContent)`
  width: 100%;
  max-width: 900px;
  max-height: 82vh;
  min-height: 800px;
  overflow: hidden;
  direction: rtl;
`

const TaskIdLabel = styled.span`
  margin-inline-end: auto;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-400);
`

const ScrollContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 36px 48px 20px;
  align-items: flex-end;
`

const SectionLabel = styled.p`
  font-size: var(--fs-base);
  font-weight: 500;
  line-height: 24px;
  color: var(--sea-ink);
  text-align: end;
  white-space: nowrap;
`

const HeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 48px 20px;
`

const TitleRow = styled.div<{ $shadow: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  width: 100%;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  clip-path: inset(0 0 -20px 0);
  transition: box-shadow 200ms ease;
  box-shadow: ${({ $shadow }) =>
		$shadow ? "var(--shadow-title-row)" : "none"};
`

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`

const TitleText = styled.span`
  margin: 0 auto;
  font-size: var(--fs-heading-3);
  font-weight: 500;
  line-height: 32px;
  color: var(--text-color);
  white-space: normal;
  overflow-wrap: anywhere;
  width: 100%;
  max-height: 5lh;
  overflow-y: auto;
`

// ─── Deadline ──────────────────────────────────────────────────────────────────

const DeadlineSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
`

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const DueDateGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-color);
`

const DueDateText = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color);
`

const DateContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const MetaLabel = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color);
`

const CreatedGroup = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`

const MetaText = styled.span`
  font-size: var(--fs-sm);
  font-weight: 400;
  line-height: 20px;
  color: var(--sea-ink);
  white-space: nowrap;
`

const StatusTagContainer = styled.div`
  width: 100%;
`
// ─── Additional info ───────────────────────────────────────────────────────────

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 24px;
  width: 100%;
`

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  min-width: 0;
`

const TagsRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const TagChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: 4px;
  font-size: var(--fs-sm);
  line-height: 20px;
  background: var(--card-background);
  border: 1px solid var(--chip-line);
  color: var(--sea-ink);
  white-space: nowrap;
`

const SourceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: stretch;
`

const InfoAttachment = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--active-color);
`

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const AttachmentSpinIcon = styled(Loader2)`
  flex-shrink: 0;
  animation: ${spin} 0.8s linear infinite;
`

const AttachmentDownloadButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  font-size: var(--fs-btn);
  cursor: pointer;

  &:hover:not(:disabled) {
    text-decoration: underline;
  }

  &:disabled {
    cursor: default;
  }
`

const SourceName = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--sea-ink);
  white-space: normal;
  overflow-wrap: break-word;
  min-width: 0;
`

const SourceDate = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--sea-ink-soft);
`

const PencilButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--sea-ink-soft);
  cursor: pointer;

  &:hover {
    color: var(--sea-ink);
  }
`

const FixedCommentsBar = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 15px 48px;
  background: var(--background);
  box-shadow: var(--shadow-comment-bar);
  border-radius: 0 0 8px 8px;
`

const HistoryOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: var(--Text-color-text-placeholder);
  backdrop-filter: blur(2px);
  z-index: 1;
`

// ─── Comments section ─────────────────────────────────────────────────────────

const CommentsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding-bottom: 12px;
`

const CommentsDividerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
`

const CommentsDividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: var(--line);
  min-width: 0;
`

const CommentsDividerLabel = styled.span`
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

const TextareaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
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
