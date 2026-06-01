import styled from "@emotion/styled"
import type { AssigneeDto } from "src/api/model"
import { Avatar, AvatarFallback } from "../ui/avatar"

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
			{assignee.icon ? (
				<EmblemAvatarImg $size={size} src={assignee.icon} alt={assignee.name} />
			) : (
				<ColoredFallback $size={size} $color={assignee.color}>
					{getInitials(assignee.name)}
				</ColoredFallback>
			)}
		</StyledAvatar>
	)
}

const StyledAvatar = styled(Avatar)<{ $cursor?: boolean }>`
    &:hover {
        cursor: ${({ $cursor }) => ($cursor ? "pointer" : "default")};
    }
`

const ColoredFallback = styled(AvatarFallback)<{
	$color: string | null
	$size?: number
}>`
  background: ${({ $color }) => $color ?? "var(--chip-bg)"};
  color: var(--background);
  font-size: 14px;
  font-weight: 400;
  width: ${({ $size }) => ($size ? `${$size}px` : "none")};
  height: ${({ $size }) => ($size ? `${$size}px` : "none")};
`

const EmblemAvatarImg = styled.img<{ $size?: number }>`
  width: ${({ $size }) => ($size ? `${$size}px` : "none")};
  height: ${({ $size }) => ($size ? `${$size}px` : "none")};
  object-fit: contain;
  border-radius: 50%;
`
