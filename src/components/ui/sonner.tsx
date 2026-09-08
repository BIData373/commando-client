import styled from "@emotion/styled";
import {
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  Loader2Icon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { TOAST_DURATION_MS } from "../Toast/toast-constants";
import { toast } from "../Toast/toast-api";
import {
  toastActions,
  toastBanner,
  toastCloseButton,
  toastContent,
  toastLayout,
  toastProgress,
  toastResponsive,
  toastStatus,
} from "../Toast/toaster-styles";
import type { CSSProperties } from "react";
import type { ToasterProps } from "sonner";

const TOAST_ICONS: ToasterProps["icons"] = {
  success: <CircleCheckIcon size={16} />,
  error: <CircleXIcon size={16} />,
  info: <InfoIcon size={16} />,
  warning: <TriangleAlertIcon size={16} />,
  loading: <Loader2Icon size={16} className="animate-spin" />,
  close: <XIcon size={16} />,
};

const TOASTER_STYLE = {
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
  "--border-radius": "var(--radius)",
} as CSSProperties;

type AppToasterProps = Omit<ToasterProps, "position">;

const Toaster = (props: AppToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <StyledSonner
      theme={theme as ToasterProps["theme"]}
      dir="rtl"
      duration={TOAST_DURATION_MS}
      position="top-center"
      icons={TOAST_ICONS}
      style={TOASTER_STYLE}
      {...props}
    />
  );
};

const StyledSonner = styled(Sonner)`
  --width: 506px;
  font-family: var(--font-sans);

  ${toastLayout}
  ${toastContent}
  ${toastStatus}
  ${toastCloseButton}
  ${toastActions}
  ${toastBanner}
  ${toastProgress}
  ${toastResponsive}
`;

export { toast, Toaster };
