# Role
Senior Frontend Engineer, building a task management system

---

# Stack
- **Frontend:** React, TypeScript, Shadcn, TanStack Router
- **Styling:** `@emotion/styled`
- **Types:** External `Shared` library only. No local entity/DTO interfaces. All fields `camelCase`.

---

# Folder Structure (`src/`)
```
components/
  ui/            ← ShadCN components, All of their components are available for usage
  [Feature]/     ← Feature folders; co-locate child components used only here
lib/              ← Pure helpers grouped by subject (dateUtils, filterUtils, etc.)
hooks/           ← Custom React hooks
providers/       ← Contexts (avoid prop drilling)
store/           ← Global state (Zustand)
routes/          ← Route definitions via TanStack Router (folder-based, $param for dynamic segments)
router.tsx       ← TanStack router object
```

---

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

---

# Coding Rules

**Naming:** Files `PascalCase.tsx`, variables/functions `camelCase`.
**One component per file.** Each props/state shape gets its own interface — no inline typing.
**Errors:** Display exclusively via internal `Popup` component.
**Comments:** English only; complex logic only — prefer self-documenting code.
**Repetition:** Extract repeated strings/numbers to consts in `functions/`. Extract repeated JSX to components.
**Imports:** Relative paths only (no `@/`). Order: external → internal → types.
**Lucide Icons:** Use `size={16}` prop, never `className="w-4 h-4"`.
**Handlers:** Define named functions above `return` — never complex inline in JSX.
**Helper location:** Reused across components → `src/functions/`. Component-specific → above `return`.

---

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

### Transient Props
```tsx
const TabButton = styled.button<{ $active: boolean }>`
  color: ${({ $active }) => $active ? 'var(--color-primary)' : 'var(--color-text-disabled)'};
`;
```
Common: `$color $active $open $selected $minWidth $variant $type $isActive $isDragging $isDragOver $completed`

# State Management

**4+ related fields → merged state + `setField`:**
```tsx
const [form, setForm] = useState<FormState>({ title: '', ... });
const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
  setForm((prev) => ({ ...prev, [key]: value }));
```

**No `useMemo`/`useCallback`** unless a concrete profiling bottleneck is documented.

---

# `functions/` File Conventions
- `dateUtils.ts` — `formatDate`, `formatDateShort`, `getDueDateDisplay`, `isNew`, `toInputDate`
- `filterUtils.ts` — `applyAllFilters`, `applyQuickFilter`, `applyColumnFilters`, `applySearch`, `sortInstructions`, `buildFilterOptions`
- `assigneeStatus.ts` — assignee/status helpers
- `exportCsv.ts` — CSV export

---

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

---

## Typography Variables

All font sizes come from the design token scale — never hardcode `px` sizes inline.

| Variable          | Value (desktop) | Usage                        |
| ----------------- | --------------- | ---------------------------- |
| `var(--fs-heading-h1)` | 42px       | Display / hero headings      |
| `var(--fs-heading-1)`  | 38px       | Page-level H1                |
| `var(--fs-heading-2)`  | 30px       | Section headings             |
| `var(--fs-heading-3)`  | 24px       | Sub-section headings         |
| `var(--fs-xl)`         | 20px       | Large body / card titles     |
| `var(--fs-lg)`         | 18px       | Medium emphasis text         |
| `var(--fs-base)`       | 16px       | Default body text            |
| `var(--fs-btn)`        | 14px       | Button labels (all sizes)    |
| `var(--fs-sm)`         | 12px       | Captions, labels, meta text  |

Responsive breakpoints automatically scale heading variables down at ≤1024px and ≤768px — body/button/sm sizes stay fixed.

---

## Known CSS Variables (from existing components)

