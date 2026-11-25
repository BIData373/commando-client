import styled from "@emotion/styled"
import { Link } from "@tanstack/react-router"
import { useMemo } from "react"
import { useRenderInHeader } from "src/providers/HeaderProvider"
import { HeaderNavTab } from "../shared/HeaderNavTab"
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "../ui/navigation-menu"

export function PersonalHeaderTabs() {
	const sectionTabs = useMemo(
		() => (
			<NavigationMenu viewport={false}>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavMenuLink asChild>
							<Link to="/personal/archive">ארכיון</Link>
						</NavMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavMenuLink asChild>
							<Link to="/personal/tasks">הנחיות</Link>
						</NavMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		),
		[],
	)

	useRenderInHeader("right", sectionTabs)

	return null
}

const NavMenuLink = styled(HeaderNavTab)`
  && {
    border-radius: var(--radius-sm);

    &[data-status='active'] {
      background: var(--Components-Dropdown-Global-controlItemBgHover);
    }
  }
`
