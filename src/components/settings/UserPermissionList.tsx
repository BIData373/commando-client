import styled from "@emotion/styled"
import { useCallback } from "react"
import { type PermissionDto, PermissionType, type UserDto } from "src/api/model"
import { useCurrentUser } from "src/hooks/useCurrentUser"
import { navigateToUserChat } from "src/utils/user-utils"
import noUsersFound from "../../assets/empty-states/no-users-found.svg"
import { EmptyCardState } from "../shared/EmptyCardState"
import { TrashButton } from "../shared/TrashButton"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { DropdownPermission } from "./DropdownPermission"

interface UserPermissionListProps {
	permissions: PermissionDto[]
	onDelete: (user: UserDto) => void
	onTypeChange: (user: UserDto, type: PermissionType) => void
}

export function UserPermissionList({
	permissions,
	onDelete,
	onTypeChange,
}: UserPermissionListProps) {
	const currentUser = useCurrentUser()

	function handleClickUserInfo(user: UserDto, type: PermissionType) {
		if (type === PermissionType.MANAGER) {
			navigateToUserChat(user)
		}
	}

	const isCurrentUserPermitted = useCallback(
		(user: UserDto) =>
			user.upn !== currentUser.upn || !!currentUser?.info?.isBI,
		[currentUser],
	)

	return (
		<UserListRoot>
			{permissions.length === 0 ? (
				<CenterContainer>
					<EmptyCardState
						imgSrc={noUsersFound}
						title="לא נמצאו משתמשים"
						description="טרם הוגדרו משתמשים כדי להציג נתונים"
					/>
				</CenterContainer>
			) : (
				permissions.map(({ user, type }) => (
					<UserRow key={user.id}>
						<UserInfo
							$type={type}
							onClick={() => handleClickUserInfo(user, type)}
						>
							<UserHeader>
								<UserName title={user.info?.name}>{user.info?.name}</UserName>
								<UserPersonalId title={user.upn}> - {user.upn}</UserPersonalId>
							</UserHeader>
							<UserSubtext title={user.info?.displayName}>
								{user.info?.displayName}
							</UserSubtext>
						</UserInfo>
						<DropdownPermission
							value={type}
							disabled={!isCurrentUserPermitted(user)}
							onChange={(type) => onTypeChange(user, type)}
						/>
						<Tooltip>
							<TooltipTrigger asChild>
								<span>
									<TrashButton
										visible={isCurrentUserPermitted(user)}
										onClick={() => onDelete(user)}
										size={22}
									/>
								</span>
							</TooltipTrigger>
							<TooltipContent hidden={!isCurrentUserPermitted(user)}>
								הסרת הרשאות
							</TooltipContent>
						</Tooltip>
					</UserRow>
				))
			)}
		</UserListRoot>
	)
}

const UserListRoot = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  overflow-y: auto;
  gap: 12px;
  padding: 8px 4px;
`

const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border-block-end: 1px solid rgba(0, 0, 0, 0.06);
  direction: rtl;
`

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const UserInfo = styled.div<{ $type: PermissionType }>`
  color: ${({ $type }) => ($type === PermissionType.MANAGER ? "var(--active-color)" : " var(--sea-ink)")};
  
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;

  cursor: ${({ $type }) => ($type === PermissionType.MANAGER ? "pointer" : "default")};
`

const UserName = styled.span`
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const UserPersonalId = styled.span`
  font-size: var(--fs-base);
  font-weight: 400;
  white-space: nowrap;
`

const UserSubtext = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CenterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
