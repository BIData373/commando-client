import styled from "@emotion/styled"
import { CircleAlert } from "lucide-react"
import type { MouseEvent, ReactNode } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

export interface ConfirmPopoverProps {
	title?: string
	open: boolean
	onOpenChange: (open: boolean) => void
	onConfirm: () => void
	openManually?: boolean
	description?: ReactNode
	confirmLabel?: string
	cancelLabel?: string
	trigger?: ReactNode
	isPending?: boolean
	side?: "top" | "bottom" | "left" | "right"
	align?: "center" | "start" | "end"
	sideOffset?: number
	onCloseAutoFocus?: (e: Event) => void
}

export function ConfirmPopover({
	title,
	description,
	confirmLabel = "אישור",
	cancelLabel = "ביטול",
	trigger,
	open,
	onOpenChange,
	onConfirm,
	isPending,
	side = "top",
	align = "center",
	sideOffset = 12,
	onCloseAutoFocus,
	openManually = false,
}: ConfirmPopoverProps) {
	function handleCancel(e: MouseEvent) {
		e.stopPropagation()
		onOpenChange(false)
	}

	function handleConfirm(e: MouseEvent) {
		e.stopPropagation()
		onOpenChange(false)
		onConfirm()
	}

	return (
		<Popover
			open={open}
			onOpenChange={!openManually ? onOpenChange : undefined}
		>
			{trigger && <PopoverTrigger asChild>{trigger}</PopoverTrigger>}

			<Content
				side={side}
				sideOffset={sideOffset}
				align={align}
				onCloseAutoFocus={onCloseAutoFocus}
			>
				<Head>
					<TextWrapper>
						<Title>{title}</Title>

						{description && <Description>{description}</Description>}
					</TextWrapper>

					<IconWrapper>
						<CircleAlert size={16} />
					</IconWrapper>
				</Head>

				<Actions>
					<CancelButton onClick={handleCancel}>{cancelLabel}</CancelButton>

					<DeleteButton onClick={handleConfirm} disabled={isPending}>
						{confirmLabel}
					</DeleteButton>
				</Actions>
			</Content>
		</Popover>
	)
}

const Content = styled(PopoverContent)`
  direction: rtl;
  min-width: 330px;
  /* min-width: 326px; */
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 4px;
  background: var(--background);
  z-index: 1000;
  box-shadow: var(--card-shadow-hover);
`

const Head = styled.div`
  display: flex;
  flex-direction: row-reverse;
  gap: 8px;
  align-items: start;
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  gap: 4px;
  text-align: end;
  direction: ltr;
`

const Title = styled.p`
  font-size: var(--fs-base);
  font-weight: 600;
  line-height: 22px;
  color: var(--text-color-2);
  margin: 0;
`

const Description = styled.p`
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  margin: 0;
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-block: 2px;
  color: var(--Warning-color-warning);
  flex-shrink: 0;
`

const Actions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
`

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding-inline: 8px;
  border: none;
  border-radius: 2px;
  background: var(--Components-Form-Component-labelRequiredMarkColor);
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--background);
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: var(--Components-Form-Component-labelRequiredMarkColor);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding-inline: 8px;
  border: 1px solid var(--card-border);
  border-radius: 2px;
  background: var(--background);
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    border-color: var(--button-color-hover);
    color: var(--button-color-hover);
  }
`
