import styled from "@emotion/styled"
import { type PermissionDto, PermissionType, type UserDto } from "src/api/model"
import { extractUpnFromUser, formatDirectChatLink } from "src/utils/user-utils"
import noUsersFound from "../../assets/noUsersFound.svg"
import { EmptyCardState } from "../shared/EmptyCardState"
import { TrashButton } from "../shared/TrashButton"
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
	function navigateToChat(user: UserDto) {
		const upn = extractUpnFromUser(user)
		window.open(formatDirectChatLink(upn))
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
							onClick={() =>
								type === PermissionType.MANAGER && navigateToChat(user)
							}
						>
							<UserHeader>
								<UserName>{user.info?.name}</UserName>
								<UserPersonalId> - {user.upn}</UserPersonalId>
							</UserHeader>
							<UserSubtext>{user.info?.displayName}</UserSubtext>
						</UserInfo>
						<DropdownPermission
							value={type}
							onChange={(type) => onTypeChange(user, type)}
						/>
						<TrashButton onClick={() => onDelete(user)} size={22} />
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
`

const UserName = styled.span`
  font-size: 15px;
  font-weight: 500;
`

const UserPersonalId = styled.span`
  font-size: 16px;
  font-weight: 400;
`

const UserSubtext = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
`

const CenterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
