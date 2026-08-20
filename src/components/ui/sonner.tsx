import styled from "@emotion/styled"
import {
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  Loader2Icon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import type { CSSProperties, ReactNode } from "react"
import {
  type ExternalToast,
  toast as sonnerToast,
  Toaster as Sonner,
  type ToasterProps,
} from "sonner"

const TOAST_DURATION_MS = 5000
const CLOSE_TEXT = "סגור"

const TOAST_CLASS = {
  banner: "toast-banner",
  borderless: "toast-borderless",
  closeText: "toast-close-text",
  customActions: "toast-custom-actions",
  noProgress: "toast-no-progress",
} as const

const TOAST_ICONS: ToasterProps["icons"] = {
  success: <CircleCheckIcon className="size-4" />,
  error: <CircleXIcon className="size-4" />,
  info: <InfoIcon className="size-4" />,
  warning: <TriangleAlertIcon className="size-4" />,
  loading: <Loader2Icon className="size-4 animate-spin" />,
}

const TOASTER_STYLE = {
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
  "--border-radius": "var(--radius)",
} as CSSProperties

type ToastMessage = ReactNode | (() => ReactNode)
type ToastType = "success" | "error" | "info" | "warning"

export type ToastActionVariant = "primary" | "cancel" | "danger"

export interface ToastAction {
  label: ReactNode
  onClick(): void
  variant: ToastActionVariant
}

/**
 * Options supported by the application toast wrapper.
 *
 * Sonner options such as `description`, `closeButton`, and `duration` remain
 * available. The options below add application-specific presentation:
 *
 * - `actions`: one or more primary, cancel, or danger actions.
 * - `banner`: places the toast at the top center and removes its card radius/shadow.
 * - `border`: shows the status border. Defaults to `true`.
 * - `closeText`: displays the fixed `סגור` dismiss action.
 * - `icon`: `true` uses the status icon, `false` hides it, or pass a custom node.
 * - `progressBar`: shows the countdown bar. Defaults to `true`.
 */
export type AppToastOptions = Omit<
  ExternalToast,
  "action" | "className" | "icon"
> & {
  actions?: ToastAction | ToastAction[]
  banner?: boolean
  border?: boolean
  closeText?: boolean
  icon?: boolean | ReactNode
  progressBar?: boolean
}

function getToastClassName({
  banner,
  border,
  progressBar,
}: Pick<AppToastOptions, "banner" | "border" | "progressBar">) {
  return [
    banner && TOAST_CLASS.banner,
    !border && TOAST_CLASS.borderless,
    !progressBar && TOAST_CLASS.noProgress,
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

interface ToastActionsProps {
  actions: ToastAction[]
  closeText: boolean
  toastId: string | number
}

function ToastActions({ actions, closeText, toastId }: ToastActionsProps) {
  function dismissToast() {
    sonnerToast.dismiss(toastId)
  }

  return (
    <div className={TOAST_CLASS.customActions}>
      {actions.map(({ label, onClick, variant }, index) => (
        <button
          className={`toast-action toast-action-${variant}`}
          type="button"
          key={`${variant}-${index}`}
          onClick={() => {
            onClick()
            dismissToast()
          }}
        >
          {label}
        </button>
      ))}

      {closeText && (
        <button
          className={TOAST_CLASS.closeText}
          type="button"
          onClick={dismissToast}
        >
          {CLOSE_TEXT}
        </button>
      )}
    </div>
  )
}

function showToast(
  type: ToastType,
  message: ToastMessage,
  {
    actions,
    banner = false,
    border = true,
    closeText = false,
    icon = true,
    progressBar = true,
    classNames,
    ...options
  }: AppToastOptions = {},
) {
  const className = getToastClassName({ banner, border, progressBar })
  const toastActions = normalizeActions(actions)
  const hasActions = toastActions.length > 0
  const toastId = options.id ?? crypto.randomUUID()

  sonnerToast[type](message, {
    ...options,
    id: toastId,
    position: banner ? (options.position ?? "top-center") : options.position,
    className: className || undefined,
    classNames: closeText && !hasActions
      ? {
          ...classNames,
          actionButton: [classNames?.actionButton, TOAST_CLASS.closeText]
            .filter(Boolean)
            .join(" "),
        }
      : classNames,
    icon: resolveIcon(icon),
    action: hasActions ? (
      <ToastActions
        actions={toastActions}
        closeText={closeText}
        toastId={toastId}
      />
    ) : closeText ? (
      {
        label: CLOSE_TEXT,
        onClick: () => sonnerToast.dismiss(toastId),
      }
    ) : undefined,
  })

  return toastId
}

const toast = {
  success: (message: ToastMessage, options?: AppToastOptions) =>
    showToast("success", message, options),
  error: (message: ToastMessage, options?: AppToastOptions) =>
    showToast("error", message, options),
  info: (message: ToastMessage, options?: AppToastOptions) =>
    showToast("info", message, options),
  warning: (message: ToastMessage, options?: AppToastOptions) =>
    showToast("warning", message, options),
}

export type ToastLocation = "right" | "left" | "middle"

interface AppToasterProps extends Omit<ToasterProps, "position"> {
  location?: ToastLocation
}

const TOAST_POSITIONS: Record<ToastLocation, ToasterProps["position"]> = {
  right: "bottom-right",
  left: "bottom-left",
  middle: "bottom-center",
}

const Toaster = ({ location = "right", ...props }: AppToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <StyledSonner
      theme={theme as ToasterProps["theme"]}
      dir="rtl"
      duration={TOAST_DURATION_MS}
      position={TOAST_POSITIONS[location]}
      icons={TOAST_ICONS}
      style={TOASTER_STYLE}
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

const StyledSonner = styled(Sonner)`
  --width: 506px;
  font-family: var(--font-sans);

  /* Toast layout */
  [data-sonner-toast][data-styled="true"] {
    width: max-content;
    min-width: 244px;
    max-width: 640px;
    min-height: 56px;
    padding: 12px 18px;
    gap: 12px;
    border-radius: 10px;
    color: var(--text-color-2);
    font-size: var(--fs-base);
    box-shadow: var(--card-shadow);
    overflow: hidden;
  }

  &[data-x-position="right"] [data-sonner-toast] {
    right: 0;
  }

  &[data-x-position="left"] [data-sonner-toast] {
    left: 0;
  }

  &[data-x-position="center"] [data-sonner-toast] {
    left: calc((var(--width) - 360px) / 2);
  }

  [data-sonner-toast]:has([data-button]) {
    width: 350px;
  }

  /* Close icon */
  [data-sonner-toast][data-styled="true"]:has([data-close-button]) {
    padding-left: 42px;
  }

  [data-sonner-toast][data-styled="true"] [data-close-button] {
    top: 50%;
    right: auto;
    left: 18px;
    width: 16px;
    height: 16px;
    color: var(--text-color-400);
    background: transparent;
    border: 0;
    border-radius: 0;
    transform: translateY(-50%);

    svg {
      width: 12px;
      height: 12px;
      stroke-width: 1.5;
    }
  }

  [data-sonner-toast][data-styled="true"]:has([data-description]) [data-close-button] {
    top: 12px;
    transform: none;
  }

  [data-sonner-toast][data-styled="true"]:hover [data-close-button]:hover {
    color: var(--text-color-2);
    background: transparent;
    border-color: transparent;
  }

  /* Optional presentation modifiers */
  [data-sonner-toast].toast-banner {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    max-width: none;
    border-radius: 0;
    box-shadow: none;
  }

  [data-sonner-toast].toast-borderless {
    border: none;
  }

  [data-sonner-toast].toast-no-progress::after {
    display: none;
  }

  &:has([data-sonner-toast].toast-banner) {
    position: relative;
    top: 0;
    right: 0;
    bottom: auto;
    left: 0;
    width: 100%;
    flex-shrink: 0;
    transform: none;
  }

  /* Status colors */
  [data-sonner-toast][data-type="success"] {
    --toast-background: var(--alert-success-bg);
    --toast-border: var(--alert-success-border);
    --toast-accent: var(--alert-success-global-success);
  }

  [data-sonner-toast][data-type="error"] {
    --toast-background: var(--alert-error-bg);
    --toast-border: var(--alert-error-border);
    --toast-accent: var(--alert-error-global-error);
  }

  [data-sonner-toast][data-type="info"] {
    --toast-background: var(--alert-info-bg);
    --toast-border: var(--alert-info-border);
    --toast-accent: var(--alert-info-global-info);
  }

  [data-sonner-toast][data-type="warning"] {
    --toast-background: var(--alert-warning-bg);
    --toast-border: var(--alert-warning-border);
    --toast-accent: var(--alert-warning-global-warning);
  }

  [data-sonner-toast]:is(
    [data-type="success"],
    [data-type="error"],
    [data-type="info"],
    [data-type="warning"]
  ) {
    background: var(--toast-background);
    border-color: var(--toast-border);
  }

  [data-sonner-toast]:is(
    [data-type="success"],
    [data-type="error"],
    [data-type="info"],
    [data-type="warning"]
  ) [data-icon] svg {
    width: 20px;
    height: 20px;
    color: var(--Text-color-text);
    fill: var(--toast-accent);
  }

  [data-sonner-toast] [data-title] {
    font-weight: 400;
    line-height: 24px;
  }

  /* Close text and custom actions */
  [data-sonner-toast] [data-button] {
    height: auto;
    padding: 0;
    background: transparent;
    color: var(--Components-Upload-Global-colorPrimary);
    font-size: var(--fs-btn);
    font-weight: 400;

    &:hover {
      color: var(--button-color-hover);
      background: transparent;
    }

    &:active {
      color: var(--active-color-button);
      background: transparent;
    }
  }

  [data-sonner-toast] [data-button].toast-close-text {
    color: var(--text-color-400);

    &:hover,
    &:active {
      color: var(--text-color-2);
    }
  }

  [data-sonner-toast] .toast-custom-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    flex-shrink: 0;
  }

  [data-sonner-toast] .toast-action {
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
  }

  [data-sonner-toast] .toast-action-primary {
    color: white;
    background: var(--Components-Upload-Global-colorPrimary);
  }

  [data-sonner-toast] .toast-action-cancel {
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
  }

  [data-sonner-toast] .toast-action-danger {
    color: var(--alert-error-global-error);
    background: var(--background);
    border-color: var(--alert-error-global-error);
  }

  [data-sonner-toast] .toast-custom-actions > .toast-close-text {
    padding: 0;
    color: var(--text-color-400);
    background: transparent;
    border: 0;
    cursor: pointer;

    &:hover,
    &:active {
      color: var(--text-color-2);
    }
  }

  [data-sonner-toast]:has([data-description]) [data-button].toast-close-text {
    align-self: flex-start;
    margin-top: 2px;
  }

  [data-sonner-toast]:has([data-description]) .toast-custom-actions {
    align-self: flex-start;
  }

  /* Countdown progress */
  [data-sonner-toast]:is(
    [data-type="success"],
    [data-type="error"],
    [data-type="info"],
    [data-type="warning"]
  )::after {
    content: "";
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: 5px;
    background: var(--toast-accent);
    transform-origin: right;
    animation: toast-countdown ${TOAST_DURATION_MS}ms linear forwards;
  }

  [data-sonner-toast]:hover::after {
    animation-play-state: paused;
  }

  @keyframes toast-countdown {
    from { transform: scaleX(1); }
    to { transform: scaleX(0); }
  }

  @media (max-width: 600px) {
    --width: calc(100vw - 32px);

    [data-sonner-toast][data-styled="true"],
    [data-sonner-toast]:has([data-button]) {
      width: var(--width);
    }

    &[data-x-position="center"] [data-sonner-toast] {
      left: 0;
    }
  }
`

export { toast, Toaster }
