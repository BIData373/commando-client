import styled from "@emotion/styled"
import type { AssigneeDto } from "src/api/model"
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar"
import { getInitials } from "src/utils/avatar-utils"
import { formatMesibaIcon } from "src/utils/icon-utils"

const DEFAULT_SIZE = 32

interface AssigneeAvatarProps {
	assignee: AssigneeDto
	size?: number
	ref?: React.Ref<HTMLButtonElement>
	cursor?: boolean
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
			<StyledImage src={formatMesibaIcon(assignee.icon)} alt={assignee.name} />
			<ColoredFallback $color={assignee.color}>
				{getInitials(assignee.name)}
			</ColoredFallback>
		</StyledRoot>
	)
}

const StyledRoot = styled(Avatar)<{
	$size: number
	$cursor?: boolean
}>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  flex-shrink: 0;
  cursor: ${({ $cursor }) => ($cursor ? "pointer" : "default")};

  &:has(img) {
    border: 0;

    &::after {
      border: none;
    }
  }
`

const StyledImage = styled(AvatarImage)`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 0;
`

const ColoredFallback = styled(AvatarFallback)<{
	$color: string | null
}>`
  background: ${({ $color }) => $color ?? "var(--chip-bg)"};
  color: var(--background);
  font-size: var(--fs-btn);
  font-weight: 400;
  width: 100%;
  height: 100%;
  border-radius: 50%;
`
