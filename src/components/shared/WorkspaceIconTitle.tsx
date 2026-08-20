import styled from "@emotion/styled"
import type { PropsWithChildren } from "react"
import { formatMesibaIcon } from "src/utils/icon-utils"
import EllipsisTooltip from "./EllipsisTooltip"

interface WorkspaceIconTitleProps extends PropsWithChildren {
	icon?: string | null
	title: string
	iconSize?: number
	rounded?: boolean
	className?: string
}

export default function WorkspaceIconTitle({
	icon,
	title,
	children,
	iconSize = 20,
	rounded = false,
	className,
}: WorkspaceIconTitleProps) {
	return (
		<Wrapper className={className}>
			{icon && (
				<IconImage
					$size={iconSize}
					$rounded={rounded}
					src={formatMesibaIcon(icon)}
					alt={title}
				/>
			)}

			<EllipsisTooltip tooltip={title}>{children ?? title}</EllipsisTooltip>
		</Wrapper>
	)
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`

const IconImage = styled.img<{ $size: number; $rounded: boolean }>`
  object-fit: ${({ $rounded }) => ($rounded ? "cover" : "contain")};
  border-radius: ${({ $rounded }) => ($rounded ? "50%" : "0")};
  flex-shrink: 0;

  ${({ $size }) => `
    width: ${$size}px;
    height: ${$size}px;
  `}
`
