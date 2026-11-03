import styled from "@emotion/styled"
import { X } from "lucide-react"
import { Tooltip as TooltipPrimitive } from "radix-ui"
import type { MirageUserDto } from "src/api/model"
import { DisabledReasonTooltip } from "../shared/DisabledReasonTooltip"
import { Switch } from "../ui/switch"
import { Tooltip, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { UserItem } from "./UserItem"

export interface AssigneeFormUser extends MirageUserDto {
	id?: number
	statusEditable: boolean
}

interface AssigneeUsersListProps {
	users: AssigneeFormUser[]
	disabledReason?: string
	onRemove: (upn: string) => void
	onStatusEditableChange: (user: AssigneeFormUser, checked: boolean) => void
}

export function AssigneeUsersList({
	users,
	disabledReason,
	onRemove,
	onStatusEditableChange,
}: AssigneeUsersListProps) {
	return (
		<UserListArea>
			{users.length > 0 && (
				<UserCard>
					{users.map((user) => (
						<UserCardItem key={user.upn}>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<UserCardInfo>
											<UserItem user={user} />
										</UserCardInfo>
									</TooltipTrigger>
									<TooltipPrimitive.Portal>
										{user.info?.displayName && (
											<UserTooltipContent side="bottom" sideOffset={6}>
												{user.info?.displayName}
												<TooltipPrimitive.Arrow width={10} height={5} />
											</UserTooltipContent>
										)}
									</TooltipPrimitive.Portal>
								</Tooltip>
							</TooltipProvider>
							<StatusToggle>
								<DisabledReasonTooltip reason={disabledReason}>
									<StyledSwitch
										size="sm"
										checked={!disabledReason && user.statusEditable}
										disabled={!!disabledReason}
										onCheckedChange={(checked) =>
											onStatusEditableChange(user, checked)
										}
									/>
								</DisabledReasonTooltip>
								<StatusLabel $disabled={!!disabledReason}>
									עדכון סטטוס
								</StatusLabel>
							</StatusToggle>
							<UserCardClose type="button" onClick={() => onRemove(user.upn)}>
								<X size={12} />
							</UserCardClose>
						</UserCardItem>
					))}
				</UserCard>
			)}
		</UserListArea>
	)
}

const UserListArea = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  border-radius: 6px;
  padding: 4px;
`

const UserCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const UserCardItem = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
  padding-block: 1px;
  padding-inline: 8px 4px;
  background: var(--card-background);
  border: 1px solid var(--line);
  border-radius: 4px;
`

const UserCardInfo = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  overflow: hidden;
`

const StatusToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`

const StatusLabel = styled.span<{ $disabled: boolean }>`
  font-size: var(--fs-sm);
  line-height: 20px;
  color: ${({ $disabled }) =>
		$disabled ? "var(--Text-color-text-placeholder)" : "var(--text-color)"};
  white-space: nowrap;
`

const UserCardClose = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: var(--text-color-400);
  flex-shrink: 0;

  &:hover {
    color: var(--sea-ink);
  }
`

const UserTooltipContent = styled(TooltipPrimitive.Content)`
  max-width: 100%;
  padding: 10px 14px;
  background: var(--text-color-2);
  border-radius: 8px;
  font-size: var(--fs-btn);
  line-height: 1.6;
  color: #fff;
  text-align: center;
  white-space: normal;
  word-break: break-word;
  direction: rtl;
  z-index: 1000;
`

const StyledSwitch = styled(Switch)`
  cursor: pointer;

  &[data-state="unchecked"] {
    background: var(--Text-color-text-placeholder);
  }

  &[data-disabled] {
    background: var(--input);
    opacity: 0.65;
  }
`
