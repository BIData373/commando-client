import styled from "@emotion/styled"
import { Link } from "@tanstack/react-router"
import { useLayoutEffect } from "react"
import { PermissionType } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { useRenderInHeader } from "src/providers/HeaderProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { ArchiveDropdown, type DropdownSection } from "./shared/ArchiveDropdown"
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "./ui/navigation-menu"

interface WorkspaceTabsProps {
	section?: DropdownSection
	isActive?: boolean
}

export function WorkspaceTabs({
	section,
	isActive = true,
}: WorkspaceTabsProps) {
	const {
		workspace: { id: workspaceId, urlName },
		activeSection,
		setActiveSection,
	} = useWorkspace()

	const { data: myPermission } = useGetMyPermission({ workspaceId })
	const isManager = myPermission?.type === PermissionType.MANAGER

	useLayoutEffect(() => {
		if (isActive && section) setActiveSection(section)
	}, [isActive, section, setActiveSection])

	const displaySection = isActive && section ? section : activeSection

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
					isActive={isActive}
					section={displaySection}
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
		[isManager, displaySection, isActive, urlName],
	)

	return null
}

const NavMenuLink = styled(NavigationMenuLink)`
  && {
    padding: 10px 8px;
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
