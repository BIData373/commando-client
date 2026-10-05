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

	const logoSource = variant === "workspace" ? logoWithText : logoWithTextDark

	return (
		<HeaderRoot $variant={variant}>
			<HeaderContainer>
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
							<StyledImg src={logoSource} alt="Logo" />
						</StyledLink>
					</EndSection>
				</HeaderInner>
			</HeaderContainer>
		</HeaderRoot>
	)
}

export const headerVariants = {
	workspace: `
      --root-padding: 20px 32px 0 32px;
      --root-border-bottom: none;
      --root-border-image: none;

      --container-background: oklch(0.2077 0.038 275.77);
      --container-border-bottom: 1px solid var(--line);
      --container-box-shaodw: var(--card-shadow);
      --container-icon-color: white;

      --header-text-color: var(--colors-base-neutral-11);

      --seperator-color: rgba(255, 255, 255, 0.5);

      --bi-data-color: #d2e0fa;

      --logo-height: auto;

      --icon-transition: none;
      --icon-hover-color: var(--colors-base-neutral-11);

      --header-button-hover: var(--Menu-Tab-Hover);

      --archive-section-button-bg-active: var(--Menu-Tab-Active);

      --dropdown-menu-bg: var(--header-bg);
      --dropdown-item-bg-hover: var(--Menu-Tab-Hover);
      --dropdown-item-text-hover: var(--Menu-Tab-Text);
    `,
	personal: `
      --root-padding: 20px 32px;
      --root-border-bottom: 2px var(--active-color-button) solid;
      --root-border-image: var(--default-linear) 1;

      --container-background: none;
      --container-border-bottom: none;
      --container-box-shaodw: none;
      --container-icon-color: var(--Background-color-bg-text-active);

      --header-text-color: var(--text-color-2);

      --seperator-color: var(--Background-color-bg-text-active);

      --bi-data-color: var(--text-color-2);

      --logo-height: 90%;

      --icon-transition: color 200ms ease-in-out;
      --icon-hover-color: var(--text-color);

      --header-button-hover: var(--button-hover);

      --archive-section-button-bg-active: var(--Components-Dropdown-Global-controlItemBgHover);

      --dropdown-menu-bg: var(--background-area);
      --dropdown-item-bg-hover: var(--Components-Dropdown-Global-controlItemBgHover);
      --dropdown-item-text-hover: var(--text-color-2);
    `,
} as const

const HeaderRoot = styled.div<{ $variant: keyof typeof headerVariants }>`
  ${({ $variant }) => $variant && headerVariants[$variant]}

  padding: var(--root-padding);
  border-bottom: var(--root-border-bottom);
	border-image: var(--root-border-image);
`

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  background: var(--container-background);
  border-bottom: var(--container-border-bottom);
  border-radius: var(--radius-lg);
  padding-inline: 24px;
  z-index: var(--z-dropdown);
  box-shadow: var(--container-box-shaodw);
  color: var(--header-text-color);
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
  color: var(--header-text-color);
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
  background-color: var(--seperator-color);
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
  color: var(--container-icon-color);
  transition: var(--icon-transition);
  &:hover {
    color: var(--icon-hover-color);
  }
`

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
`

const BiData = styled.span`
  color: var(--bi-data-color);
  font-size: var(--fs-btn);
  align-self: flex-start;
  line-height: 40px;
  white-space: nowrap;
`

const StyledImg = styled.img`
  height: var(--logo-height);
`
