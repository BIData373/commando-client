import type { HeaderConfig } from '#/router'
import styled from '@emotion/styled'
import { Link, useRouterState, type LinkComponentProps } from '@tanstack/react-router'
import { ChevronDown, User } from 'lucide-react'
import { useTitleBarActions } from '../providers/TitleBarProvider'
import ThemeToggle from './ThemeToggle'
import { Avatar, AvatarFallback } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from './ui/navigation-menu'

export default function Header() {
  // In RTL flex, first item is rightmost. 'בית' is the primary/rightmost link.
  const links: LinkComponentProps[] = [
    { to: '/workspace/$urlName/dashboard', children: 'בית' },
    { to: '/workspace/$urlName/tasks', children: 'הנחיות' },
    { to: '/workspace/$urlName/settings', children: 'הגדרות לשכה' },
  ]

  const { matches } = useRouterState()
  const headerConfig = matches.findLast(m => m.staticData.header)?.staticData.header as HeaderConfig | undefined
  const { title = '', navigation = true, user = true, workspace = false } = headerConfig ?? {}
  const { actions } = useTitleBarActions()
  const showTitleBar = title || actions

  return (
    <HeaderContainer>
      <HeaderRoot>
        <HeaderInner>
          <StartSection>
            <LogoImage src="/logo.svg" alt="Logo" />
            {navigation && (
              <NavigationMenu>
                <NavigationMenuList>
                  {links.map((link, index) => (
                    <NavigationMenuItem key={index}>
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
            {workspace && (
              <>
                {/* Icon first = rightmost in RTL */}
                <WorkspaceIcon src="/workspace-icon.png" alt="Workspace icon" />
                <WorkspaceName>Example Workspace</WorkspaceName>
              </>
            )}
          </CenterSection>

          {/* Col 3 — physically LEFT in RTL: user avatar */}
          <EndSection>
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <UserTrigger>
                    <Avatar>
                      <AvatarFallback>
                        <User size={20} />
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown size={20} />
                  </UserTrigger>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <ThemeToggle />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
  padding: 20px 32px 28px 32px;
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
  grid-template-columns: 1fr auto 1fr;
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
`

const EndSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const UserTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--chip-bg);
  border: 1px solid var(--chip-line);
  border-radius: 40px;
  padding-inline-start: 6px;
  padding-inline-end: 16px;
  height: 52px;
  cursor: pointer;
  color: var(--sea-ink);
`

const WorkspaceName = styled.p`
  margin: 0;
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
  color: var(--sea-ink);
  white-space: nowrap;
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
  font-size: 38px;
  font-weight: 500;
  line-height: 46px;
  color: rgba(0, 0, 0, 0.88);
`

const NavMenuLink = styled(NavigationMenuLink)`
  && {
    padding: 8px 8px;
    color: white;
    font-weight: 400;
    font-size: 14px;
    background: transparent;
    border-radius: 6px;

    &:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }

    &[data-status='active'] {
      color: white;
      background: rgba(255, 255, 255, 0.15);
    }
  }
`
