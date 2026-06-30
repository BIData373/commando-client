import styled from "@emotion/styled"
import { X } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import {
	DialogClose,
	DialogContentPrimitive,
	DialogOverlay,
	DialogPortal,
} from "src/components/ui/dialog"

interface ModalContentProps
	extends ComponentProps<typeof DialogContentPrimitive> {
	className?: string
	headerActions?: ReactNode
}

export function ModalContent({
	children,
	className,
	headerActions,
	...props
}: ModalContentProps) {
	return (
		<DialogPortal>
			<DialogOverlay />
			<ModalRoot className={className} {...props}>
				<ModalHeader>
					{headerActions}
					<CloseButton>
						<X size={16} />
					</CloseButton>
				</ModalHeader>
				{children}
			</ModalRoot>
		</DialogPortal>
	)
}

const ModalRoot = styled(DialogContentPrimitive)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  background: var(--background);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow:
    0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px rgba(0, 0, 0, 0.12),
    0px 9px 28px rgba(0, 0, 0, 0.05);
  z-index: var(--z-dropdown);
  outline: none;
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  padding: 16px;
  flex-shrink: 0;
`

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

  transition-property: background, color;
  transition: 150ms ease-in-out;

  &:hover {
    background: var(--button-hover);
    color: var(--sea-ink);
  }

  &:active {
    background: var(--button-active);
    color: var(--sea-ink);
  }
`
