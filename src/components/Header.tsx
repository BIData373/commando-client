import styled from "@emotion/styled"
import {
	Link,
	type LinkComponentProps,
	useRouterState,
} from "@tanstack/react-router"
import { ChevronDown, User } from "lucide-react"
import type { HeaderConfig } from "src/router"
import { useTitleBarActions } from "../providers/TitleBarProvider"
// import ThemeToggle from "./ThemeToggle"
import { BIHeaderBypass } from "./BIHeaderBypass"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "./ui/navigation-menu"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip"

export default function Header() {
	// In RTL flex, first item is rightmost. 'בית' is the primary/rightmost link.
	const links: LinkComponentProps[] = [
		{ to: "/workspace/$urlName/dashboard", children: "בית" },
		{ to: "/workspace/$urlName/tasks", children: "הנחיות" },
		{ to: "/workspace/$urlName/settings", children: "הגדרות לשכה" },
	]

	const { matches } = useRouterState()
	const headerConfig = [...matches].reverse().find((m) => m.staticData.header)
		?.staticData.header as HeaderConfig | undefined
	const {
		title = "",
		navigation = true,
		user = true,
		workspace = false,
	} = headerConfig ?? {}
	const { actions, workspace: activeWorkspace } = useTitleBarActions()
	const showTitleBar = title || actions

	return (
		<HeaderContainer>
			<HeaderRoot>
				<HeaderInner>
					<StartSection>
						<Link to="/">
							<LogoImage src="/logo.svg" alt="Logo" />
						</Link>
						{navigation && (
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
							</NavigationMenu>
						)}
					</StartSection>

					<CenterSection>
						{workspace && activeWorkspace && (
							<>
								{activeWorkspace.icon && (
									<WorkspaceIcon
										src={activeWorkspace.icon}
										alt="Workspace icon"
									/>
								)}
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<WorkspaceName>{activeWorkspace.title}</WorkspaceName>
										</TooltipTrigger>
										<TooltipContent>{activeWorkspace.title}</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</>
						)}
					</CenterSection>

					<EndSection>
						{/* {user && ( */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<UserTrigger>
									<User size={16} />
									<ChevronDown size={16} />
								</UserTrigger>
							</DropdownMenuTrigger>
							<UserDropdownContent>
								<BIHeaderBypass />
								{/* <DropdownMenuSeparator />
									<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
										<ThemeToggle />
									</DropdownMenuItem> */}
							</UserDropdownContent>
						</DropdownMenu>
						{/* )} */}
					</EndSection>
				</HeaderInner>
			</HeaderRoot>

			{showTitleBar && (
				<TitleBar>
					{title && <PageTitle>{title}</PageTitle>}
					{actions}
				</TitleBar>
			)}
		</HeaderContainer>
	)
}

const HeaderContainer = styled.div`
  padding: 20px 32px 0 32px;
`

const HeaderRoot = styled.header`
  position: sticky;
  top: 0;
  background: oklch(0.2077 0.038 275.77);
  border-bottom: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding-inline: 24px;
  z-index: var(--z-dropdown);
  box-shadow: 0 4px 50px rgba(0, 0, 0, 0.25);
  color: white;
`

const HeaderInner = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(0, auto) 1fr;
  align-items: center;
  height: 62px;
`

const StartSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const CenterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`

const EndSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const UserDropdownContent = styled(DropdownMenuContent)`
  min-width: 220px;
`

const UserTrigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #FFFFFF1F;
  border: none;
  border-radius: 40px;
  width: 64px;
  height: 32px;
  cursor: pointer;
  color: white;
  margin-block: 15px;
`

const WorkspaceName = styled.p`
  margin: 0;
  font-size: var(--fs-heading-3);
  font-weight: 500;
  line-height: 32px;
  color: #C7C9CB;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`

const WorkspaceIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`

const LogoImage = styled.img`
  width: 28px;
  height: 28px;
  margin-inline-end: 20px;
  object-fit: contain;
`

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 28px 8px;
`

const PageTitle = styled.h1`
  flex: 1;
  margin: 0;
  font-size: var(--fs-heading-1);
  font-weight: 500;
  color: var(--sea-ink);
`

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
