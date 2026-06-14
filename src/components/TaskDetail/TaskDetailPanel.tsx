import { keyframes } from "@emotion/react"
import styled from "@emotion/styled"
import { concat, uniqBy } from "lodash"
import {
	Calendar,
	ChevronUp,
	Loader2,
	Paperclip,
	Pencil,
	X,
} from "lucide-react"
import { useRef, useState } from "react"
import { DeadlineType, type TaskWithWorkspaceDto } from "src/api/model"
import { getAttachmentSignedUrl } from "src/api/s3/s3"
import { useListTaskHistory } from "src/api/task-history/task-history"
import { downloadFromUrl } from "src/functions/download-utils"
import { formatDateMonthYear, formatMinutesHours } from "src/utils/time-format"
import EditDiscussionModal from "../CreateTasksFromDiscussion/EditDiscussionModal"
import DeadlineTag, { DEADLINE_LABELS } from "../shared/DeadlineTag"
import FlagIcon from "../shared/FlagIcon"
import { ModalContent } from "../shared/ModalContent"
import { RowActionsMenu } from "../Tasks/RowActionsMenu"
import { Dialog } from "../ui/dialog"
import { AssigneeSection } from "./AssigneeSection"
import TaskConversationPanel from "./TaskConversationPanel"
import TaskHistoryPanel from "./TaskHistoryPanel"

interface TaskDetailPanelProps {
	task: TaskWithWorkspaceDto
	onClose: () => void
	onDelete: () => void
	onEdit: () => void
}

function TaskDetailPanel({
	task: {
		id,
		title,
		flagged,
		deadlineType,
		dueDate,
		createdAt,
		notes,
		source,
		tags,
		assigneeStatuses,
		workspace: { id: workspaceId },
	},
	onClose,
	onDelete,
	onEdit,
}: TaskDetailPanelProps) {
	const [showHistory, setShowHistory] = useState(false)
	const [showConversation, setShowConversation] = useState(false)

	const [showEditDiscussion, setShowEditDiscussion] = useState(false)
	const scrollRef = useRef<HTMLDivElement>(null)
	const [scrollShadow, setScrollShadow] = useState({
		top: false,
		bottom: false,
	})

	const { data: history } = useListTaskHistory({ taskId: id })

	const allTags = uniqBy(concat(tags, source?.tags ?? []), "id")
	const showExtraInfo = allTags.length > 0 || !!source?.attachmentKey || notes

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
	}

	function handleCloseEditDiscussion() {
		setShowEditDiscussion(false)
	}

	function handleBottomBarClick() {
		setShowConversation(true)
		setShowHistory(false)
	}

	function handleOpenChange(open: boolean) {
		if (!open) onClose()
	}

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<Panel>
				<TaskIdLabel>#{id}</TaskIdLabel>
				<CloseBtn onClick={onClose} aria-label="סגור">
					<X size={16} />
				</CloseBtn>

				<HeaderRow $shadow={scrollShadow.top}>
					<TextWrapper>
						{flagged && <FlagIcon />}
						<TitleText>{title}</TitleText>
					</TextWrapper>
					<RowActionsMenu
						workspaceId={workspaceId}
						onEdit={onEdit}
						onDelete={onDelete}
					/>
				</HeaderRow>

				<ScrollContent
					$noScroll={showConversation}
					ref={scrollRef}
					onScroll={handleScroll}
				>
					<DeadlineSection>
						<SectionLabel>תג"ב</SectionLabel>
						<MetaRow>
							<DueDateGroup>
								{deadlineType !== DeadlineType.DATE && (
									<DeadlineTag $type={deadlineType}>
										{DEADLINE_LABELS[deadlineType]}
									</DeadlineTag>
								)}
								{dueDate && (
									<DateContainer>
										<MetaLabel>עד</MetaLabel>
										<DueDateText>{formatDateMonthYear(dueDate)}</DueDateText>
										<Calendar size={16} />
									</DateContainer>
								)}
							</DueDateGroup>
							<CreatedGroup>
								{/* <HistoryButton onClick={() => setShowHistory(true)}>
										<History size={16} />
									</HistoryButton> */}
								<MetaText>
									{formatMinutesHours(createdAt)} -{" "}
									{formatDateMonthYear(createdAt)}
								</MetaText>
							</CreatedGroup>
						</MetaRow>
					</DeadlineSection>

					<AssigneeSection
						taskId={id}
						workspaceId={workspaceId}
						assigneeStatuses={assigneeStatuses}
					/>

					{showExtraInfo && (
						<>
							<DividerRow>
								<DividerLine />
								<DividerText>פרטים נוספים</DividerText>
								<DividerLine />
							</DividerRow>

							<InfoGrid>
								{source?.name && (
									<InfoBlock>
										<SectionLabel>מקור</SectionLabel>
										<SourceRow>
											<PencilButton onClick={() => setShowEditDiscussion(true)}>
												<Pencil size={14} />
											</PencilButton>
											<SourceName>{source.name}</SourceName>
											<SourceDate>
												{formatDateMonthYear(source.date)}
											</SourceDate>
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

							{notes && (
								<NotesSection>
									<SectionLabel>הערות הנחיה</SectionLabel>
									<NotesText dangerouslySetInnerHTML={{ __html: notes }} />
								</NotesSection>
							)}
						</>
					)}
				</ScrollContent>

				<BottomBar
					onClick={handleBottomBarClick}
					$hidden={showConversation}
					$shadow={scrollShadow.bottom}
				>
					<ChatGroup>
						<ChatLabel>שיחה ועדכונים</ChatLabel>
					</ChatGroup>
					<ChevronUp size={20} />
				</BottomBar>

				{showHistory && (
					<>
						<HistoryOverlay />
						<TaskHistoryPanel
							history={history ?? []}
							onClose={() => setShowHistory(false)}
						/>
					</>
				)}
				{showConversation && (
					<>
						<HistoryOverlay />
						<TaskConversationPanel
							taskId={id}
							onClose={() => setShowConversation(false)}
						/>
					</>
				)}
				{showEditDiscussion && source?.id && (
					<EditDiscussionModal
						onClose={handleCloseEditDiscussion}
						sourceId={source.id}
						taskId={id}
					/>
				)}
			</Panel>
		</Dialog>
	)
}

