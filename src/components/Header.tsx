import styled from "@emotion/styled"
import { Link } from "@tanstack/react-router"
import { User } from "lucide-react"
import logoWithText from "../assets/logo-with-text.svg"
import { useHeader } from "../providers/HeaderProvider"
import { UserDropdown } from "./UserDropdown"
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Separator } from "./ui/separator"
import { TooltipProvider } from "./ui/tooltip"

export default function Header() {
	const {
		elementPlacements: { right, center, user },
	} = useHeader()

	return (
		<HeaderContainer>
			<HeaderRoot>
				<HeaderInner>
					<StartSection>{right}</StartSection>

					<CenterSection>
						<TooltipProvider>
							<CenterTitle>{center}</CenterTitle>
						</TooltipProvider>
					</CenterSection>

					<EndSection>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<UserMenuButton>
									<UserMenuIcon />
								</UserMenuButton>
							</DropdownMenuTrigger>
							{user ?? <UserDropdown showPersonalArea={false} />}
						</DropdownMenu>

						<EndSectionSeparator orientation="vertical" />

						<StyledLink to="/">
							<BiData>by BI DATA</BiData>
							<img src={logoWithText} alt="Logo" />
						</StyledLink>
					</EndSection>
				</HeaderInner>
			</HeaderRoot>
		</HeaderContainer>
	)
}

const HeaderContainer = styled.div`
  padding: 20px 32px 18px 32px;
`

const HeaderRoot = styled.header`
  position: sticky;
  top: 0;
  background: oklch(0.2077 0.038 275.77);
  border-bottom: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding-inline: 24px;
  z-index: var(--z-dropdown);
  box-shadow: var(--card-shadow);
  color: white;
`

const HeaderInner = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 56px;
`

const StartSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const CenterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: min(60vw, 640px);
  min-width: 0;
  overflow: hidden;
`

const CenterTitle = styled.p`
  margin: 0;
  font-size: var(--fs-heading-3);
  font-weight: 500;
  line-height: 32px;
  color: var(--colors-base-neutral-11);
  min-width: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 10px;
`

const EndSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const EndSectionSeparator = styled(Separator)`
  margin: 0px 4px 0px 12px;
  background-color: rgba(255, 255, 255, 0.5);
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
  color: #d2e0fa;
  font-size: var(--fs-btn);
  align-self: flex-start;
  line-height: 40px;
  white-space: nowrap;
`
