import type { CSSProperties, ReactNode } from "react"
import type { ExternalToast } from "sonner"
import { toast as sonnerToast } from "sonner"
import {
	count,
	TECHNICAL_FAILURE,
	TECHNICAL_FAILURE_SUBTITLE,
	type ToastCopy,
} from "../../functions/toast-messages"
import type { BatchResult } from "../../utils/batch-utils"
import { type ToastAction, ToastActions } from "./ToastActions"

/** Milliseconds a toast stays up before auto-dismissing. Override per toast
 * with `duration`, or `Infinity` to keep it open. */
export const TOAST_DURATION_MS = 3000

/** Hooks for the parts of the card sonner renders, not us. */
export const TOAST_CLASS = {
	banner: "toast-banner",
	bannerRight: "toast-banner-right",
	borderless: "toast-borderless",
	closeText: "toast-close-text",
	noProgress: "toast-no-progress",
} as const

type ToastMessage = ReactNode | (() => ReactNode)

/** Sonner's options minus what we own, plus our presentation flags. */
export type AppToastOptions = Omit<
	ExternalToast,
	"action" | "className" | "closeButton" | "icon" | "position"
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
}

const CLOSE_TEXT = "סגור"

interface ToastClassNameOptions {
	banner?: boolean
	bannerAlign?: AppToastOptions["bannerAlign"]
	border?: boolean
	showProgress: boolean
}

function getToastClassName({
	banner,
	bannerAlign,
	border,
	showProgress,
}: ToastClassNameOptions) {
	return [
		banner && TOAST_CLASS.banner,
		banner && bannerAlign === "right" && TOAST_CLASS.bannerRight,
		!border && TOAST_CLASS.borderless,
		!showProgress && TOAST_CLASS.noProgress,
	]
		.filter(Boolean)
		.join(" ")
}

function normalizeActions(actions?: ToastAction | ToastAction[]) {
	if (!actions) return []
	return Array.isArray(actions) ? actions : [actions]
}

function resolveIcon(icon: AppToastOptions["icon"]) {
	if (icon === true) return undefined
	if (icon === false) return null
	return icon
}

function showToast(
	type: "success" | "error" | "info" | "warning",
	message: ToastMessage,
	{
		actions,
		actionsDirection = "column",
		banner = false,
		bannerAlign = "center",
		border = true,
		closeable = true,
		closeText,
		icon = true,
		onCancel,
		onDismiss,
		progressBar = true,
		style,
		classNames,
		...options
	}: AppToastOptions = {},
) {
	const toastActions = normalizeActions(actions)
	// The close icon, the close text, and custom actions share one slot in the
	// design, so both text and actions replace the icon rather than sitting
	// beside it.
	const closeLabel = closeText === true ? CLOSE_TEXT : closeText
	const hasActions = toastActions.length > 0
	const showCloseText = closeable && Boolean(closeLabel)
	const showCloseIcon = closeable && !showCloseText && !hasActions
	const toastId = options.id ?? crypto.randomUUID()
	// Left undefined, sonner applies the Toaster's duration and the bar inherits
	// its --toast-duration. A bar that never drains is misleading, so persistent
	// toasts drop it.
	const { duration } = options
	const showProgress =
		progressBar && (duration === undefined || Number.isFinite(duration))

	// Sonner reports every dismissal through onDismiss, including the ones we
	// trigger from an action button. Only user-initiated closes are cancels.
	const dismissal = { isCancel: true }

	function dismissToast() {
		sonnerToast.dismiss(toastId)
	}

	function handleClose() {
		dismissal.isCancel = true
		dismissToast()
	}

	function handleAction(action: ToastAction) {
		action.onClick()
		if (action.dismissOnClick === false) return

		dismissal.isCancel = action.variant === "cancel"
		dismissToast()
	}

	sonnerToast[type](message, {
		...options,
		id: toastId,
		className:
			getToastClassName({
				banner,
				bannerAlign,
				border,
				showProgress,
			}) || undefined,
		classNames:
			showCloseText && !hasActions
				? {
						...classNames,
						actionButton: [classNames?.actionButton, TOAST_CLASS.closeText]
							.filter(Boolean)
							.join(" "),
					}
				: classNames,
		style:
			showProgress && duration !== undefined
				? ({ ...style, "--toast-duration": `${duration}ms` } as CSSProperties)
				: style,
		closeButton: showCloseIcon,
		icon: resolveIcon(icon),
		onDismiss: (dismissedToast) => {
			if (dismissal.isCancel) onCancel?.()
			onDismiss?.(dismissedToast)
		},
		action: hasActions ? (
			<ToastActions
				actions={toastActions}
				closeLabel={showCloseText ? closeLabel : null}
				direction={actionsDirection}
				onAction={handleAction}
				onClose={handleClose}
			/>
		) : showCloseText ? (
			{
				label: closeLabel,
				onClick: handleClose,
			}
		) : undefined,
	})

	return toastId
}

interface BatchToast {
	message: ToastCopy
	/** `false` when the caller reports failures itself, e.g. across two batches. */
	failure?: string | false
	options?: AppToastOptions
}

function showFailure(message: string) {
	return showToast("error", message, {
		description:
			message === TECHNICAL_FAILURE ? TECHNICAL_FAILURE_SUBTITLE : undefined,
	})
}

function showBatch(
	{ succeeded, failed }: BatchResult,
	{ message, failure = TECHNICAL_FAILURE, options }: BatchToast,
) {
	if (succeeded > 0) {
		showToast("success", count(message, succeeded), options)
	}

	if (failed > 0 && failure !== false) {
		showFailure(failure)
	}
}

export const toast = {
	success: (message: ToastMessage, options?: AppToastOptions) =>
		showToast("success", message, options),
	error: (message: ToastMessage, options?: AppToastOptions) =>
		showToast("error", message, options),
	info: (message: ToastMessage, options?: AppToastOptions) =>
		showToast("info", message, options),
	warning: (message: ToastMessage, options?: AppToastOptions) =>
		showToast("warning", message, options),
	/** `error` carrying the shared description when the copy is a technical failure. */
	failure: showFailure,
	/** Success and failure copy for a `runBatch` outcome, pluralized by count. */
	batch: showBatch,
	dismiss: (id?: string | number) => sonnerToast.dismiss(id),
}
