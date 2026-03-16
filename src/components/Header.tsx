import styled from '@emotion/styled'
import { Link, useRouterState, type LinkComponentProps } from '@tanstack/react-router'
import { ChevronDown, User } from 'lucide-react'
import { Avatar, AvatarFallback } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import ThemeToggle from './ThemeToggle'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from './ui/navigation-menu'
import type { HeaderConfig } from '#/router'

export default function Header() {
  const links: LinkComponentProps[] = [
    { to: '/workspace/$urlName/settings', children: 'הגדרות לשכה' },
    { to: '/workspace/$urlName/tasks', children: 'הנחיות' },
    { to: '/workspace/$urlName/dashboard', children: 'בית' }
  ]

  const matches = useRouterState({
    select: (s) => s.matches
  })
  const { title = '', navigation = true, user = true, workspace = false } = (matches.reverse().find(m => m.staticData.header) ?? {}) as HeaderConfig
  // TODO - if workspace, get loader data
  console.log(title, navigation, workspace, user)

  return (
    <HeaderRoot>
      <HeaderInner>
        <LeftSection>
          {!user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <UserTrigger>
                  <ChevronDown size={20} />
                  <Avatar>
                    <AvatarFallback>
                      <User size={20} />
                    </AvatarFallback>
                  </Avatar>
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
        </LeftSection>

        <CenterSection>
          {workspace && (
            <>
              {/* <WorkspaceName>{workspace.name}</WorkspaceName>
              <WorkspaceIcon src={workspace.iconUrl} alt="Workspace icon" /> */}
              <WorkspaceName>Example Workspace</WorkspaceName>
              {/* <WorkspaceIcon src={workspace.iconUrl} alt="Workspace icon" /> */}
            </>
          )}
        </CenterSection>

        <RightSection>
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
          <LogoImage src="/logo.svg" alt="Logo" />
        </RightSection>
      </HeaderInner>
    </HeaderRoot>
  )
}

const HeaderRoot = styled.header`
  position: sticky;
  margin: 20px 32px 28px 32px;
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

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`

const UserTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--chip-bg);
  border: 1px solid var(--chip-line);
  border-radius: 40px;
  padding-inline-start: 16px;
  padding-inline-end: 6px;
  height: 52px;
  cursor: pointer;
  color: var(--sea-ink);
`

const CenterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

const RightSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const LogoImage = styled.img`
  width: 28px;
  height: 28px;
  margin-inline-start: 28px;
  object-fit: contain;
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
