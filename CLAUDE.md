# Role
Senior Frontend Engineer, building a task management system

# Stack
- **Frontend:** React, TypeScript, Shadcn, TanStack Router
- **Styling:** `@emotion/styled`
- **Types:** External `Shared` library only. No local entity/DTO interfaces. All fields `camelCase`.

# Folder Structure (`src/`)
```
components/
  ui/            ← ShadCN components, all available for usage
  [Feature]/     ← Feature folders; co-locate child components used only here
lib/             ← Pure helpers grouped by subject (dateUtils, filterUtils, etc.)
hooks/           ← Custom React hooks
providers/       ← Contexts (avoid prop drilling)
store/           ← Global state (Zustand)
routes/          ← Route definitions via TanStack Router (folder-based, $param for dynamic segments)
router.tsx       ← TanStack router object
```

# Route Tree (`src/routes/`)
```
__root.tsx
index.tsx                                     /
new-workspace.tsx                             /new-workspace  (modal over /)
personal.tsx                                  /personal
workspace/
  $urlName.tsx                                /workspace/:urlName  (layout → Outlet)
  $urlName/
    index.tsx                                 /workspace/:urlName/  → redirect to tasks
    dashboard.tsx                             /workspace/:urlName/dashboard
    tasks.tsx                                 /workspace/:urlName/tasks  (layout: renders list + Outlet for modals)
    tasks/
      index.tsx                               /workspace/:urlName/tasks/  (search: view: TABLE|CARDS)
      new.tsx                                 /workspace/:urlName/tasks/new  (modal overlay; search: view, mode: 'single'|'discussion')
      $taskId.tsx                             /workspace/:urlName/tasks/:taskId  (modal overlay)
    settings.tsx                              /workspace/:urlName/settings  (layout → Outlet)
    settings/
      index.tsx                               /workspace/:urlName/settings/  → redirect to general
      general.tsx                             /workspace/:urlName/settings/general
      assignees.tsx                           /workspace/:urlName/settings/assignees  (layout: renders list + Outlet for modals)
      assignees/
        new.tsx                               /workspace/:urlName/settings/assignees/new  (modal overlay)
        $assigneeId.tsx                       /workspace/:urlName/settings/assignees/:assigneeId  (Outlet passthrough)
        $assigneeId/
          index.tsx                           /workspace/:urlName/settings/assignees/:assigneeId/  (modal overlay)
      permissions.tsx                         /workspace/:urlName/settings/permissions
```

# Coding Rules

**Naming:** Component files `PascalCase.tsx`, route/utility files `kebab-case.ts(x)`, variables/functions `camelCase`.
**One component per file.** Each props/state shape gets its own interface — no inline typing.
**Errors:** Display exclusively via internal `Popup` component.
**Comments:** English only; complex logic only — prefer self-documenting code.
**Repetition:** Extract repeated strings/numbers to consts in `functions/`. Extract repeated JSX to components.
**Imports:** Relative paths only (no `@/`). Order: external → internal → types.
**Lucide Icons:** Use `size={16}` prop, never `className="w-4 h-4"`.
**Handlers:** Define named functions above `return` — never complex inline in JSX.
**Helper location:** Reused across components → `src/functions/`. Component-specific → above `return`.

# Styling: @emotion/styled

- `import styled from '@emotion/styled'` at top of every TSX file.
- `styled.*` declarations go **below** the `return` statement.
- No `className=`, no `cn()`, no `style={}`, no hardcoded hex colors.
- **Transient props** (prefix `$`) for style-only props that must not hit the DOM.
- **RTL:** Use logical properties (`inset-inline-start`, `margin-inline-end`, `text-align: end`).
- **Z-index:** Always `var(--z-dropdown)` — never `40`/`50`.
- **Animations:** Use `keyframes` from `@emotion/react` — no inline `<style>` tags.
- **Group-hover:** Use Emotion interpolation: `&:hover ${Child}`. Child must be defined **before** parent.
- **Extend generics:** `styled(DropdownMenuTrigger)` — never override component internals.

```tsx
const TabButton = styled.button<{ $active: boolean }>`
  color: ${({ $active }) => $active ? 'var(--color-primary)' : 'var(--color-text-disabled)'};
