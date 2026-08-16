import styled from "@emotion/styled"
import { createLink, Link, type LinkProps } from "@tanstack/react-router"
import { ChevronDown } from "lucide-react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { NavigationMenuItem } from "../ui/navigation-menu"

export enum DropdownSection {
	TASKS = "tasks",
	ARCHIVE = "archive",
}

interface ArchiveDropdownProps {
	tasksRoute: LinkProps
	archiveRoute: LinkProps
	section: DropdownSection
	isActive: boolean
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
}: ArchiveDropdownProps) => {
	const routeByKey: Record<DropdownSection, LinkProps> = {
		tasks: tasksRoute,
		archive: archiveRoute,
	}

	return (
		<NavigationMenuItem>
			<SectionButton $active={isActive}>
				<SectionLink {...routeByKey[section]}>
					{DROPDOWN_ITEMS[section]}
				</SectionLink>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<ChevronButton>
							<ChevronDown size={14} />
						</ChevronButton>
					</DropdownMenuTrigger>
					<SectionDropdownContent side="bottom">
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
  background: ${({ $active }) => ($active ? "var(--Menu-Tab-Active)" : "transparent")};
  border-radius: 6px;

  &:hover {
    background: var(--Menu-Tab-Hover);
    color: var(--Menu-Tab-Text);
  }
`

const SectionLinkBase = styled.a`
  && {
    display: flex;
    align-items: center;
    padding: 8px 8px;
    color: var(--Menu-Tab-Text);
    font-size: var(--fs-btn);
    font-weight: 400;
    border-start-start-radius: 6px;
    border-end-start-radius: 6px;
    white-space: nowrap;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      background: var(--Menu-Tab-Hover);
    }
  }
`

const SectionLink = createLink(SectionLinkBase)

const ChevronButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  padding-inline: 8px;
  border: none;
  border-start-end-radius: 6px;
  border-end-end-radius: 6px;
  background: transparent;
  color: var(--Menu-Tab-Text);
  cursor: pointer;

  &:hover {
    background: var(--Menu-Tab-Hover);
  }
`

const SectionDropdownContent = styled(DropdownMenuContent)`
  && {
    direction: rtl;
    min-width: 80px;
    padding: 4px;
    border-radius: 8px;
    background: var(--header-bg);
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
  color: var(--Menu-Tab-Text);
  cursor: pointer;

  &[data-highlighted],
  &:hover {
    background: var(--Menu-Tab-Hover);
    color: var(--background);
    outline: none;
  }
`
