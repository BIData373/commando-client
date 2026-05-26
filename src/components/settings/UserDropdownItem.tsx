import styled from "@emotion/styled"
import type { UserDto } from "src/api/model"

interface UserItemProps {
	user: UserDto
}

export function UserItem({ user }: UserItemProps) {
	return (
		<>
			<UserName>
				{user.info?.name ?? ""} - {user.upn}
			</UserName>
			<UserMeta>{user.info?.displayName ?? ""}</UserMeta>
		</>
	)
}

const UserName = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.88);
`

const UserMeta = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: var(--text-color);
  color: rgba(0, 0, 0, 0.45);
`
