import styled from "@emotion/styled"
import { useNavigate } from "@tanstack/react-router"
import { BookOpen, ChevronLeft, Grip, MessageSquareText } from "lucide-react"
import type { PermissionType } from "src/api/model"
import { useCurrentUser } from "src/hooks/useCurrentUser"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import {
	CHAT_CHANNEL_URL,
	PORTAL_CATALOG_URL,
	USER_GUIDE_URL,
} from "src/utils/env-utils"
import { BIHeaderBypass } from "./BIHeaderBypass"
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "./ui/dropdown-menu"

const PERMISSION_LABEL: Record<PermissionType, string> = {
	VIEWER: "צופה",
	MANAGER: "ניהול",
}

interface UserDropdownProps {
	permissionType?: PermissionType
	showPersonalArea?: boolean
}

export function UserDropdown({
	permissionType,
	showPersonalArea = true,
}: UserDropdownProps) {
	const navigate = useNavigate()
	const user = useCurrentUser()

	const displayName = user.info?.name || user.info?.displayName || user.upn

	function handleNavigateToPersonal() {
		navigate({
			to: "/personal",
			search: {
				view: TasksView.TABLE,
			},
		})
	}

	function handleOpenUserGuide() {
		window.open(USER_GUIDE_URL)
	}

	function handleOpenChat() {
		window.open(CHAT_CHANNEL_URL)
	}

	function handleOpenPortalCatalog() {
		window.open(PORTAL_CATALOG_URL)
	}

	return (
		<UserDropdownContent>
			<UserInfo>
				<UserInfoRow>
					<UserName>{displayName}</UserName>-<UserUpn>{user.upn}</UserUpn>
				</UserInfoRow>
				{permissionType && (
					<PermissionBadge>
						מורשה {PERMISSION_LABEL[permissionType]}
					</PermissionBadge>
				)}
			</UserInfo>

			<DropdownMenuSeparator />

			{showPersonalArea && (
				<>
					<DropdownMenuItem onSelect={handleNavigateToPersonal}>
						<PersonalAreaNavItem>
							מעבר לאזור אישי
							<PersonalAreaIcon />
						</PersonalAreaNavItem>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
				</>
			)}

			{USER_GUIDE_URL && (
				<DropdownMenuItem onSelect={handleOpenUserGuide}>
					<NavItem>
						<BookOpen size={16} />
						מארז הדרכה
					</NavItem>
				</DropdownMenuItem>
			)}

			{CHAT_CHANNEL_URL && (
				<DropdownMenuItem onSelect={handleOpenChat}>
					<NavItem>
						<MessageSquareText size={16} />
						צור קשר
					</NavItem>
				</DropdownMenuItem>
			)}

			{PORTAL_CATALOG_URL && (
				<DropdownMenuItem onSelect={handleOpenPortalCatalog}>
					<NavItem>
						<Grip size={16} />
						עוד מאיתנו
					</NavItem>
				</DropdownMenuItem>
			)}

			<BIHeaderBypass />
		</UserDropdownContent>
	)
}

const UserDropdownContent = styled(DropdownMenuContent)`
  min-width: 220px;
  direction: rtl;
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 4px;
`

const UserInfoRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`

const UserName = styled.span`
  font-size: var(--fs-btn);
  font-weight: 600;
  color: var(--sea-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
`

const UserUpn = styled.span`
  font-size: var(--fs-sm);
  color: var(--sea-ink-soft);
`

const PermissionBadge = styled.span`
  font-size: var(--fs-sm);
  color: var(--sea-ink-soft);
`

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`

const PersonalAreaNavItem = styled(NavItem)`
  justify-content: space-between;
`

const PersonalAreaIcon = styled(ChevronLeft)`
  width: 12px;
  color: var(--Components-Dropdown-Global-colorTextDescription);
`
