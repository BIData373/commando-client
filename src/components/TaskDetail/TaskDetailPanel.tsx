import styled from "@emotion/styled";
import { EditorContent, useEditor } from "@tiptap/react";
import { Calendar, ChevronUp, History, Paperclip, X } from "lucide-react";
import { useRef, useState } from "react";
import {
	formatDateToDateMonthYear,
	formatDateToMinutesHours,
} from "src/utils/timeFormat";
import { EditorExtensions } from "src/utils/tiptapExtensions";
import type { Task } from "../../data/Tasks";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { MOCK_TASK_HISTORY } from "../../mocks/data/history";
import { MOCK_TASK_MESSAGES } from "../../mocks/data/messages";
import { useTasks } from "../../providers/TasksProvider";
import type { DirectiveStatus } from "../../utils/statusUtils";
import DeadlineTag, { DEADLINE_LABELS } from "../shared/DeadlineTag";
import FlagIcon from "../shared/FlagIcon";
import { AssigneeSection } from "./AssigneeSection";
import { DropdownOptions } from "./DropdownOptions";
import TaskConversationPanel from "./TaskConversationPanel";
import TaskHistoryPanel from "./TaskHistoryPanel";
import type { DirectiveStatus } from "src/utils/statusUtils";

interface TaskDetailPanelProps {
	task: Task;
	onClose: () => void;
	onArchive: () => void;
	onDelete: () => void;
}

function TaskDetailPanel({
	task: {
		id,
		title,
		details,
		flagged,
		deadlineType,
		dueDate,
		createdAt,
		status,
		relatedDirectives,
		tags,
		discussionName,
		discussionDate,
		hasAttachment,
		attachmentUrl,
		notes,
	},
	onClose,
	onArchive,
	onDelete,
}: TaskDetailPanelProps) {
	const { data: loggedInUser } = useCurrentUser();
	const { updateTaskStatus } = useTasks();

	const [showHistory, setShowHistory] = useState(false);
	const [showConversation, setShowConversation] = useState(false);

	const scrollRef = useRef<HTMLDivElement>(null);
	const [scrollShadow, setScrollShadow] = useState({
		top: false,
		bottom: false,
	});

	const editor = useEditor({
		...EditorExtensions,
		content: notes,
	});

	const attacmentFile = attachmentUrl?.split("/").pop()?.split(".")[0];

	function handleScroll() {
		const el = scrollRef.current;
		if (!el) return;
		const atTop = el.scrollTop <= 0;
		const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
		setScrollShadow({ top: !atTop, bottom: !atBottom });
	}

	const hasTagOrAttacment = tags.length > 0 || hasAttachment;

	const taskMessages = MOCK_TASK_MESSAGES[id] ?? [];

	function handlePanelClick(e: React.MouseEvent) {
		e.stopPropagation();
	}

	function handleDirectiveStatusChange(
		newStatus: DirectiveStatus,
	) {
		updateTaskStatus(id, newStatus);
	}

	function handleBottomBarClick() {
		setShowConversation(true);
		setShowHistory(false);
	}

	return (
		loggedInUser && (
			<Overlay onClick={onClose}>
				<Panel onClick={handlePanelClick}>
					<TaskIdLabel>#{id}</TaskIdLabel>
					<CloseBtn onClick={onClose} aria-label="סגור">
						<X size={16} />
					</CloseBtn>

					<HeaderRow $shadow={scrollShadow.top}>
						<TextWrapper>
							{flagged && <FlagIcon />}
							<TitleText>
								{title}
								{details ? ` - ${details}` : ""}
							</TitleText>
						</TextWrapper>
						<DropdownOptions
							currentUser={loggedInUser}
							onEdit={onClose}
							onArchive={onArchive}
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
									{deadlineType !== "date" && (
										<DeadlineTag $type={deadlineType}>
											{DEADLINE_LABELS[deadlineType]}
										</DeadlineTag>
									)}
									{dueDate && (
										<DateContainer>
											<MetaLabel>עד</MetaLabel>
											<DueDateText>
												{formatDateToDateMonthYear(dueDate)}
											</DueDateText>
											<Calendar size={16} />
										</DateContainer>
									)}
								</DueDateGroup>
								<CreatedGroup>
									<HistoryButton onClick={() => setShowHistory(true)}>
										<History size={16} />
									</HistoryButton>
									<MetaText>
										{formatDateToMinutesHours(createdAt)} -{" "}
										{formatDateToDateMonthYear(createdAt)}
									</MetaText>
								</CreatedGroup>
							</MetaRow>
						</DeadlineSection>

						<AssigneeSection
							currentUser={loggedInUser}
							relatedDirectives={relatedDirectives}
							status={status}
							onDirectiveStatusChange={handleDirectiveStatusChange}
						/>

						{hasTagOrAttacment && (
							<>
								<DividerRow>
									<DividerLine />
									<DividerText>פרטים נוספים</DividerText>
									<DividerLine />
								</DividerRow>

								<InfoGrid>
									{discussionName && (
										<InfoBlock>
											<SectionLabel>מקור</SectionLabel>
											<SourceRow>
												<SourceName>{discussionName}</SourceName>
												<SourceDate>{discussionDate}</SourceDate>
											</SourceRow>
											<InfoAttachment>
												{hasAttachment && (
													<>
														<Paperclip size={16} />
														{attacmentFile}
													</>
												)}
											</InfoAttachment>
										</InfoBlock>
									)}
									<InfoBlock>
										<SectionLabel>נושא</SectionLabel>
										<TagsRow>
											{tags.map((tag) => (
												<TagChip key={tag}>{tag}</TagChip>
											))}
										</TagsRow>
									</InfoBlock>
								</InfoGrid>

								{notes && (
									<NotesSection>
										<SectionLabel>הערות הנחיה</SectionLabel>
										<NotesText>
											<StyledEditorContent editor={editor} />
										</NotesText>
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
							<ChatBadge>{taskMessages.length}</ChatBadge>
							<ChatLabel>שיחה ועדכונים</ChatLabel>
						</ChatGroup>
						<ChevronUp size={20} />
					</BottomBar>
					{showHistory && (
						<>
							<HistoryOverlay />
							<TaskHistoryPanel
								history={MOCK_TASK_HISTORY[id] ?? []}
								onClose={() => setShowHistory(false)}
							/>
						</>
					)}
					{showConversation && (
						<>
							<HistoryOverlay />
							<TaskConversationPanel
								messages={taskMessages}
								currentUser={loggedInUser}
								onClose={() => setShowConversation(false)}
							/>
						</>
					)}
				</Panel>
			</Overlay>
		)
	);
}

export default TaskDetailPanel;

// ─── Layout ────────────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: var(--text-color-400);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-dropdown);
  direction: rtl;
`;

const Panel = styled.div`
  position: relative;
  overflow: hidden;
  background: var(--background);
  border-radius: 8px;
  width: 1094px;
  height: 850px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.08), 0 3px 3px rgba(0, 0, 0, 0.12), 0 9px 14px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--line);
`;

const TaskIdLabel = styled.span`
  position: absolute;
  inset-inline-start: 15px;
  top: 15px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-400);
`;

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
`;

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
`;

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
`;

const SectionLabel = styled.p`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: var(--sea-ink);
  text-align: end;
  white-space: nowrap;
`;

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
`;

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TitleText = styled.p`
  margin: 0 auto;
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
  color: var(--text-color);
  text-align: end;
`;

// ─── Deadline ──────────────────────────────────────────────────────────────────

const DeadlineSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const DueDateGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-color);
`;

const DueDateText = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color);
`;

const DateContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const MetaLabel = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color);
`;

