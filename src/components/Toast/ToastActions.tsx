import { css } from "@emotion/react"
import styled from "@emotion/styled"
import type { ReactNode } from "react"

export interface ToastAction {
	label: ReactNode
	onClick(): void
	variant: "primary" | "cancel" | "danger"
	/** Dismiss the toast after the handler runs. Defaults to `true`. */
	dismissOnClick?: boolean
}

interface ToastActionsProps {
	actions: ToastAction[]
	/** Close text to render in the actions slot, or null for no close text. */
	closeLabel: ReactNode
	direction: "row" | "column"
	onAction(action: ToastAction): void
	onClose(): void
}

export function ToastActions({
	actions,
	closeLabel,
	direction,
	onAction,
	onClose,
}: ToastActionsProps) {
	function handleActionClick(action: ToastAction) {
		onAction(action)
	}

	return (
		<ActionsGroup $direction={direction}>
			{actions.map((action, index) => (
				<ActionButton
					$variant={action.variant}
					type="button"
					key={`${action.variant}-${index}`}
					onClick={() => handleActionClick(action)}
				>
					{action.label}
				</ActionButton>
			))}

			{closeLabel != null && (
				<CloseTextButton type="button" onClick={onClose}>
					{closeLabel}
				</CloseTextButton>
			)}
		</ActionsGroup>
	)
}

const ActionsGroup = styled.div<{ $direction: "row" | "column" }>`
	display: flex;
	flex-direction: ${({ $direction }) => $direction};
	align-items: ${({ $direction }) =>
		$direction === "row" ? "center" : "flex-start"};
	gap: ${({ $direction }) => ($direction === "row" ? "10px" : "6px")};
	flex-shrink: 0;

	[data-sonner-toast]:has([data-description]) & {
		align-self: flex-start;
	}
`

const actionVariants = {
	primary: css`
		color: var(--background);
		background: var(--Components-Upload-Global-colorPrimary);
	`,
	cancel: css`
		min-width: auto;
		height: auto;
		padding: 0;
		color: var(--Components-Upload-Global-colorPrimary);
		background: transparent;
		border: 0;

		&:hover,
		&:active {
			color: var(--button-color-hover);
			background: transparent;
			opacity: 1;
		}
	`,
	danger: css`
		color: var(--alert-error-global-error);
		background: var(--background);
		border-color: var(--alert-error-global-error);
	`,
} as const

const ActionButton = styled.button<{ $variant: ToastAction["variant"] }>`
	min-width: 56px;
	height: 30px;
	padding-inline: 10px;
	border: 1px solid transparent;
	border-radius: 6px;
	font-size: var(--fs-btn);
	font-weight: 400;
	line-height: 1;
	cursor: pointer;
	transition:
		background 150ms ease,
		border-color 150ms ease,
		opacity 150ms ease;

	&:hover {
		opacity: 0.85;
	}

	${({ $variant }) => actionVariants[$variant]}
`

const CloseTextButton = styled.button`
	padding: 0;
	color: var(--text-color-400);
	background: transparent;
	border: 0;
	cursor: pointer;

	&:hover,
	&:active {
		color: var(--text-color-2);
	}
`