export default TaskDetailPanel

// ─── Layout ────────────────────────────────────────────────────────────────────

const Panel = styled(ModalContent)`
  width: 1094px;
  height: 850px;
  max-height: 85vh;
  overflow: hidden;
  direction: rtl;
`

const TaskIdLabel = styled.span`
  position: absolute;
  inset-inline-start: 15px;
  top: 15px;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-400);
`

const CloseBtn = styled.button`
  position: absolute;
  inset-inline-end: 15px;
  top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 2px;
  color: var(--sea-ink-soft);
  cursor: pointer;
  transition: background 0.15s;
  z-index: 2;

  &:hover {
    background: var(--link-bg-hover);
    color: var(--sea-ink);
  }
`

const ScrollContent = styled.div<{ $noScroll: boolean }>`
  flex: 1;
  min-height: 0;
  overflow-y: ${({ $noScroll }) => ($noScroll ? "hidden" : "auto")};
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 36px 48px 20px;
  align-items: flex-end;
`

const BottomBar = styled.div<{ $hidden?: boolean; $shadow: boolean }>`
  flex-shrink: 0;
  background: var(--background-area);
  height: 53px;
  border-top: 10px solid rgba(0, 0, 0, 0.0);
  display: ${({ $hidden }) => ($hidden ? "none" : "flex")};
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-radius: 0 0 8px 8px;
  color: var(--sea-ink-soft);
  cursor: pointer;
  position: relative;
  z-index: 1;
  clip-path: inset(-20px 0 0 0);
  transition: box-shadow 200ms ease;
  box-shadow: ${({ $shadow }) => ($shadow ? "0px -10px 20px 0px rgba(0, 0, 0, 0.06)" : "none")};
`

const SectionLabel = styled.p`
  font-size: var(--fs-base);
  font-weight: 500;
  line-height: 24px;
  color: var(--sea-ink);
  text-align: end;
  white-space: nowrap;
`

// ─── Header ────────────────────────────────────────────────────────────────────

const HeaderRow = styled.div<{ $shadow: boolean }>`
  display: flex;
  padding: 36px 48px 20px;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  width: 100%;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  clip-path: inset(0 0 -20px 0);
  transition: box-shadow 200ms ease;
  box-shadow: ${({ $shadow }) => ($shadow ? "0px 10px 20px 0px rgba(0, 0, 0, 0.06)" : "none")};
`

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const TitleText = styled.p`
  margin: 0 auto;
  font-size: var(--fs-heading-3);
  font-weight: 500;
  line-height: 32px;
  color: var(--text-color);
  text-align: end;
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

// ─── Divider ───────────────────────────────────────────────────────────────────
const DividerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
`

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: var(--line);
  min-width: 0;
`

const DividerText = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-200);
  white-space: nowrap;
  flex-shrink: 0;
`

// ─── Additional info ───────────────────────────────────────────────────────────

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  width: 100%;
  justify-items: start;
`

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
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

// ─── Notes ─────────────────────────────────────────────────────────────────────

const NotesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  align-items: flex-start;
`

const HistoryOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(2px);
  z-index: 1;
`

// ─── Bottom bar ────────────────────────────────────────────────────────────────

const ChatGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ChatLabel = styled.span`
  font-size: var(--fs-btn);
  font-weight: 500;
  line-height: 21px;
  color: var(--sea-ink);
`

const NotesText = styled.div`
  font-size: var(--fs-btn);
  line-height: 20px;
  color: var(--sea-ink-soft);

  p {
    margin: 0;
  }

  ol {
    margin: 0;
    padding-inline-start: 20px;
    list-style-type: decimal;
  }

  li {
    margin: 0;
  }

  li p {
    display: inline;
  }

  strong {
    font-weight: 600;
  }

  u {
    text-decoration: underline;
  }
`
