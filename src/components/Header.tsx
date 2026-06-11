import styled from "@emotion/styled"
import { Link, useRouterState } from "@tanstack/react-router"
import { ChevronDown, User } from "lucide-react"
import type { HeaderConfig } from "src/router"
import { useHeader } from "../providers/HeaderProvider"
import { BIHeaderBypass } from "./BIHeaderBypass"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export default function Header() {
	const { matches } = useRouterState()

	const headerConfig = [...matches].reverse().find((m) => m.staticData.header)
		?.staticData.header as HeaderConfig | undefined

	const { title = "" } = headerConfig ?? {}

	const {
		elementPlacements: { right, center, titleBar },
	} = useHeader()

	const showTitleBar = title || titleBar

	return (
		<HeaderContainer>
			<HeaderRoot>
				<HeaderInner>
					<StartSection>
						<Link to="/">
							<LogoImage src="/logo.svg" alt="Logo" />
						</Link>

						{right}
					</StartSection>

					<CenterSection>{center}</CenterSection>

					<EndSection>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<UserTrigger>
									<User size={16} />
									<ChevronDown size={16} />
								</UserTrigger>
							</DropdownMenuTrigger>
							<UserDropdownContent>
								<BIHeaderBypass />
							</UserDropdownContent>
						</DropdownMenu>
					</EndSection>
				</HeaderInner>
			</HeaderRoot>

			{showTitleBar && (
				<TitleBar>
					{title && <PageTitle>{title}</PageTitle>}

					{titleBar}
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
