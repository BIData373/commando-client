import styled from "@emotion/styled"
import { Link, type LinkProps } from "@tanstack/react-router"
import { ChevronDown } from "lucide-react"
import { headerVariants } from "../Header"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { NavigationMenuItem } from "../ui/navigation-menu"
import { HeaderNavTab } from "./HeaderNavTab"

export enum DropdownSection {
	TASKS = "tasks",
	ARCHIVE = "archive",
}

interface ArchiveDropdownProps {
	tasksRoute: LinkProps
	archiveRoute: LinkProps
	section: DropdownSection
	isActive: boolean
	variant: "workspace" | "personal"
}

const DROPDOWN_ITEMS: Record<DropdownSection, string> = {
	[DropdownSection.TASKS]: "הנחיות",
	[DropdownSection.ARCHIVE]: "ארכיון",
}

export const ArchiveDropdown = ({
	tasksRoute,
	archiveRoute,
	section,
	isActive,
	variant,
}: ArchiveDropdownProps) => {
	const routeByKey: Record<DropdownSection, LinkProps> = {
		tasks: tasksRoute,
		archive: archiveRoute,
	}

	return (
		<NavigationMenuItem>
			<SectionButton $active={isActive}>
				<HeaderNavTab asChild>
					<Link {...routeByKey[section]}>{DROPDOWN_ITEMS[section]}</Link>
				</HeaderNavTab>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<ChevronButton>
							<StyledChevronDown size={14} />
						</ChevronButton>
					</DropdownMenuTrigger>
					<SectionDropdownContent $variant={variant} side="bottom">
						{Object.values(DropdownSection).map((key) => (
							<SectionDropdownItem key={key} asChild>
								<Link {...routeByKey[key]}>{DROPDOWN_ITEMS[key]}</Link>
							</SectionDropdownItem>
						))}
					</SectionDropdownContent>
				</DropdownMenu>
			</SectionButton>
		</NavigationMenuItem>
	)
}

const SectionButton = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  direction: rtl;
  background: ${({ $active }) => ($active ? "var(--archive-section-button-bg-active)" : "transparent")};
  border-radius: var(--radius-sm);
  overflow: hidden;
  color: var(--header-text-color);
`

const ChevronButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  padding-inline: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  outline: none;

  &:hover {
    background: var(--header-button-hover);
  }
`

const SectionDropdownContent = styled(DropdownMenuContent)<{
	$variant: keyof typeof headerVariants
}>`
  ${({ $variant }) => $variant && headerVariants[$variant]}
  && {
    direction: rtl;
    min-width: 80px;
    padding: 4px;
    border-radius: var(--radius-md);
    background: var(--dropdown-menu-bg);
    border: 1px solid var(--Menu-Tab-Hover);
    box-shadow: var(--dropdown-shadow);
  }
`

const SectionDropdownItem = styled(DropdownMenuItem)`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding-inline: 12px;
  padding-block: 5px;
  border-radius: 4px;
  font-size: var(--fs-btn);
  font-weight: 400;
  color: var(--header-text-color);
  cursor: pointer;

  &[data-highlighted],
  &:hover {
    background: var(--dropdown-item-bg-hover);
    color: var(--dropdown-item-text-hover);
    outline: none;
  }
`

const StyledChevronDown = styled(ChevronDown)`
  color: var(--header-text-color);
`
