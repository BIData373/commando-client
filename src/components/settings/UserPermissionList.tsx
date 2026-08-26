import styled from "@emotion/styled"
import {
	type MirageUserDto,
	PermissionType,
	type UserInfoDto,
} from "src/api/model"
import { navigateToUserChat } from "src/utils/user-utils"
import noUsersFound from "../../assets/empty-states/no-users-found.svg"
import { EmptyCardState } from "../shared/EmptyCardState"
import { TrashButton } from "../shared/TrashButton"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { DropdownPermission } from "./DropdownPermission"

const PermissionTypeLabel: Record<PermissionType, string> = {
	[PermissionType.MANAGER]: "ניהול",
	[PermissionType.VIEWER]: "צפייה",
}

interface UserPermissionListProps<T> {
	items: T[]
	getUser: (item: T) => MirageUserDto
	getType?: (item: T) => PermissionType
	onDelete: (item: T) => void
	onTypeChange?: (item: T, type: PermissionType) => void
	canDelete?: (item: T, index: number) => boolean
	canChangeType?: (item: T) => boolean
}

export function UserPermissionList<T>({
	items,
	getUser,
	getType,
	onDelete,
	onTypeChange,
	canDelete,
	canChangeType,
}: UserPermissionListProps<T>) {
	function handleClickUserInfo(item: T, type: PermissionType) {
		if (type === PermissionType.MANAGER) {
			navigateToUserChat(getUser(item))
		}
	}

	return (
		<UserListRoot>
			{items.length === 0 ? (
				<CenterContainer>
					<EmptyCardState
						imgSrc={noUsersFound}
						title="לא נמצאו משתמשים"
						description="טרם הוגדרו משתמשים כדי להציג נתונים"
					/>
				</CenterContainer>
			) : (
				items.map((item, index) => {
					const user = getUser(item)
					const type = getType?.(item) ?? PermissionType.MANAGER
					const deletable = canDelete?.(item, index) ?? true
					const typeChangeable = canChangeType?.(item) ?? true

					return (
						<UserRow key={user.upn}>
							<UserInfo
								$type={type}
								onClick={() => handleClickUserInfo(item, type)}
							>
								<UserHeader>
									{user.info?.name && (
										<>
											<UserName title={user.info?.name}>
												{user.info?.name}
											</UserName>
											<UserDash>{" - "}</UserDash>
										</>
									)}
									<UserPersonalId title={user.upn}>{user.upn}</UserPersonalId>
								</UserHeader>
								<UserSubtext title={user.info?.displayName}>
									{user.info?.displayName}
								</UserSubtext>
							</UserInfo>
							{onTypeChange ? (
								<DropdownPermission
									value={type}
									disabled={!typeChangeable}
									onChange={(t) => onTypeChange(item, t)}
								/>
							) : (
								<StaticPermissionLabel>
									{PermissionTypeLabel[type]}
								</StaticPermissionLabel>
							)}
							<Tooltip>
								<TooltipTrigger asChild>
									<span>
										<TrashButton
											visible={deletable}
											onClick={() => onDelete(item)}
											size={22}
										/>
									</span>
								</TooltipTrigger>
								<TooltipContent hidden={!deletable}>הסרת הרשאות</TooltipContent>
							</Tooltip>
						</UserRow>
					)
				})
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
  align-items: center;
  gap: 4px;
`

const UserInfo = styled.div<{ $type: PermissionType }>`
  color: ${({ $type }) => ($type === PermissionType.MANAGER ? "var(--active-color)" : " var(--sea-ink)")};

  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;

  cursor: ${({ $type }) => ($type === PermissionType.MANAGER ? "pointer" : "default")};
`

const UserName = styled.span`
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const UserDash = styled.span`
  font-size: var(--fs-base);
  font-weight: 400;
`

const UserPersonalId = styled.span`
  font-size: var(--fs-base);
  font-weight: 400;
  white-space: nowrap;
`

const UserSubtext = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CenterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const StaticPermissionLabel = styled.span`
  font-size: var(--fs-base);
  color: var(--text-color);
  flex-shrink: 0;
`
