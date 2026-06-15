import styled from "@emotion/styled"
import type { LinkComponentProps } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import { PermissionType } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { useRenderInHeader } from "src/providers/HeaderProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "./ui/navigation-menu"

export function WorkspaceTabs() {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	const { data: myPermission } = useGetMyPermission({ workspaceId })
	const isManager = myPermission?.type === PermissionType.MANAGER

	const links: LinkComponentProps[] = [
		...(isManager
			? [
					{
						to: "/workspace/$urlName/settings",
						children: "הגדרות לשכה",
					} as LinkComponentProps,
				]
			: []),
		{ to: "/workspace/$urlName/tasks", children: "הנחיות" },
		{ to: "/workspace/$urlName/dashboard", children: "מסך המפקד" },
	]

	useRenderInHeader(
		"right",
		<NavigationMenu>
			<NavigationMenuList>
				{links.map((link) => (
					<NavigationMenuItem key={link.to}>
						<NavMenuLink asChild>
							<Link to={link.to}>{link.children}</Link>
						</NavMenuLink>
					</NavigationMenuItem>
				))}
			</NavigationMenuList>
		</NavigationMenu>,
		[isManager],
	)

	return null
}

const NavMenuLink = styled(NavigationMenuLink)`
  && {
    padding: 8px 8px;
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
