import styled from "@emotion/styled"
import { X } from "lucide-react"
import { Tooltip as TooltipPrimitive } from "radix-ui"
import type { MirageUserDto } from "src/api/model"
import { Tooltip, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { UserItem } from "./UserItem"

interface AssigneeUsersListProps {
	users: MirageUserDto[]
	onRemove: (upn: string) => void
}

export function AssigneeUsersList({ users, onRemove }: AssigneeUsersListProps) {
	return (
		<UserListArea>
			{users.length > 0 && (
				<UserCard>
					{users.map((user) => (
						<TooltipProvider key={user.upn}>
							<Tooltip>
								<TooltipTrigger asChild>
									<UserCardItem>
										<UserCardInfo>
											<UserItem user={user} />
										</UserCardInfo>
										<UserCardClose
											type="button"
											onClick={() => onRemove(user.upn)}
										>
											<X size={12} />
										</UserCardClose>
									</UserCardItem>
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
					))}
				</UserCard>
			)}
		</UserListArea>
	)
}

const UserListArea = styled.div`
  min-height: 127px;
  max-height: 127px;
  width: 100%;
  overflow-y: auto;
  border-radius: 6px;
  background-color: var(--background-area);
  padding: 8px;
`

const UserCard = styled.div`
  padding: 1px 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

const UserCardItem = styled.div`
    display: flex;
    align-items: center;
    max-width: 224px;
    gap: 6px;
    padding-right: 8px;
    background: rgba(0, 0, 0, 0.02);
    border: 1px solid #f0f0f0;
    border-radius: 4px;
`

const UserCardInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: clip;
    gap: 2px;
`

const UserCardClose = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    color: rgba(0, 0, 0, 0.45);
    flex-shrink: 0;
    align-self: flex-start;

    &:hover {
        color: var(--sea-ink);
    }
`

const UserTooltipContent = styled(TooltipPrimitive.Content)`
  max-width: 260px;
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
