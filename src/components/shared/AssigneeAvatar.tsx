import styled from "@emotion/styled"
import { Avatar } from "radix-ui"
import type { AssigneeDto } from "src/api/model"
import { formatMesibaIcon } from "src/utils/icon-utils"
import { AvatarFallback } from "../ui/avatar"

const DEFAULT_SIZE = 32

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
	size = DEFAULT_SIZE,
	ref,
	cursor,
	...props
}: AssigneeAvatarProps) => {
	return (
		<StyledRoot $size={size} $cursor={cursor} ref={ref} {...props}>
			<StyledImage
				$size={size}
				src={formatMesibaIcon(assignee.icon)}
				alt={assignee.name}
			/>
			<ColoredFallback $size={size} $color={assignee.color}>
				{getInitials(assignee.name)}
			</ColoredFallback>
		</StyledRoot>
	)
}

const StyledRoot = styled(Avatar.Root)<{
	$size: number
	$cursor?: boolean
}>`
  position: relative;
  display: flex;
  flex-shrink: 0;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  cursor: ${({ $cursor }) => ($cursor ? "pointer" : "default")};
`

const StyledImage = styled(Avatar.Image)<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  object-fit: contain;
`

const ColoredFallback = styled(AvatarFallback)<{
	$color: string | null
	$size: number
}>`
  background: ${({ $color }) => $color ?? "var(--chip-bg)"};
  color: var(--background);
  font-size: var(--fs-btn);
  font-weight: 400;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
`
