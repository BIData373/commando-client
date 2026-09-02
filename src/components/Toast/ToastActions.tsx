import type { ReactNode } from "react"
import { TOAST_CLASS } from "../../functions/toast-constants"
import type { ToastAction } from "./toast-types"

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

	const groupClassName = [
		TOAST_CLASS.customActions,
		direction === "row" && TOAST_CLASS.actionsRow,
	]
		.filter(Boolean)
		.join(" ")

	return (
		<div className={groupClassName}>
			{actions.map((action, index) => (
				<button
					className={`toast-action toast-action-${action.variant}`}
					type="button"
					key={`${action.variant}-${index}`}
					onClick={() => handleActionClick(action)}
				>
					{action.label}
				</button>
			))}

			{closeLabel != null && (
				<button
					className={TOAST_CLASS.closeText}
					type="button"
					onClick={onClose}
				>
					{closeLabel}
				</button>
			)}
		</div>
	)
}
