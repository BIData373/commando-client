import styled from "@emotion/styled"
import type { PermissionDto, PermissionDtoType, UserDto } from "src/api/model"
import { TrashButton } from "../shared/TrashButton"
import { DropdownPermission } from "./DropdownPermission"

interface UserPermissionListProps {
	permissions: PermissionDto[]
	onDelete: (user: UserDto) => void
	onTypeChange: (user: UserDto, type: PermissionDtoType) => void
}

export function UserPermissionList({
	permissions,
	onDelete,
	onTypeChange,
}: UserPermissionListProps) {
	return (
		<UserListRoot>
			{permissions.map(({ user, type }) => (
				<UserRow key={user.id}>
					<UserInfo>
						<UserHeader>
							<UserName>{user.info?.name}</UserName>
							<UserPersonalId> - {user.id}</UserPersonalId>
						</UserHeader>
						<UserSubtext>{user.upn}</UserSubtext>
					</UserInfo>
					<DropdownPermission
						value={type}
						onChange={(type) => onTypeChange(user, type)}
					/>
					<TrashButton onClick={() => onDelete(user)} size={22} />
				</UserRow>
			))}
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

const UserInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const UserName = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: var(--sea-ink);
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
