import styled from "@emotion/styled"
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
								<UserName>{user.info?.name}</UserName>
								<UserPersonalId> - {user.upn}</UserPersonalId>
							</UserHeader>
							<UserSubtext>{user.info?.displayName}</UserSubtext>
						</UserInfo>
						<DropdownPermission
							value={type}
							disabled={user.upn === currentUser.upn}
							onChange={(type) => onTypeChange(user, type)}
						/>
						<Tooltip>
							<TooltipTrigger asChild>
								<span>
									<TrashButton
										visible={user.upn !== currentUser.upn}
										onClick={() => onDelete(user)}
										size={22}
									/>
								</span>
							</TooltipTrigger>
							<TooltipContent hidden={user.upn === currentUser.upn}>
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
  gap: 4px;
`

const UserInfo = styled.div<{ $type: PermissionType }>`
  color: ${({ $type }) => ($type === PermissionType.MANAGER ? "var(--active-color)" : " var(--sea-ink)")};
  
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;

  cursor: ${({ $type }) => ($type === PermissionType.MANAGER ? "pointer" : "default")};
`

const UserName = styled.span`
  font-size: 15px;
  font-weight: 500;
`

const UserPersonalId = styled.span`
  font-size: var(--fs-base);
  font-weight: 400;
`

const UserSubtext = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
`

const CenterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
