import { css } from "@emotion/react"
import { TOAST_CLASS, TOAST_DURATION_MS } from "../../functions/toast-constants"

/** Card box, widths, and per-position offsets. */
export const toastLayout = css`
  [data-sonner-toast][data-styled="true"] {
    width: max-content;
    min-width: 244px;
    max-width: 640px;
    min-height: 56px;
    padding: 8px 12px;
    gap: 8px;
    align-items: center;
    border-radius: 8px;
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

  [data-sonner-toast][data-styled="true"]:has([data-description]) {
    padding: 20px 24px;
    gap: 12px;
    align-items: flex-start;
  }

  [data-sonner-toast]:has([data-button]) {
    width: 350px;
  }
`

/** Title and subtitle typography. */
export const toastContent = css`
  [data-sonner-toast]:has([data-description]) [data-icon] svg {
    width: 24px;
    height: 24px;
  }

  [data-sonner-toast] [data-title] {
    font-weight: 400;
    line-height: 22px;
  }

  [data-sonner-toast]:has([data-description]) [data-title] {
    font-size: var(--fs-lg);
    line-height: 24px;
  }

  [data-sonner-toast] [data-description] {
    color: var(--text-color-400);
    font-size: var(--fs-sm);
    line-height: 20px;
  }
`

/** Status accents driven by the sonner data-type attribute. */
export const toastStatus = css`
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
    )
    [data-icon]
    svg {
    width: 16px;
    height: 16px;
    color: var(--Text-color-text);
    fill: var(--toast-accent);
  }
`

/** Dismiss icon in the inline-end corner. */
export const toastCloseButton = css`
  [data-sonner-toast][data-styled="true"]:has([data-close-button]) {
    padding-inline-end: 42px;
  }

  [data-sonner-toast][data-styled="true"] [data-close-button] {
    top: 50%;
    inset-inline-start: auto;
    inset-inline-end: 18px;
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

  [data-sonner-toast][data-styled="true"]:has([data-description])
    [data-close-button] {
    top: 12px;
    transform: none;
  }

  [data-sonner-toast][data-styled="true"]:hover [data-close-button]:hover {
    color: var(--text-color-2);
    background: transparent;
    border-color: transparent;
  }
`

/** Action buttons and the close-text link. */
export const toastActions = css`
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

  [data-sonner-toast] [data-button].${TOAST_CLASS.closeText} {
    color: var(--text-color-400);

    &:hover,
    &:active {
      color: var(--text-color-2);
    }
  }

  [data-sonner-toast] .${TOAST_CLASS.customActions} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    flex-shrink: 0;
  }

  [data-sonner-toast] .${TOAST_CLASS.customActions}.${TOAST_CLASS.actionsRow} {
    flex-direction: row;
    align-items: center;
    gap: 10px;
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
    color: var(--background);
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

  [data-sonner-toast]
    .${TOAST_CLASS.customActions}
    > .${TOAST_CLASS.closeText} {
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

  [data-sonner-toast]:has([data-description])
    [data-button].${TOAST_CLASS.closeText} {
    align-self: flex-start;
    margin-top: 2px;
  }

  [data-sonner-toast]:has([data-description]) .${TOAST_CLASS.customActions} {
    align-self: flex-start;
  }
`

/** Full-width banner variant pinned to the top of the layout. */
export const toastBanner = css`
  [data-sonner-toast].${TOAST_CLASS.banner} {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    max-width: none;
    justify-content: center;
    border-radius: 0;
    box-shadow: none;
  }

  [data-sonner-toast].${TOAST_CLASS.banner} [data-content] {
    flex: 0 1 auto;
    text-align: center;
  }

  [data-sonner-toast].${TOAST_CLASS.bannerRight} {
    justify-content: flex-start;
  }

  [data-sonner-toast].${TOAST_CLASS.bannerRight} [data-content] {
    text-align: start;
  }

  [data-sonner-toast].${TOAST_CLASS.borderless} {
    border: none;
  }

  [data-sonner-toast].${TOAST_CLASS.borderless}::before,
    [data-sonner-toast].${TOAST_CLASS.borderless}::after {
    inset-inline-start: 0;
  }

  &:has([data-sonner-toast].${TOAST_CLASS.banner}) {
    position: relative;
    top: 0;
    right: 0;
    bottom: auto;
    left: 0;
    width: 100%;
    flex-shrink: 0;
    transform: none;
  }
`

/**
 * Countdown bar. The duration comes from the toast's own --toast-duration so it
 * tracks the real timer, and the pause is scoped to the toaster because sonner
 * pauses every timer while any toast is hovered.
 */
export const toastProgress = css`
  /* Track: sits behind the fill and bleeds over the 1px border, as in the design. */
  [data-sonner-toast][data-styled="true"]::before,
  [data-sonner-toast][data-styled="true"]::after {
    content: "";
    position: absolute;
    bottom: 0;
    inset-inline: var(--toast-bleed, -1px);
    height: 4px;
  }

  [data-sonner-toast][data-styled="true"]::before {
    background: var(--toast-border, var(--line));
  }

  /* Fill drains from the inline-start edge, staying anchored at inline-end. */
  [data-sonner-toast][data-styled="true"]::after {
    background: var(--toast-accent, var(--sea-ink-soft));
    animation: toast-countdown var(--toast-duration, ${TOAST_DURATION_MS}ms)
      linear forwards;
  }

  [data-sonner-toast].${TOAST_CLASS.noProgress}::before,
    [data-sonner-toast].${TOAST_CLASS.noProgress}::after {
    display: none;
  }

  /* Sonner pauses every timer while the toaster is hovered, not just the one. */
  &:hover [data-sonner-toast]::after {
    animation-play-state: paused;
  }

  @keyframes toast-countdown {
    from {
      inset-inline-start: var(--toast-bleed, -1px);
    }
    to {
      inset-inline-start: 100%;
    }
  }
`

export const toastResponsive = css`
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