const CreatedGroup = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const MetaText = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: var(--sea-ink);
  white-space: nowrap;
`;

const HistoryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-color-400);
  flex-shrink: 0;
  cursor: pointer;

  &:hover {
    background: var(--button-hover);
    color: var(--sea-ink);
  }
  
  &:active {
    background: var(--button-active);
    color: var(--sea-ink);
  }
`;

// ─── Divider ───────────────────────────────────────────────────────────────────
const DividerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: var(--line);
  min-width: 0;
`;

const DividerText = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-200);
  white-space: nowrap;
  flex-shrink: 0;
`;

// ─── Additional info ───────────────────────────────────────────────────────────

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  width: 100%;
  justify-items: start;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
`;

const TagsRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const TagChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 20px;
  background:var(--card-background);
  border-radius: 4px;
  border: 1px solid var(--chip-line);
  color: var(--sea-ink);
  white-space: nowrap;
`;

const SourceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoAttachment = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--active-color);
  cursor: pointer;
`;

const SourceName = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--sea-ink);
`;

const SourceDate = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--sea-ink-soft);
`;

// ─── Notes ─────────────────────────────────────────────────────────────────────

const NotesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  align-items: flex-start;
`;

const HistoryOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(2px);
  z-index: 1;
`;

// ─── Bottom bar ────────────────────────────────────────────────────────────────

const ChatGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChatLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  color: var(--sea-ink);
`;

const ChatBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 400;
  color: var(--background);
  background: var(--default-linear);
  box-shadow: 0 0 0 1px white;
  flex-shrink: 0;
`;

const NotesText = styled.div`
  font-size: 14px;
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
`;

const StyledEditorContent = styled(EditorContent)`
  .ProseMirror {
    &:focus {
      outline: none;
      border: none;
    }

  }
`;
