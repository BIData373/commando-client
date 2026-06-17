import styled from "@emotion/styled"
import type { MirageUserDto } from "src/api/model"

interface UserItemProps {
	user: MirageUserDto
}

export function UserItem({ user: { upn, info } }: UserItemProps) {
	return (
		<StyledUser>
			{info?.name && (
				<UserName title={info?.name}>
					{info?.name}
					{" - "}
				</UserName>
			)}

			<UserUpn title={upn}>{upn}</UserUpn>

			<UserMeta title={info?.displayName}>{info?.displayName ?? ""}</UserMeta>
		</StyledUser>
	)
}

const StyledUser = styled.div`
	display: flex;
	gap: 8px;
	height: 100%;
	align-items: center;
`

const UserName = styled.span`
	font-size: var(--fs-base);
	font-weight: 600;
	color: rgba(0, 0, 0, 0.88);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	flex-shrink: 1;
	min-width: 0;
`

const UserUpn = styled.span`
	font-size: var(--fs-base);
	font-weight: 400;
	color: rgba(0, 0, 0, 0.88);
	white-space: nowrap;
`

const UserMeta = styled.span`
	font-size: var(--fs-btn);
	font-weight: 400;
	color: rgba(0, 0, 0, 0.45);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	flex-shrink: 100;
	min-width: 0;
	text-align: end;
`
