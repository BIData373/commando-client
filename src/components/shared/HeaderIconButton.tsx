import styled from "@emotion/styled"
import { Link, type LinkProps } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface HeaderIconButtonProps {
	icon: ReactNode
	tooltip: string
	linkProps: LinkProps
}

export function HeaderIconButton({
	icon,
	tooltip,
	linkProps,
}: HeaderIconButtonProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<IconButtonWrapper>
					<Link {...linkProps}>{icon}</Link>
				</IconButtonWrapper>
			</TooltipTrigger>
			<TooltipContent side="top">{tooltip}</TooltipContent>
		</Tooltip>
	)
}

const IconButtonWrapper = styled.div`
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    padding-inline: 8px;
    border-radius: 6px;
    color: var(--container-icon-color);
    cursor: pointer;
    transition: background 150ms ease-in-out;

    &:hover,
    &[data-status='active'] {
      background: rgba(255, 255, 255, 0.18);
    }
  }
`
