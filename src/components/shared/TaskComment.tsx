import styled from "@emotion/styled"
import { MoreVertical, Trash2 } from "lucide-react"
import type { MessageDto } from "src/api/model"
import { MOBILE_MEDIA_QUERY } from "src/hooks/use-mobile"
import { formatDateMonthYear, formatMinutesHours } from "src/utils/time-format"
import { UnreadDot } from "../shared/UnreadDot"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"

interface TaskCommentProps {
	message: MessageDto
	canDelete: boolean
	onDelete: (id: number) => void
}

function TaskComment({ message, canDelete, onDelete }: TaskCommentProps) {
	const { upn, info } = message.user
	const userMeta = info?.displayName ? `${upn} - ${info.displayName}` : upn
	const userName = info?.name ?? upn

	function handleDelete() {
		onDelete(message.id)
	}

	return (
		<Card>
			{!message.viewed && <UnreadDot />}
			<MainRow>
				{canDelete && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<MenuButton>
								<MoreVertical size={14} />
							</MenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" side="bottom">
							<DeleteMenuItem onClick={handleDelete}>
								מחק תגובה
								<Trash2 size={16} />
							</DeleteMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
				<Content>{message.content}</Content>
			</MainRow>
			<Footer>
				<Timestamp>
					{formatMinutesHours(message.createdAt)} ·{" "}
					{formatDateMonthYear(message.createdAt)}
				</Timestamp>
				<UserDetails>
					<UserName>{userName}</UserName> <UserMeta>{userMeta}</UserMeta>
				</UserDetails>
			</Footer>
		</Card>
	)
}

export default TaskComment

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--card-background);
  width: 100%;
  direction: ltr;
  position: relative;
`

const MainRow = styled.div`
  display: flex;
  gap: 4px;
  align-items: flex-start;
  width: 100%;
`

const MenuButton = styled.button`
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

const Content = styled.p`
  flex: 1;
  direction: rtl;
  min-width: 0;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--sea-ink);
  width: 100%;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  margin: 0;
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: var(--fs-sm);
  line-height: 20px;
  white-space: nowrap;

  ${MOBILE_MEDIA_QUERY} {
    flex-direction: column;
    align-items: flex-end;
  }
`

const Timestamp = styled.span`
  font-weight: 400;
  color: var(--text-color-400);
`

const UserDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
  direction: rtl;

  ${MOBILE_MEDIA_QUERY} {
    display: block;
    width: 100%;
    text-align: start;
    white-space: normal;
    word-break: break-all;
  }
`

const UserMeta = styled.span`
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 400;
  color: var(--sea-ink-soft);
  margin-inline-end: 8px;

  ${MOBILE_MEDIA_QUERY} {
    white-space: normal;
    margin-inline-end: 0;
  }
`

const UserName = styled.span`
  min-width: fit-content;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 500;
  color: var(--sea-ink);

  ${MOBILE_MEDIA_QUERY} {
    white-space: normal;
  }
`
