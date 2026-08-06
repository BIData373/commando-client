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

interface ArchiveDropdownProps {
	tasksRoute: LinkProps
	archiveRoute: LinkProps
	isArchive: boolean
	isActive: boolean
}

export const ArchiveDropdown = ({
	tasksRoute,
	archiveRoute,
	isArchive,
	isActive,
}: ArchiveDropdownProps) => {
	const currentRoute = isArchive ? archiveRoute : tasksRoute

	return (
		<NavigationMenuItem>
			<SectionButton $active={isActive}>
				<SectionLink {...currentRoute}>
					{isArchive ? "ארכיון" : "הנחיות"}
				</SectionLink>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<ChevronButton>
							<ChevronDown size={14} />
						</ChevronButton>
					</DropdownMenuTrigger>
					<SectionDropdownContent side="bottom">
						<SectionDropdownItem asChild>
							<Link {...tasksRoute}>הנחיות</Link>
						</SectionDropdownItem>
						<SectionDropdownItem asChild>
							<Link {...archiveRoute}>ארכיון</Link>
						</SectionDropdownItem>
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
  background: ${({ $active }) => ($active ? "rgba(255,255,255,0.15)" : "transparent")};
  border-radius: 6px;

  &:hover {
    background: rgba(255,255,255,0.1);
    color: #C7C9CB;
  }
`

const SectionLinkBase = styled.a`
  && {
    display: flex;
    align-items: center;
    padding: 8px 8px;
    color: #C7C9CB;
    font-size: var(--fs-btn);
    font-weight: 400;
    border-start-start-radius: 6px;
    border-end-start-radius: 6px;
    white-space: nowrap;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      background: rgba(255,255,255,0.1);
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
  color: #C7C9CB;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

const SectionDropdownContent = styled(DropdownMenuContent)`
  && {
    direction: rtl;
    min-width: 80px;
    padding: 4px;
    border-radius: 8px;
    background: var(--header-bg);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
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
  color: #C7C9CB;
  cursor: pointer;

  &[data-highlighted],
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    outline: none;
  }
`
