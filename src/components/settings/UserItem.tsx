import styled from "@emotion/styled";
import type { CreateUserDto } from "src/api/model";

interface UserItemProps {
	user: CreateUserDto;
}

export function UserItem({ user: { upn, info } }: UserItemProps) {
	return (
		<>
			<UserName>
				{info?.name}{!!info?.displayName ? ' - ' : ''}{info?.displayName}
			</UserName>

			<UserMeta>{upn.split('@idf.il')[0]}</UserMeta>
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
