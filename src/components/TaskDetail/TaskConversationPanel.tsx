import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { format, isSameDay } from "date-fns";
import { ChevronUp, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { IUserSummary } from "../../types";
import type { TaskMessage } from "../../types/message";

interface TaskConversationPanelProps {
	messages: TaskMessage[];
	currentUser: IUserSummary;
	onClose: () => void;
}

interface DateGroup {
	dateLabel: string;
	messages: TaskMessage[];
}

const HEBREW_MONTHS = [
	"ינואר",
	"פברואר",
	"מרץ",
	"אפריל",
	"מאי",
	"יוני",
	"יולי",
	"אוגוסט",
	"ספטמבר",
	"אוקטובר",
	"נובמבר",
	"דצמבר",
];

function formatDateLabel(date: Date, today: Date): string {
	if (isSameDay(date, today)) return "היום";
	const day = date.getDate();
	const month = HEBREW_MONTHS[date.getMonth()];
	const year = date.getFullYear();
	return `${day} ב${month} ${year}`;
}

function groupMessagesByDate(messages: TaskMessage[]): DateGroup[] {
	const today = new Date();
	const groups: DateGroup[] = [];
	for (const msg of messages) {
		const label = formatDateLabel(msg.timestamp, today);
		const last = groups[groups.length - 1];
		if (last && last.dateLabel === label) {
			last.messages.push(msg);
		} else {
			groups.push({ dateLabel: label, messages: [msg] });
		}
	}
	return groups;
}

function TaskConversationPanel({
	messages,
	currentUser,
	onClose,
}: TaskConversationPanelProps) {
	const [localMessages, setLocalMessages] = useState<TaskMessage[]>(messages);
	const [inputValue, setInputValue] = useState("");
	const messagesAreaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = messagesAreaRef.current;
		if (el && localMessages.length >= 0) el.scrollTop = el.scrollHeight;
	}, [localMessages]);

	const dateGroups = groupMessagesByDate(localMessages);

	function handleSend() {
		const trimmed = inputValue.trim();
		if (!trimmed) return;
		const newMsg: TaskMessage = {
			id: Date.now(),
			userId: currentUser.id,
			fullName: currentUser.name,
			upn: "",
			emailDisplayName: "",
			timestamp: new Date(),
			text: trimmed,
		};
		setLocalMessages((prev) => [...prev, newMsg]);
		setInputValue("");
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") handleSend();
	}

	const displayCount = localMessages.length;

	return (
		<ConversationWrapper>
			<ConversationHeader onClick={onClose}>
				<ChatGroup>
					<ChatBadge>{displayCount}</ChatBadge>
					<ChatLabel>שיחה ועדכונים</ChatLabel>
				</ChatGroup>
				<ChevronIcon>
					<ChevronUp size={20} />
				</ChevronIcon>
			</ConversationHeader>

			<ConverstaionContainer>
				<MessagesArea ref={messagesAreaRef}>
					{dateGroups.map((group) => (
						<DateSection key={group.dateLabel}>
							<DateLabel>{group.dateLabel}</DateLabel>
							{group.messages.map((msg) => (
								<MessageOuter
									key={msg.id}
									$isOwn={msg.userId === currentUser.id}
								>
									<MessageCard>
										<MessageHeader>
											<AuthorText>
												<AuthorName>{msg.fullName} - </AuthorName>
												<AuthorUpn>{msg.upn}</AuthorUpn>
												<AuthorEmail> - {msg.emailDisplayName} </AuthorEmail>
											</AuthorText>
											<TimeText>{format(msg.timestamp, "HH:mm")}</TimeText>
										</MessageHeader>
										<MessageText>{msg.text}</MessageText>
									</MessageCard>
								</MessageOuter>
							))}
						</DateSection>
					))}
				</MessagesArea>

				<InputArea>
					<InputRow>
						<StyledInput
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="הוסף הערה לעדכון הצוות..."
							dir="auto"
						/>
						<SendButton onClick={handleSend} aria-label="שלח">
							<Send size={16} color="white" />
						</SendButton>
					</InputRow>
				</InputArea>
			</ConverstaionContainer>
		</ConversationWrapper>
	);
}

export default TaskConversationPanel;

// ─── Animation ─────────────────────────────────────────────────────────────────

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
`;

// ─── Layout ────────────────────────────────────────────────────────────────────

const ConversationWrapper = styled.div`
  inset-inline: 0;
  bottom: 0;
  height: 741px;
  z-index: 2;
  background: var(--background);
  border-radius: 8px;
  border: 1px solid #eef2f6;
  box-shadow: 0 -10px 25.9px var(--text-color-200);
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.22s ease-out both;
  overflow: hidden;
`;

const ConversationHeader = styled.div`
  flex-shrink: 0;
  background: var(--background-area);
  border-bottom: 1px solid var(--line);
  height: 53px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-radius: 8px 8px 0 0;
  color: var(--sea-ink-soft);
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

const ConverstaionContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  padding: 32px 32px 24px 32px;
`;

const ChevronIcon = styled.div`
  transform: rotate(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--sea-ink-soft);
`;

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
  background: var(--button-gradient);
  box-shadow: 0 0 0 1px var(--background);
  flex-shrink: 0;
`;

const MessagesArea = styled.div`
  display: flex;
  flex: 1;
  overflow-y: auto;
  flex-direction: column;
  gap: 20px;
`;

const DateSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const DateLabel = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: var(--text-color-400);
  text-align: center;
  width: 100%;
  margin: 0;
`;

const MessageOuter = styled.div<{ $isOwn: boolean }>`
  display: flex;
  flex-direction: column;
  align-self: ${({ $isOwn }) => ($isOwn ? "flex-end" : "flex-start")};
background: ${({ $isOwn }) =>
	$isOwn ? "rgba(104, 102, 255, 0.1)" : "var(--background)"};
  width: 686px;
`;

const MessageCard = styled.div`
  border: 0.8px solid #f0f0f0;
  border-radius: 8px;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px rgba(0, 0, 0, 0.02),
    0 2px 4px rgba(0, 0, 0, 0.02);
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
`;

const TimeText = styled.p`
  font-size: 10px;
  font-weight: 400;
  line-height: 15px;
  color: var(--text-color);
  margin: 0;
  flex-shrink: 0;
`;

const AuthorText = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: var(--text-color-2);
  text-align: end;
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AuthorName = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: var(--text-color-2);
`;

const AuthorUpn = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  color: var(--text-color-400);
`;

const AuthorEmail = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: var(--text-color-400);
`;

const MessageText = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  margin: 0;
`;

// ─── Input area ────────────────────────────────────────────────────────────────

const InputArea = styled.div`
  flex-shrink: 0;
  background: var(--background-area);
  border-radius: 8px;
  padding: 12px;
  margin: 0 0 0 0;
`;

const InputRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  width: 100%;
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  flex-shrink: 0;
  background: var(--button-gradient);
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.88;
  }
`;

const StyledInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 32px;
  background: var(--background);
  border: 0.8px solid var(--card-border);
  border-radius: 8px;
  padding: 4px 12px;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  color: var(--text-color-2);
  text-align: end;
  outline: none;

  &::placeholder {
    color: var(--text-color-200);
  }

  &:focus {
    border-color: #6866ff;
  }
`;
