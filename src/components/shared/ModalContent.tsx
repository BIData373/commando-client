import styled from "@emotion/styled"
import type { ComponentProps } from "react"
import {
	DialogContentPrimitive,
	DialogOverlay,
	DialogPortal,
} from "src/components/ui/dialog"

interface ModalContentProps
	extends ComponentProps<typeof DialogContentPrimitive> {
	className?: string
}

export function ModalContent({
	children,
	className,
	...props
}: ModalContentProps) {
	return (
		<DialogPortal>
			<DialogOverlay />
			<ModalRoot className={className} {...props}>
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
