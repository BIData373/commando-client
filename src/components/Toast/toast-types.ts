import type { ReactNode } from "react"
import type { ExternalToast } from "sonner"

export type ToastMessage = ReactNode | (() => ReactNode)

export type ToastType = "success" | "error" | "info" | "warning"

export type ToastActionVariant = "primary" | "cancel" | "danger"

export interface ToastAction {
	label: ReactNode
	onClick(): void
	variant: ToastActionVariant
	/** Dismiss the toast after the handler runs. Defaults to `true`. */
	dismissOnClick?: boolean
}

/**
 * Options supported by the application toast wrapper.
 *
 * Sonner options such as `duration` and `onAutoClose` remain available. The
 * options below add application-specific presentation:
 *
 * - `actions`: one or more primary, cancel, or danger actions.
 * - `actionsDirection`: stacks actions in a column (default) or a row.
 * - `banner`: places the toast at the top and removes its card radius/shadow.
 * - `bannerAlign`: aligns banner content to the center or right. Defaults to `center`.
 * - `border`: shows the status border. Defaults to `true`.
 * - `closeable`: renders a close affordance. Defaults to `true`.
 * - `closeText`: replaces the close icon with text. `true` uses `סגור`.
 * - `icon`: `true` uses the status icon, `false` hides it, or pass a custom node.
 * - `onCancel`: runs on any user-initiated dismissal, not on auto-close.
 * - `progressBar`: shows the countdown bar. Defaults to `true`.
 * - `subtitle`: secondary line rendered under the message.
 */
export type AppToastOptions = Omit<
	ExternalToast,
	"action" | "className" | "closeButton" | "icon"
> & {
	actions?: ToastAction | ToastAction[]
	actionsDirection?: "row" | "column"
	banner?: boolean
	bannerAlign?: "center" | "right"
	border?: boolean
	closeable?: boolean
	closeText?: boolean | ReactNode
	icon?: boolean | ReactNode
	onCancel?(): void
	progressBar?: boolean
	subtitle?: ReactNode
}
