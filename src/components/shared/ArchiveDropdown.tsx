import styled from "@emotion/styled"
import { createLink, Link, type NavigateOptions } from "@tanstack/react-router"
import { Archive, ChevronDown } from "lucide-react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { NavigationMenuItem } from "../ui/navigation-menu"

interface ArchiveDropdownProps {
	tasksRoute: NavigateOptions
	archiveRoute: NavigateOptions
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
			<SectionButton>
				<SectionLink {...currentRoute} $active={isActive}>
					{isArchive ? "ארכיון" : "הנחיות"}
				</SectionLink>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<ChevronButton $active={isActive}>
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

const SectionButton = styled.div`
  display: flex;
  align-items: center;
  direction: rtl;
`

const SectionLinkBase = styled.a<{ $active: boolean }>`
  && {
    display: flex;
    align-items: center;
    height: 32px;
    padding-inline: 8px;
    color: #C7C9CB;
    font-size: var(--fs-btn);
    font-weight: 400;
    background: ${({ $active }) => ($active ? "rgba(255,255,255,0.15)" : "transparent")};
    border-start-start-radius: 6px;
    border-end-start-radius: 6px;
    white-space: nowrap;
    text-decoration: none;

    &:hover {
      background: rgba(255,255,255,0.1);
      color: #C7C9CB;
    }
  }
`

const SectionLink = createLink(SectionLinkBase)

const ChevronButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 32px;
  background: ${({ $active }) => ($active ? "rgba(255,255,255,0.15)" : "transparent")};
  border: none;
  border-start-end-radius: 6px;
  border-end-end-radius: 6px;
  color: #C7C9CB;
  cursor: pointer;
  padding: 0;

  &:hover {
    background: rgba(255,255,255,0.1);
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