| Variable                  | Usage                          |
| ------------------------- | ------------------------------ |
| `var(--header-bg)`        | Header background (dark navy)  |
| `var(--line)`             | Border color                   |
| `var(--chip-bg)`          | Pill/chip background           |
| `var(--chip-line)`        | Pill/chip border               |
| `var(--sea-ink)`          | Primary text color             |
| `var(--sea-ink-soft)`     | Secondary/muted text           |
| `var(--link-bg-hover)`    | Nav link hover background      |
| `var(--z-dropdown)`       | Z-index for dropdowns/overlays |
| `var(--purple-start)`     | Gradient start (buttons, tabs) |
| `var(--purple-end)`       | Gradient end (buttons, tabs)   |
| `var(--status-done)`      | Green text – done status       |
| `var(--status-done-bg)`   | Green bg – done status         |
| `var(--status-progress)`  | Orange text – in-progress      |
| `var(--status-progress-bg)` | Orange bg – in-progress      |
| `var(--status-pending)`   | Gray text – pending status     |
| `var(--status-pending-bg)` | Gray bg – pending status      |

All semantic tokens are defined in both `:root` (light mode) and `.dark` in `src/styles.css`.

## Static Assets (`public/`)

| File                 | Description                                    |
| -------------------- | ---------------------------------------------- |
| `workspace-icon.png` | 32px circular workspace logo (PNG 800×796)     |
| `logo.svg`           | App logo used in Header right side             |

## RTL Notes (`dir="rtl"` on `<html>`)

- CSS Grid column order reverses in RTL: column 1 = visual RIGHT, column 3 = visual LEFT.
- Flex items flow right-to-left: first DOM child = rightmost visually.
- Always use logical CSS properties: `inset-inline-start`, `margin-inline-end`, `padding-block`, etc.
- To control item order for RTL: reverse the array (not the DOM structure).

## Modal / Dialog Pattern

**Never use `DialogContent` (the ShadCN wrapper) for full modals.** It has enter/exit CSS animations that get cut off when a route unmounts, causing a visible flash.

**Always use `ModalContent`** (`src/components/shared/ModalContent.tsx`) instead. It wraps `DialogPortal + DialogOverlay + DialogContentPrimitive` with base styles (centered, shadow, border, background) and no animation. Extend it per-consumer:

```tsx
// In your component file:
const Panel = styled(ModalContent)`
  width: 700px;
  max-height: 70vh;
  // only size/padding/direction overrides here
`

// In JSX (always open={true} when route-based):
<Dialog open onOpenChange={handleClose}>
  <Panel>...</Panel>
</Dialog>
```

**Route-based modals** — entity create/edit dialogs live as child routes of the list layout, not as local `useState`. The layout route renders the list + `<Outlet />`. Child routes (`new.tsx`, `$id.tsx`, `$id/index.tsx`) render the dialog. When the user closes, navigate back to the list route. This keeps the URL in sync and avoids unmount-animation issues.

| Wrong | Right |
|-------|-------|
| `styled(DialogContent)` for a modal | `styled(ModalContent)` |
| `const [isOpen, setIsOpen] = useState(false)` + `<SomeDialog open={isOpen}>` | Route-based modal (`new.tsx` / `$id/index.tsx`) |
| `DialogPortal + DialogOverlay + DialogContentPrimitive` inline | `ModalContent` |

## Component Notes

**Header.tsx** — `HeaderContainer` wraps `HeaderRoot` (sticky bar) + optional `TitleBar`. `HeaderInner` is a 3-column CSS Grid (`1fr auto 1fr`). Config via `useMatches()` → `HeaderConfig`: `{ title, navigation, user, workspace }`.
- **Col 1 – `StartSection`** (visual RIGHT in RTL): `LogoImage` + `NavigationMenu`; shown when `navigation` is true. Nav links order: `['בית', 'הנחיות', 'הגדרות לשכה']` — first item is rightmost in RTL. `LogoImage` has `margin-inline-end: 20px` (gap between logo and first nav link).
- **Col 2 – `CenterSection`**: `WorkspaceIcon` then `WorkspaceName`; shown when `workspace` is true. Icon is first = rightmost in RTL.
- **Col 3 – `EndSection`** (visual LEFT in RTL, `justify-content: flex-end`): `UserTrigger` pill (52px tall, Avatar + ChevronDown); shown when `user` is true.
- `TitleBar` renders below bar when `title` is non-empty. `PageTitle` is an `h1`.
- Image paths: `/logo.svg` and `/workspace-icon.png` (no `/public/` prefix).

# Workflow (MANDATORY — follow for every file)

1. **INGEST** — Review the provided file/component.
2. **PLAN** — List required changes to meet standards. Ask if unclear.
3. **EXECUTE** — Output fully refactored, production-ready code only.