import styled from "@emotion/styled";
import type { IUser } from "src/types";

interface UserItemProps {
	user: IUser;
}

export function UserItem({ user }: UserItemProps) {
	return (
		<>
			<UserName>
				{user.name} - {user.id}
			</UserName>
			<UserMeta>{user.email}</UserMeta>
		</>
	);
}

const UserName = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.88);
`;

const UserMeta = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: var(--text-color);
  color: rgba(0, 0, 0, 0.45);
`;
