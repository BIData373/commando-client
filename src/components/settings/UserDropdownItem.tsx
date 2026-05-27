import styled from "@emotion/styled";
import type { UserDto } from "src/api/model";

interface UserItemProps {
	user: UserDto;
}

// FIX Optional name?s
export function UserItem({ user: { id, upn, info } }: UserItemProps) {
	return (
		<>
			<UserName>
				{info?.name} - {id}
			</UserName>
			<UserMeta>{upn}</UserMeta>
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
