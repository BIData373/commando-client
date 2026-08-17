import styled from "@emotion/styled"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const TOAST_DURATION_MS = 5000

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
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
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

  [data-sonner-toast][data-styled="true"] {
    width: 250px;
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

  [data-sonner-toast][data-type="success"] {
    background: var(--alert-success-bg);
    border-color: var(--alert-success-border);
  }

  [data-sonner-toast][data-type="error"] {
    background: var(--alert-error-bg);
    border-color: var(--alert-error-border);
  }

  [data-sonner-toast][data-type="success"] [data-icon] svg {
    width: 20px;
    height: 20px;
    color: var(--Text-color-text);
    fill: var(--alert-success-global-success);
  }

  [data-sonner-toast][data-type="error"] [data-icon] svg {
    width: 20px;
    height: 20px;
    color: var(--Text-color-text);
    fill: var(--alert-error-global-error);
  }

  [data-sonner-toast] [data-title] {
    font-weight: 400;
    line-height: 24px;
  }

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

  [data-sonner-toast][data-type="success"]::after,
  [data-sonner-toast][data-type="error"]::after {
    content: "";
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: 5px;
    transform-origin: right;
    animation: toast-countdown ${TOAST_DURATION_MS}ms linear forwards;
  }

  [data-sonner-toast][data-type="success"]::after {
    background: var(--alert-success-global-success);
  }

  [data-sonner-toast][data-type="error"]::after {
    background: var(--alert-error-global-error);
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

export { Toaster }
