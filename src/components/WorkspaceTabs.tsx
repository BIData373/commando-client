import styled from "@emotion/styled"
import { Link } from "@tanstack/react-router"
import { PermissionType } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { useRenderInHeader } from "src/providers/HeaderProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { ArchiveDropdown } from "./shared/ArchiveDropdown"
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "./ui/navigation-menu"

interface WorkspaceTabsProps {
	isTasksOrArchive: boolean
	isArchive: boolean
}

export function WorkspaceTabs({
	isTasksOrArchive,
	isArchive,
}: WorkspaceTabsProps) {
	const {
		workspace: { id: workspaceId, urlName },
	} = useWorkspace()

	const { data: myPermission } = useGetMyPermission({ workspaceId })
	const isManager = myPermission?.type === PermissionType.MANAGER

	useRenderInHeader(
		"right",
		<NavigationMenu viewport={false}>
			<NavigationMenuList>
				{isManager && (
					<NavigationMenuItem>
						<NavMenuLink asChild>
							<Link to="/workspace/$urlName/settings" params={{ urlName }}>
								הגדרות סביבה
							</Link>
						</NavMenuLink>
					</NavigationMenuItem>
				)}
				<ArchiveDropdown
					tasksRoute={{ to: "/workspace/$urlName/tasks", params: { urlName } }}
					archiveRoute={{
						to: "/workspace/$urlName/archive",
						params: { urlName },
					}}
					isActive={isTasksOrArchive}
					isArchive={isArchive}
				/>
				<NavigationMenuItem>
					<NavMenuLink asChild>
						<Link to="/workspace/$urlName/dashboard" params={{ urlName }}>
							מסך המפקד
						</Link>
					</NavMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>,
		[isManager, isTasksOrArchive, isArchive, urlName],
	)

	return null
}

const NavMenuLink = styled(NavigationMenuLink)`
  && {
    padding: 8px 8px;
    white-space: nowrap;
    color: var(--Menu-Tab-Text);
    font-weight: 400;
    font-size: var(--fs-btn);
    background: transparent;
    border-radius: 6px;

    &:hover {
      color: var(--Menu-Tab-Text);
      background: var(--Menu-Tab-Hover);
    }

    &[data-status='active'] {
      color: var(--Menu-Tab-Text);
      background: var(--Menu-Tab-Hover);
    }
  }
`