`;
```

# State Management

**4+ related fields → merged state + `setField`.** No `useMemo`/`useCallback` unless a concrete profiling bottleneck is documented.

# Common Mistakes

| Wrong | Right |
|-------|-------|
| `style={{ color: item.color }}` | `$color` transient prop |
| `z-index: 40` | `var(--z-dropdown)` |
| `color: #e5e7eb` | `var(--color-gray-200)` |
| `useCallback`/`useMemo` without bottleneck | Plain function / inline variable |
| Multiple `useState` for related fields | `interface` + `setField` |
| `createPortal` for dropdowns | `DropdownMenu` system |
| Complex inline handler in JSX | Named function above `return` |
| `import { cn }` | Remove; use styled + transient props |
| `left: 0` in RTL | `inset-inline-start: 0` |
| Repeated string/number literal | `const` in `functions/` file |
| `any` type | Explicit interface or generic |
| `className="w-4 h-4"` on icon | `size={16}` |
| `styled(DialogContent)` for a modal | `styled(ModalContent)` |
| `useState` open flag for dialogs | Route-based modal (`new.tsx` / `$id/index.tsx`) |

## Typography Variables

| Variable | Usage |
| -------- | ----- |
| `var(--fs-heading-h1)` | Display / hero headings |
| `var(--fs-heading-1)` | Page-level H1 |
| `var(--fs-heading-2)` | Section headings |
| `var(--fs-heading-3)` | Sub-section headings |
| `var(--fs-xl)` | Large body / card titles |
| `var(--fs-lg)` | Medium emphasis text |
| `var(--fs-base)` | Default body text |
| `var(--fs-btn)` | Button labels |
| `var(--fs-sm)` | Captions, labels, meta text |

## CSS Variables

| Variable | Usage |
| -------- | ----- |
| `var(--header-bg)` | Header background (dark navy) |
| `var(--line)` | Border color |
| `var(--chip-bg)` | Pill/chip background |
| `var(--chip-line)` | Pill/chip border |
| `var(--sea-ink)` | Primary text color |
| `var(--sea-ink-soft)` | Secondary/muted text |
| `var(--link-bg-hover)` | Nav link hover background |
| `var(--z-dropdown)` | Z-index for dropdowns/overlays |
| `var(--purple-start)` | Gradient start (buttons, tabs) |
| `var(--purple-end)` | Gradient end (buttons, tabs) |
| `var(--status-done)` | Green text – done status |
| `var(--status-done-bg)` | Green bg – done status |
| `var(--status-progress)` | Orange text – in-progress |
| `var(--status-progress-bg)` | Orange bg – in-progress |
| `var(--status-pending)` | Gray text – pending status |
| `var(--status-pending-bg)` | Gray bg – pending status |

All tokens defined in `:root` (light) and `.dark` in `src/styles.css`.

## RTL Notes (`dir="rtl"` on `<html>`)

- CSS Grid column order reverses: column 1 = visual RIGHT, column 3 = visual LEFT.
- Flex items flow right-to-left: first DOM child = rightmost visually.
- Always use logical CSS properties: `inset-inline-start`, `margin-inline-end`, `padding-block`, etc.
- To control item order for RTL: reverse the array (not the DOM structure).

## Modal / Dialog Pattern

**Never use `DialogContent`** — it has enter/exit animations that flash on route unmount.

**Always use `ModalContent`** (`src/components/shared/ModalContent.tsx`) — wraps `DialogPortal + DialogOverlay + DialogContentPrimitive` with no animation. Extend per-consumer:

```tsx
const Panel = styled(ModalContent)`
  width: 700px;
  max-height: 70vh;
`

<Dialog open onOpenChange={handleClose}>
  <Panel>...</Panel>
</Dialog>
```

**Route-based modals** — create/edit dialogs live as child routes of the list layout. Layout renders list + `<Outlet />`. Child routes (`new.tsx`, `$id/index.tsx`) render the dialog. On close, navigate back to the list route.

# Workflow (MANDATORY — follow for every file)

1. **INGEST** — Review the provided file/component.
2. **PLAN** — List required changes to meet standards. Ask if unclear.
3. **EXECUTE** — Output fully refactored, production-ready code only.
