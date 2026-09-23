import styled from "@emotion/styled"
import { Link } from "@tanstack/react-router"
import { User } from "lucide-react"
import logoWithText from "../assets/logo-with-text-dark.png"
import { useHeader } from "../providers/HeaderProvider"
import { UserDropdown } from "./UserDropdown"
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Separator } from "./ui/separator"
import { TooltipProvider } from "./ui/tooltip"

interface HeaderProps {
	className?: string
}

export default function Header({ className }: HeaderProps) {
	const {
		elementPlacements: { right, center, user },
	} = useHeader()

	return (
		<HeaderContainer className={className}>
			<HeaderRoot>
				<HeaderInner>
					<CenterSection>
						<TooltipProvider>
							<CenterTitle>{center}</CenterTitle>
						</TooltipProvider>
					</CenterSection>

					<StartSection>{right}</StartSection>

					<EndSection>
						<DropdownMenu>
							<StyledDropdownMenuTrigger asChild>
								<UserMenuButton>
									<UserMenuIcon />
								</UserMenuButton>
							</StyledDropdownMenuTrigger>
							{user ?? <UserDropdown showPersonalArea={false} />}
						</DropdownMenu>

						<EndSectionSeparator orientation="vertical" />

						<StyledLink to="/">
							<BiData>by BI DATA</BiData>
							<StyledImg src={logoWithText} alt="Logo" />
						</StyledLink>
					</EndSection>
				</HeaderInner>
			</HeaderRoot>
		</HeaderContainer>
	)
}

const HeaderContainer = styled.div`
  padding: 20px 32px 0 32px;
`

const HeaderRoot = styled.header`
  position: sticky;
  top: 0;
  /* background: oklch(0.2077 0.038 275.77); */
  border-radius: var(--radius-lg);
  padding-inline: 24px;
  z-index: var(--z-dropdown);
  color: var(--Background-color-bg-text-active);
`

const HeaderInner = styled.div`
  display: grid;
  grid-template-columns: minmax(240px, auto) 1fr minmax(240px, auto);
  align-items: center;
  height: 56px;
`

const StartSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
  min-width: 0;
`

const CenterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
`

const CenterTitle = styled.div`
  margin: 0;
  font-size: var(--fs-heading-3);
  font-weight: 500;
  line-height: 32px;
  color: var(--text-color-2);
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 10px;
`

const EndSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
`

const EndSectionSeparator = styled(Separator)`
  margin: 0px 4px 0px 12px;
  background-color: var(--Background-color-bg-text-active)
`

const UserMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding-inline: 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  outline: none;
  cursor: pointer;

  transition: background 150ms ease-in-out;

  &:hover,
  &:active,
  &[data-state="open"] {
    background: rgba(255, 255, 255, 0.18);
    color: rgba(255, 255, 255, 0.85);
  }
`

const UserMenuIcon = styled(User)`
  width: 16px;
  cursor: pointer;
`

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
`

const BiData = styled.span`
  color: var(--text-color-2);
  font-size: var(--fs-btn);
  align-self: flex-start;
  line-height: 40px;
  white-space: nowrap;
`

const StyledImg = styled.img`
  width: 100%;
  height: 80%;
`

const StyledDropdownMenuTrigger = styled(DropdownMenuTrigger)`
  transition: color 0.3s;
  &:hover {
    color: var(--text-color);
  }
`
