# Toast

Wrapper around [sonner](https://sonner.emilkowal.ski/). Sonner owns positioning,
stacking, swipe-to-dismiss, timers, and height measurement. We own the card's
content and styling.

Design source: [🧩 Vector — טוסטים](https://www.figma.com/design/mny5BO79QxDcen9OSZILcQ/%F0%9F%A7%A9-Vector?node-id=7802-2634&m=dev)
(an Ant Design `Alert`).

## Files

| File                                 | Purpose                                                      |
| ------------------------------------ | ------------------------------------------------------------ |
| `../ui/sonner.tsx`                   | `Toaster` shell — theme, position, icons, styled composition |
| `toast-api.tsx`                      | `showToast` + the exported `toast` object                    |
| `toast-types.ts`                     | `AppToastOptions`, `ToastAction`                             |
| `ToastActions.tsx`                   | The actions slot: custom buttons and/or close text           |
| `toaster-styles.ts`                  | Named `css` blocks composed into `StyledSonner`              |
| `../../functions/toast-constants.ts` | Duration, close text, class names, positions                 |

## Usage

```tsx
import { toast } from "src/components/ui/sonner";

toast.success("הסטטוס עודכן בהצלחה", {
  subtitle: "השינוי נשמר ויופיע בכל האזורים הרלוונטיים",
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
| `subtitle`         | —          | Secondary line. Maps to sonner's `description`                   |
| `closeable`        | `true`     | Whether _any_ close affordance renders                           |
| `closeText`        | —          | `true` → `סגור`, or a node. **Replaces** the × icon              |
| `actions`          | —          | One action or an array. `variant`: `primary \| cancel \| danger` |
| `actionsDirection` | `"column"` | Use `"row"` for banners                                          |
| `onCancel`         | —          | Fires on user-initiated dismissal, not auto-close                |
| `banner`           | `false`    | Full-width, pinned top, no radius/shadow                         |
| `bannerAlign`      | `"center"` | `"right"` starts the content at the inline edge                  |
| `border`           | `true`     |                                                                  |
| `icon`             | `true`     | `false` hides it, or pass a custom node                          |
| `progressBar`      | `true`     |                                                                  |

Sonner's own options (`duration`, `id`, `position`, `onAutoClose`, …) pass through.

`<Toaster />` takes a `location` of `middle` (default), `right`, or `left`, which
maps to `top-center` / `top-right` / `top-left` in `TOAST_POSITIONS`. Toasts sit
at the top; `banner` forces `top-center` regardless.

## Things that will bite you

**The close icon, close text, and custom actions share one slot.** In Figma
they're all children of a single `Actions` frame in the card head — that's why
`closeText` replaces the × rather than sitting beside it, and why `ToastActions`
renders the close text as its last child instead of it being a separate element.

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
its duration comes from the toast's real `duration` via the `--toast-duration`
CSS var — never hardcode it, or a custom `duration` desyncs from the timer.
`duration: Infinity` drops the bar entirely. `--toast-bleed` controls the -1px
overhang that covers the border; banners set it to `0`.

**CSS animations ignore tab blur, sonner's timers don't.** A backgrounded tab
will desync the bar. Not handled — would need a `visibilitychange` listener
setting a data attribute on the `Toaster`.

**Two density variants**, keyed off `:has([data-description])`: with a subtitle
it's `20px 24px` padding with a 24px icon and a 16px title; without, it's
`8px 12px` with a 16px icon and a 14px title.
