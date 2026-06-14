import styled from "@emotion/styled"
import { X } from "lucide-react"
import { Popover as PopoverPrimitive } from "radix-ui"
import type { AssigneeDto, WorkspaceStatusDto } from "src/api/model"
import { AssigneeAvatar } from "../shared/AssigneeAvatar"
import { StatusTag } from "../shared/StatusTag"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

//delete after replace assigneeAvatar
export type AvatarColor = "cyan" | "blue" | "green" | "orange" | "gray"

export interface RelatedDirective {
	assignee: AssigneeDto
	status: WorkspaceStatusDto
}

interface AssigneeCellProps {
	responsible: AssigneeDto | null
	relatedDirectives: RelatedDirective[]
}

export function AssigneeCell({
	responsible,
	relatedDirectives,
}: AssigneeCellProps) {
	return (
		<CellRoot>
			{responsible && (
				<Popover>
					<PopoverTrigger asChild>
						<AssigneeAvatar assignee={responsible} cursor />
					</PopoverTrigger>
					<DetailedContent side="top" sideOffset={10} align="center">
						<PopoverArrow width={12} height={6} />
						<CloseButton>
							<XIcon size={14} />
						</CloseButton>
						<DetailedHeader>
							<SectionLabel>אחראי :</SectionLabel>
							<AssigneeAvatar assignee={responsible} />
							<RoleText>{responsible.name}</RoleText>
						</DetailedHeader>

						{responsible.users.length > 0 && (
							<>
								<SectionLabel>משתמשים :</SectionLabel>
								<UserScrollArea>
									<UserList>
										{responsible.users.map((u) => (
											<UserRow key={u.id}>
												<UserInfo>
													<UserName>{u.info?.name}</UserName>
													<UserEmail>{u.upn}</UserEmail>
												</UserInfo>
											</UserRow>
										))}
									</UserList>
								</UserScrollArea>
							</>
						)}
					</DetailedContent>
				</Popover>
			)}
			{relatedDirectives.length > 0 && (
				<Popover>
					<PopoverTrigger asChild>
						<AvatarCircle>{relatedDirectives.length}+</AvatarCircle>
					</PopoverTrigger>
					<CompactContent side="top" sideOffset={10} align="center">
						<PopoverArrow width={12} height={6} />
						<CompactList>
							{relatedDirectives.map((d) => (
								<CompactRow key={d.assignee.id}>
									<StatusTag status={d.status} />
									<CompactRole>{d.assignee.name}</CompactRole>
									<AssigneeAvatar assignee={d.assignee} />
								</CompactRow>
							))}
						</CompactList>
					</CompactContent>
				</Popover>
			)}
		</CellRoot>
	)
}

// ─── Cell layout ──────────────────────────────────────────────────────────────

const CellRoot = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

// FIX Use AssigneeAvatar
const AvatarCircle = styled.button<{ $color?: AvatarColor }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 29px;
  height: 29px;
  border-radius: 50%;
  font-size: var(--fs-sm);
  font-weight: 400;
  line-height: 20px;
  color: var(--sea-ink);
  flex-shrink: 0;
  cursor: pointer;
  border: none;
  padding: 0;
  ${({ $color }) => `background: ${$color ?? "var(--colors-base-neutral-3)"};`}
`

// ─── Shared popover styles ─────────────────────────────────────────────────────

const POPOVER_SHADOW = `
  box-shadow: var(--card-shadow-hover);
`

const PopoverArrow = styled(PopoverPrimitive.Arrow)`
  fill: var(--background);
`

// ─── Detailed popover ─────────────────────────────────────────────────────────

const DetailedContent = styled(PopoverContent)`
  position: relative;
  width: 397px;
  padding: 12px;
  background: var(--background);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${POPOVER_SHADOW}
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
`

const RoleText = styled.span`
  font-size: var(--fs-btn);
  font-weight: 500;
  color: var(--sea-ink);
`

const SectionLabel = styled.span`
  font-size: var(--fs-base);
  font-weight: 500;
  line-height: 24px;
  color: var(--text-subtitle-color);
`

const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

const UserName = styled.span`
  font-size: var(--fs-btn);
  color: var(--sea-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const UserEmail = styled.span`
  font-size: var(--fs-sm);
  color: var(--sea-ink-soft);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const UserScrollArea = styled.div`
  direction: ltr;
  overflow-y: auto;
  max-height: 110px;
`

const UserList = styled.div`
  direction: rtl;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-inline-start: 8px;
`

// ─── Compact popover ──────────────────────────────────────────────────────────

const CompactContent = styled(PopoverContent)`
  width: 236px;
  padding: 12px;
  background: var(--background);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${POPOVER_SHADOW}
`

const CompactList = styled.div`
  direction: ltr;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 120px;
  overflow-y: auto;
`

const CompactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-inline-end: 8px;
`

const CompactRole = styled.span`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: var(--fs-btn);
  color: var(--sea-ink);
  flex: 1;
  white-space: nowrap;
`
