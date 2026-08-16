import styled from "@emotion/styled"
import type { MirageUserDto } from "src/api/model"

interface UserItemProps {
	user: MirageUserDto
}

export function UserItem({ user: { upn, info } }: UserItemProps) {
	return (
		<StyledUser>
			<UserPrimary>
				{info?.name && (
					<>
						<UserName title={info?.name}>{info?.name}</UserName>
						<UserDash>{" - "}</UserDash>
					</>
				)}

				<UserUpn title={upn}>{upn}</UserUpn>
			</UserPrimary>

			<UserMeta title={info?.displayName}>{info?.displayName ?? ""}</UserMeta>
		</StyledUser>
	)
}

const StyledUser = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: right;
`

const UserPrimary = styled.span`
  display: flex;
  align-items: center;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;

  font-size: var(--fs-btn);
  font-weight: 400;
  color: var(--text-color-2);
`

const UserName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
  min-width: 0;
`

const UserDash = styled.span`
  padding: 0 3px;
`

const UserUpn = styled.span`
  white-space: nowrap;
  flex-shrink: 0;
`

const UserMeta = styled.span`
  font-size: var(--fs-sm);
  color: var(--text-color-400);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
`
