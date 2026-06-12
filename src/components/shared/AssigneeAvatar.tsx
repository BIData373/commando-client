import styled from "@emotion/styled"
import type { AssigneeDto } from "src/api/model"
import { formatMesibaIcon } from "src/utils/icon-utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface AssigneeAvatarProps {
	assignee: AssigneeDto
	size?: number
	ref?: React.Ref<HTMLButtonElement>
	cursor?: boolean
}

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
}

export const AssigneeAvatar = ({
	assignee,
	size,
	ref,
	cursor,
	...props
}: AssigneeAvatarProps) => {
	return (
		<StyledAvatar $cursor={cursor} ref={ref} {...props}>
			<EmblemAvatarImg
				$size={size}
				src={formatMesibaIcon(assignee.icon)}
				alt={assignee.name}
			/>
			<ColoredFallback $size={size} $color={assignee.color}>
				{getInitials(assignee.name)}
			</ColoredFallback>
		</StyledAvatar>
	)
}

const StyledAvatar = styled(Avatar)<{ $cursor?: boolean }>`
	display: flex;
	align-items: center;

	&:hover {
      cursor: ${({ $cursor }) => ($cursor ? "pointer" : "default")};
    }

	::after {
      content: none;
      border: none;
  	}
`

const ColoredFallback = styled(AvatarFallback)<{
	$color: string | null
	$size?: number
}>`
  background: ${({ $color }) => $color ?? "var(--chip-bg)"};
  color: var(--background);
  font-size: var(--fs-btn);
  font-weight: 400;
  width: ${({ $size }) => ($size ? `${$size}px` : "none")};
  height: ${({ $size }) => ($size ? `${$size}px` : "none")};
`

const EmblemAvatarImg = styled(AvatarImage)<{ $size?: number }>`
  width: ${({ $size }) => ($size ? `${$size}px` : "none")};
  height: ${({ $size }) => ($size ? `${$size}px` : "none")};
  object-fit: contain;
  border-radius: 50%;
`
