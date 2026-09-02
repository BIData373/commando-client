import type { CSSProperties } from "react"
import { toast as sonnerToast } from "sonner"
import {
	CLOSE_TEXT,
	TOAST_CLASS,
	TOAST_DURATION_MS,
} from "../../functions/toast-constants"
import { ToastActions } from "./ToastActions"
import type {
	AppToastOptions,
	ToastAction,
	ToastMessage,
	ToastType,
} from "./toast-types"

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
	type: ToastType,
	message: ToastMessage,
	{
		actions,
		actionsDirection = "column",
		banner = false,
		bannerAlign = "center",
		border = true,
		closeable = true,
		closeText,
		description,
		icon = true,
		onCancel,
		onDismiss,
		progressBar = true,
		style,
		subtitle,
		classNames,
		...options
	}: AppToastOptions = {},
) {
	const toastActions = normalizeActions(actions)
	// The close icon, the close text, and custom actions share one slot in the
	// design, so text replaces the icon rather than sitting beside it.
	const closeLabel = closeText === true ? CLOSE_TEXT : closeText
	const showCloseText = closeable && Boolean(closeLabel)
	const showCloseIcon = closeable && !showCloseText
	const hasActions = toastActions.length > 0
	const toastId = options.id ?? crypto.randomUUID()
	const duration = options.duration ?? TOAST_DURATION_MS
	// A bar that never drains is misleading, so persistent toasts drop it.
	const showProgress = progressBar && Number.isFinite(duration)

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
		duration,
		description: subtitle ?? description,
		position: banner ? (options.position ?? "top-center") : options.position,
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
		style: showProgress
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

export const toast = {
	success: (message: ToastMessage, options?: AppToastOptions) =>
		showToast("success", message, options),
	error: (message: ToastMessage, options?: AppToastOptions) =>
		showToast("error", message, options),
	info: (message: ToastMessage, options?: AppToastOptions) =>
		showToast("info", message, options),
	warning: (message: ToastMessage, options?: AppToastOptions) =>
		showToast("warning", message, options),
	dismiss: (id?: string | number) => sonnerToast.dismiss(id),
}
