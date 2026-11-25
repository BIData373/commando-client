import styled from "@emotion/styled"
import { Link } from "@tanstack/react-router"
import { useMemo } from "react"
import { TEST_IDS } from "src/consts/test-ids"
import { useRenderInHeader } from "src/providers/HeaderProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { HeaderNavTab } from "./shared/HeaderNavTab"
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "./ui/navigation-menu"

export function WorkspaceTabs() {
	const {
		workspace: { urlName },
	} = useWorkspace()

	const headerTabs = useMemo(
		() => (
			<NavigationMenu viewport={false}>
				<NavigationMenuList>
					{/* <NavigationMenuItem>
						<NavMenuLink asChild>
							<Link
								data-testid={TEST_IDS.header.tabDiscussions}
								to="/workspace/$urlName/discussions"
								params={{ urlName }}
							>
								דיונים
							</Link>
						</NavMenuLink>
					</NavigationMenuItem> */}

					<NavigationMenuItem>
						<NavMenuLink asChild>
							<Link to="/workspace/$urlName/tasks" params={{ urlName }}>
								הנחיות
							</Link>
						</NavMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavMenuLink asChild>
							<Link
								data-testid={TEST_IDS.header.tabDashboard}
								to="/workspace/$urlName/dashboard"
								params={{ urlName }}
							>
								מסך המפקד
							</Link>
						</NavMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		),
		[urlName],
	)

	useRenderInHeader("right", headerTabs)

	return null
}

const NavMenuLink = styled(HeaderNavTab)`
  && {
    border-radius: var(--radius-sm);

    &[data-status='active'] {
      background: var(--Menu-Tab-Hover);
    }
  }
`
