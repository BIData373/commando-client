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
	gap: 8px;
	height: 100%;
	align-items: center;
	align-content: center;
	overflow: hidden;
`

const UserPrimary = styled.span`
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
	overflow: hidden;
	min-width: 0;
	flex-shrink: 1;
`

const UserName = styled.span`
	font-size: var(--fs-base);
	font-weight: 600;
	color: var(--text-color-2);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	flex-shrink: 1;
	min-width: 0;
`

const UserDash = styled.span`
	font-size: var(--fs-base);
	font-weight: 400;
	color: var(--text-color-2);
	padding: 0 3px;
`

const UserUpn = styled.span`
	font-size: var(--fs-base);
	font-weight: 400;
	color: var(--text-color-2);
	white-space: nowrap;
	flex-shrink: 0;
`

const UserMeta = styled.span`
	font-size: var(--fs-btn);
	font-weight: 400;
	color: var(--text-color-400);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	flex: 1;
	min-width: 0;
	text-align: right;
`
