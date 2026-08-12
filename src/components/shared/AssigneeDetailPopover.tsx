import styled from "@emotion/styled"
import { X } from "lucide-react"
import { Popover as PopoverPrimitive } from "radix-ui"
import type { AssigneeDto } from "src/api/model"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { AssigneeAvatar } from "./AssigneeAvatar"

interface AssigneeDetailPopoverProps {
	assignee: AssigneeDto
	children: React.ReactNode
}

export function AssigneeDetailPopover({
	assignee,
	children,
}: AssigneeDetailPopoverProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<DetailedContent side="top" sideOffset={10} align="center">
				<PopoverArrow width={12} height={6} />
				<CloseButton>
					<XIcon size={14} />
				</CloseButton>
				<DetailedHeader>
					<SectionLabel>אחראי :</SectionLabel>
					<AssigneeAvatar assignee={assignee} />
					<RoleText>{assignee.name}</RoleText>
				</DetailedHeader>
				{assignee.users.length > 0 && (
					<>
						<SectionLabel>משתמשים מכותבים:</SectionLabel>
						<UserScrollArea>
							<UserList>
								{assignee.users.map((u) => (
									<UserRow key={u.id}>
										<UserPrimary>
											{u.info?.name && (
												<>
													<UserName title={u.info?.name}>
														{u.info?.name}
													</UserName>
													<UserDash>{" - "}</UserDash>
												</>
											)}

											<UserUpn title={u.upn}>{u.upn}</UserUpn>
										</UserPrimary>
										<UserMeta title={u.info?.displayName}>
											{u.info?.displayName ?? ""}
										</UserMeta>
									</UserRow>
								))}
							</UserList>
						</UserScrollArea>
					</>
				)}
			</DetailedContent>
		</Popover>
	)
}

const PopoverArrow = styled(PopoverPrimitive.Arrow)`
  fill: var(--background);
`

const DetailedContent = styled(PopoverContent)`
  position: relative;
  width: 397px;
  padding: 12px;
  background: var(--background);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: var(--card-shadow-hover);
`

const CloseButton = styled(PopoverPrimitive.Close)`
  position: absolute;
  inset-block-start: 8px;
  inset-inline-end: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: none;
  outline: none;
  background: transparent;
  color: var(--sea-ink-soft);
  cursor: pointer;

  &:hover {
    background: var(--icon-hover);
  }
`

const XIcon = styled(X)`
  color: var(--text-color-400);

  &:active {
    color: var(--text-color-2);
  }
`

const DetailedHeader = styled.div`
  direction: rtl;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-inline-end: 24px;
  font-weight: 500;
`

const RoleText = styled.span`
  font-size: var(--fs-btn);
  font-weight: 500;
  color: var(--sea-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
`

const SectionLabel = styled.span`
  font-size: var(--fs-base);
  line-height: 24px;
  color: var(--text-subtitle-color);
`

const UserScrollArea = styled.div`
  direction: ltr;
  overflow-y: auto;
  max-height: 110px;

  scrollbar-width: thin;
  scrollbar-color: var(--line) transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--line);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--sea-ink-soft);
  }
`

const UserList = styled.div`
  direction: rtl;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 8px;
`

const UserRow = styled.div`
  display: flex;
  flex-direction: column;
`

const UserPrimary = styled.span`
  display: flex;
  align-items: center;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;

  font-size: var(--fs-base);
  font-weight: 400;
  color: var(--text-color-2);
`

const UserName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
  min-width: 0;
`

const UserDash = styled.span`
  padding: 0 3px;
`

const UserUpn = styled.span`
  white-space: nowrap;
  flex-shrink: 0;
`

const UserMeta = styled.span`
  font-size: var(--fs-btn);
  color: var(--text-color-400);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
`
