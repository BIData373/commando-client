import styled from "@emotion/styled"
import { useHotkeys } from "@mantine/hooks"
import { X } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import {
	DialogClose,
	DialogContentPrimitive,
	DialogOverlay,
	DialogPortal,
} from "src/components/ui/dialog"
import { ModalCloseButton } from "./ModalCloseButton"

interface ModalContentProps
	extends ComponentProps<typeof DialogContentPrimitive> {
	className?: string
	headerActions?: ReactNode
	closable?: boolean
	showCloseButton?: boolean
	headerPadding?: number
}

export function ModalContent({
	children,
	className,
	headerActions,
	closable = true,
	showCloseButton = true,
	onPointerDownOutside,
	headerPadding,
	...props
}: ModalContentProps) {
	useHotkeys(closable ? [] : [["Escape", (e) => e.stopPropagation()]])

	function preventClose(e: Event) {
		e.preventDefault()
	}

	return (
		<DialogPortal>
			<DialogOverlay />
			<ModalRoot
				className={className}
				onEscapeKeyDown={closable ? undefined : preventClose}
				onPointerDownOutside={closable ? onPointerDownOutside : preventClose}
				{...props}
			>
				<ModalHeader $padding={headerPadding}>
					{headerActions ? (
						<>
							{headerActions}

							{showCloseButton && <ModalCloseButton />}
						</>
					) : (
						showCloseButton && <FloatingCloseButton />
					)}
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

const ModalHeader = styled.div<{ $padding?: number }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  padding: ${({ $padding }) => $padding ?? 16}px;
  flex-shrink: 0;
`

const FloatingCloseButton = styled(ModalCloseButton)`
  position: absolute;
  inset-block-start: 16px;
  inset-inline-end: 16px;
  z-index: 2;
`
