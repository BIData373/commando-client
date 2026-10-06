import styled from "@emotion/styled"
import { X } from "lucide-react"
import { DialogClose } from "../ui/dialog"

interface ModalCloseButtonProps {
	className?: string
}

export function ModalCloseButton({ className }: ModalCloseButtonProps) {
	return (
		<CloseButton className={className}>
			<X size={16} />
		</CloseButton>
	)
}

const CloseButton = styled(DialogClose)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  flex-shrink: 0;
  color: var(--sea-ink-soft);
  cursor: pointer;
  outline: none;

  transition:
    background 150ms ease-in-out,
    color 150ms ease-in-out;

  &:hover {
    background: var(--button-hover);
    color: var(--sea-ink);
  }

  &:active {
    background: var(--button-active);
    color: var(--sea-ink);
  }
`
