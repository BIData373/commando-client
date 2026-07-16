import styled from "@emotion/styled"
import { Link, useRouterState } from "@tanstack/react-router"
import { User } from "lucide-react"
import type { HeaderConfig } from "src/router"
import logoWithText from "../assets/logo-with-text.svg"
import { useHeader } from "../providers/HeaderProvider"
import { UserDropdown } from "./UserDropdown"
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Separator } from "./ui/separator"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip"

export default function Header() {
	const { matches } = useRouterState()

	const headerConfig = [...matches].reverse().find((m) => m.staticData.header)
		?.staticData.header as HeaderConfig | undefined

	const { pageTitle = "", headerTitle } = headerConfig ?? {}

	const {
		elementPlacements: { right, center, titleBar, user },
	} = useHeader()

	const showTitleBar = pageTitle || titleBar

	const title = headerTitle ?? center

	return (
		<HeaderContainer>
			<HeaderRoot>
				<HeaderInner>
					<StartSection>{right}</StartSection>

					<CenterSection>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<TooltipTrigger asChild>
										<CenterTitle>{title}</CenterTitle>
									</TooltipTrigger>
									<TooltipContent>{title}</TooltipContent>
								</TooltipTrigger>
							</Tooltip>
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

			{showTitleBar && (
				<TitleBar>
					{pageTitle && <PageTitle>{pageTitle}</PageTitle>}

					{titleBar}
				</TitleBar>
			)}
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
  overflow: hidden;
`

const CenterTitle = styled.p`
  margin: 0;
  font-size: var(--fs-heading-3);
  font-weight: 500;
  line-height: 32px;
  color: #C7C9CB;
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

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
`

const BiData = styled.span`
  color: #D2E0FA;
  font-size: var(--fs-btn);
  align-self: flex-start;
  line-height: 40px;
`
