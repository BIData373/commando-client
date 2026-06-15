import styled from "@emotion/styled"
import { Trash2 } from "lucide-react"
import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react"

interface TrashButtonProps
	extends DetailedHTMLProps<
		ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	size?: number
	visible?: boolean
}

export const TrashButton = ({
	size,
	visible = true,
	...props
}: TrashButtonProps) => {
	return (
		<DeleteButton $visible={visible} {...props}>
			<Trash2 size={size ?? 16} />
		</DeleteButton>
	)
}

const DeleteButton = styled.button<{ $visible: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
  border-radius: 2px;
  color: rgba(0, 0, 0, 0.45);

  &:hover {
    color: var(--text-color-2);
    background: rgba(0, 0, 0, 0.04);
  }

  &:active {
    color: var(--text-color-2);
    background: rgba(0, 0, 0, 0.15);
  }

  ${({ $visible }) => !$visible && `visibility: hidden;`}
`
