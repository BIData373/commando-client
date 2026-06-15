import styled from "@emotion/styled"
import type { MirageUserDto } from "src/api/model"

interface UserItemProps {
	user: MirageUserDto
}

export function UserItem({ user: { upn, info } }: UserItemProps) {
	return (
		<StyledUser>
			{info?.name && (
				<UserName>
					{info?.name}
					{" - "}
				</UserName>
			)}

			<UserUpn>{upn}</UserUpn>

			<UserMeta>{info?.displayName ?? ""}</UserMeta>
		</StyledUser>
	)
}

const StyledUser = styled.div`
	display: flex;
	gap: 8px;
	height: 100%;
	align-items: center;
	/* text-align: center; */
`

const UserName = styled.span`
  font-size: var(--fs-base);
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
`

const UserUpn = styled.span`
  font-size: var(--fs-base);
  font-weight: 400;
  color: rgba(0, 0, 0, 0.88);
`

const UserMeta = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  color: var(--text-color);
  color: rgba(0, 0, 0, 0.45);
`
