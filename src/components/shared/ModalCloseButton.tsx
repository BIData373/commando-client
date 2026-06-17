import styled from "@emotion/styled"
import { X } from "lucide-react"

interface ModalCloseButtonProps {
	onClose(): void
}

export default function ModalCloseButton({ onClose }: ModalCloseButtonProps) {
	return (
		<StyledModalCloseButton onClick={onClose}>
			<X size={16} />
		</StyledModalCloseButton>
	)
}

const StyledModalCloseButton = styled.button`
  position: absolute;
  inset-block-start: 15px;
  inset-inline-end: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 2px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  outline: none;

  &:hover {
    color: var(--text-color-2);
    background: rgba(0, 0, 0, 0.04);
  }
`
