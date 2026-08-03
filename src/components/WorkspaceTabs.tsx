import styled from "@emotion/styled"
import { Link, useRouterState } from "@tanstack/react-router"
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

export function WorkspaceTabs() {
	const {
		workspace: { id: workspaceId, urlName },
	} = useWorkspace()

	const { data: myPermission } = useGetMyPermission({ workspaceId })
	const isManager = myPermission?.type === PermissionType.MANAGER

	const pathname = useRouterState({ select: (s) => s.location.pathname })
	const isTasksOrArchive =
		pathname.includes(`/${urlName}/tasks`) ||
		pathname.includes(`/${urlName}/archive`)
	const isArchive = pathname.includes(`/${urlName}/archive`)

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
    color: #C7C9CB;
    font-weight: 400;
    font-size: var(--fs-btn);
    background: transparent;
    border-radius: 6px;

    &:hover {
      color: #C7C9CB;
      background: rgba(255, 255, 255, 0.1);
    }

    &[data-status='active'] {
      color: #C7C9CB;
      background: rgba(255, 255, 255, 0.15);
    }
  }
`
