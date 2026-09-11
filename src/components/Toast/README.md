# Toast

Wrapper around [sonner](https://sonner.emilkowal.ski/). Sonner owns positioning,
stacking, swipe-to-dismiss, timers, and height measurement. We own the card's
content and styling.

Design source: [🧩 Vector — טוסטים](https://www.figma.com/design/mny5BO79QxDcen9OSZILcQ/%F0%9F%A7%A9-Vector?node-id=7802-2634&m=dev)
(an Ant Design `Alert`).

## Files

| File                                      | Purpose                                                      |
| ----------------------------------------- | ------------------------------------------------------------ |
| `../ui/sonner.tsx`                        | `Toaster` shell — theme, position, icons, and all the CSS    |
| `toast-api.tsx`                           | `showToast`, the `toast` object, `AppToastOptions`, consts   |
| `ToastActions.tsx`                        | The actions slot, its styled buttons, and `ToastAction`      |
| `../../functions/toast-messages.ts`       | Hebrew strings, `ToastCopy`, and `count` pluralization       |
| `../../functions/mutation-toast-cache.ts` | `meta.toast` wiring for every TanStack mutation              |
| `../../utils/batch-utils.ts`              | `runBatch` — counts settled promises, no toast of its own    |

## Usage

```tsx
import { toast } from "src/components/ui/sonner";

toast.success("הסטטוס עודכן בהצלחה", {
  description: "השינוי נשמר ויופיע בכל האזורים הרלוונטיים",
  onCancel: () => revertStatus(),
  actions: [
    { label: "בטל", onClick: revertStatus, variant: "cancel" },
    {
      label: "נסה שוב",
      onClick: retry,
      variant: "primary",
      dismissOnClick: false,
    },
  ],
});
```

| Option             | Default    | Notes                                                            |
| ------------------ | ---------- | ---------------------------------------------------------------- |
| `closeable`        | `true`     | Whether _any_ close affordance renders                           |
| `closeText`        | —          | `true` → `סגור`, or a node. **Replaces** the × icon              |
| `actions`          | —          | One action or an array. `variant`: `primary \| cancel \| danger`. Suppresses the × |
| `actionsDirection` | `"column"` | Use `"row"` for banners                                          |
| `onCancel`         | —          | Fires on user-initiated dismissal, not auto-close                |
| `banner`           | `false`    | Full-width, pinned top, no radius/shadow                         |
| `bannerAlign`      | `"center"` | `"right"` starts the content at the inline edge                  |
| `border`           | `true`     |                                                                  |
| `icon`             | `true`     | `false` hides it, or pass a custom node                          |
| `progressBar`      | `true`     |                                                                  |
| `duration`         | `3000`     | ms before auto-dismiss. `Infinity` keeps it open                 |

Sonner's own options (`description`, `id`, `position`, `onAutoClose`, …) pass
through. The secondary line is sonner's `description` — we add no alias for it.

`duration` defaults to `DEFAULT_TOAST_DURATION_MS` (3000), exported from `toast-api.tsx`
and applied by `<Toaster />`. `showToast` deliberately does **not** re-apply that
default — it leaves `duration` undefined so sonner falls back to the toaster's
value, which keeps the timer and the countdown bar reading the same number.
Pass `duration` in the options to override it per toast; `Infinity` keeps the
toast up until it is dismissed and drops the progress bar.

Every toast is `top-center`. Position is not configurable — not on `<Toaster />`
and not per toast, where `position` is omitted from `AppToastOptions`. If that
ever changes, sonner still supports the other eight positions natively.

## Things that will bite you

**The close icon, close text, and custom actions share one slot.** In Figma
they're all children of a single `Actions` frame in the card head — that's why
`closeText` and `actions` each replace the × rather than sitting beside it, and
why `ToastActions` renders the close text as its last child instead of it being a
separate element. A toast with actions has no ×; to give it an explicit dismiss,
pass `closeText` (rendered inside the actions group) or a `cancel`-variant
action.

**`onDismiss` fires for programmatic dismissals too.** Including the ones our own
action buttons trigger. `showToast` keeps a `dismissal.isCancel` flag so clicking
a `primary` action doesn't fire `onCancel`; only the close affordances, a swipe,
and `cancel`-variant actions do.

**Sonner pauses every timer when the toaster is hovered**, not just the hovered
toast. The progress bar's pause rule is therefore scoped to the toaster
(`&:hover [data-sonner-toast]::after`). Scoping it to the toast itself makes
stacked toasts drain and disappear early.

**The progress bar is a track + fill**, rendered as `::before` (track, border
color) and `::after` (fill, accent). It drains from the inline-start edge, and
its duration comes from the `--toast-duration` CSS var — never hardcode it, or a
custom `duration` desyncs from the timer. The var is set once on the toaster from
the same value passed to sonner's `duration` prop, and inherits down; only a toast
with its own `duration` overrides it inline.
`duration: Infinity` drops the bar entirely. `--toast-bleed` controls the -1px
overhang that covers the border; banners set it to `0`.

**CSS animations ignore tab blur, sonner's timers don't.** A backgrounded tab
will desync the bar. Not handled — would need a `visibilitychange` listener
setting a data attribute on the `Toaster`.

**The CSS is split by who renders the DOM.** Sonner renders the card, the ×
button, and its own `[data-button]`, so those are styled from `StyledSonner` at
the bottom of `../ui/sonner.tsx` through `data-*` attributes and the `TOAST_CLASS`
flags — there is nothing of ours to attach a styled component to. `ToastActions`
renders its own markup, so it uses plain styled components with `$direction` and
`$variant` transient props like everywhere else in the app.

**Two density variants**, keyed off `:has([data-description])`: with a description
it's `20px 24px` padding with a 24px icon and a 16px title; without, it's
`8px 12px` with a 16px icon and a 14px title.
