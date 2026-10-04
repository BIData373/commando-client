import styled from "@emotion/styled"
import { Link } from "@tanstack/react-router"
import { User } from "lucide-react"
import logoWithText from "../assets/logo-with-text.svg"
import logoWithTextDark from "../assets/logo-with-text-dark.png"
import { useHeader } from "../providers/HeaderProvider"
import { UserDropdown } from "./UserDropdown"
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Separator } from "./ui/separator"
import { TooltipProvider } from "./ui/tooltip"

interface HeaderProps {
	variant?: "workspace" | "personal"
}

export default function Header({ variant = "workspace" }: HeaderProps) {
	const {
		elementPlacements: { right, center, user },
	} = useHeader()

	const isWorkspaceHeader = variant === "workspace"
	const logoSource = isWorkspaceHeader ? logoWithText : logoWithTextDark

	return (
		<HeaderContainer $isWorkspaceHeader={isWorkspaceHeader}>
			<HeaderRoot $isWorkspaceHeader={isWorkspaceHeader}>
				<HeaderInner>
					<StartSection $isWorkspaceHeader={isWorkspaceHeader}>
						{right}
					</StartSection>

					<CenterSection>
						<TooltipProvider>
							<CenterTitle $isWorkspaceHeader={isWorkspaceHeader}>
								{center}
							</CenterTitle>
						</TooltipProvider>
					</CenterSection>

					<EndSection>
						<DropdownMenu>
							<StyledDropdownMenuTrigger
								asChild
								$isWorkspaceHeader={isWorkspaceHeader}
							>
								<UserMenuButton>
									<UserMenuIcon />
								</UserMenuButton>
							</StyledDropdownMenuTrigger>
							{user ?? <UserDropdown showPersonalArea={false} />}
						</DropdownMenu>

						<EndSectionSeparator
							$isWorkspaceHeader={isWorkspaceHeader}
							orientation="vertical"
						/>

						<StyledLink to="/">
							<BiData $isWorkspaceHeader={isWorkspaceHeader}>by BI DATA</BiData>
							<StyledImg
								$isWorkspaceHeader={isWorkspaceHeader}
								src={logoSource}
								alt="Logo"
							/>
						</StyledLink>
					</EndSection>
				</HeaderInner>
			</HeaderRoot>
		</HeaderContainer>
	)
}

const HeaderContainer = styled.div<{ $isWorkspaceHeader: boolean }>`
  padding: ${({ $isWorkspaceHeader }) => ($isWorkspaceHeader ? "20px 32px 0 32px" : "20px 32px")};
  border-bottom: ${({ $isWorkspaceHeader }) => ($isWorkspaceHeader ? "none" : "2px var(--active-color-button) solid")};
	border-image: ${({ $isWorkspaceHeader }) => ($isWorkspaceHeader ? "none" : "var(--default-linear) 1")};
`

const HeaderRoot = styled.header<{
	$isWorkspaceHeader: boolean
}>`
  position: sticky;
  top: 0;
  background: ${({ $isWorkspaceHeader }) => ($isWorkspaceHeader ? "oklch(0.2077 0.038 275.77)" : "none")};
  border-bottom: ${({ $isWorkspaceHeader }) => ($isWorkspaceHeader ? "1px solid var(--line)" : "none")};
  border-radius: var(--radius-lg);
  padding-inline: 24px;
  z-index: var(--z-dropdown);
  box-shadow: ${({ $isWorkspaceHeader }) => ($isWorkspaceHeader ? "var(--card-shadow)" : "none")};
  color: ${({ $isWorkspaceHeader }) => ($isWorkspaceHeader ? "white" : "var(--Background-color-bg-text-active)")};
`

const HeaderInner = styled.div`
  display: grid;
  grid-template-columns: minmax(240px, auto) 1fr minmax(240px, auto);
  align-items: center;
  height: 56px;
`

const StartSection = styled.div<{ $isWorkspaceHeader: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
  min-width: 0;
  margin-right: ${({ $isWorkspaceHeader }) => ($isWorkspaceHeader ? "none" : "1rem")};
  order: ${({ $isWorkspaceHeader }) => ($isWorkspaceHeader ? "0" : "1")};
`

const CenterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
`

const CenterTitle = styled.div<{ $isWorkspaceHeader: boolean }>`
  margin: 0;
  font-size: var(--fs-heading-3);
  font-weight: 500;
  line-height: 32px;
  color: ${({ $isWorkspaceHeader }) => ($isWorkspaceHeader ? "var(--colors-base-neutral-11)" : "var(--text-color-2)")};
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
  order: 2;
`

const EndSectionSeparator = styled(Separator)<{
	$isWorkspaceHeader: boolean
}>`
  margin: 0px 4px 0px 12px;
  background-color: ${({ $isWorkspaceHeader }) => ($isWorkspaceHeader ? "rgba(255, 255, 255, 0.5)" : "var(--Background-color-bg-text-active)")};
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

const BiData = styled.span<{
	$isWorkspaceHeader: boolean
}>`
  color: ${({ $isWorkspaceHeader }) => ($isWorkspaceHeader ? "#d2e0fa" : "var(--text-color-2)")};;
  font-size: var(--fs-btn);
  align-self: flex-start;
  line-height: 40px;
  white-space: nowrap;
`

const StyledImg = styled.img<{
	$isWorkspaceHeader: boolean
}>`
  height: ${({ $isWorkspaceHeader }) => ($isWorkspaceHeader ? "auto" : "90%")};
`

const StyledDropdownMenuTrigger = styled(DropdownMenuTrigger)<{
	$isWorkspaceHeader: boolean
}>`
  transition: ${({ $isWorkspaceHeader }) =>
		$isWorkspaceHeader ? "none" : "color 200ms ease-in-out"};
  &:hover {
    color: ${({ $isWorkspaceHeader }) =>
			$isWorkspaceHeader
				? "var(--colors-base-neutral-11)"
				: "var(--text-color)"};
  }
`
