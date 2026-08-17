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
  max-height: 500px;
  width: 100%;
  overflow-y: auto;
  border-radius: 6px;
  padding: 4px;
`

const UserCard = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex-direction: column;
`

const UserCardItem = styled.div`
  display: flex;
  width: 100%;
  gap: 6px;
  padding-right: 8px;
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
