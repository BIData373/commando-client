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
      new.tsx                                 /workspace/:urlName/tasks/new  (modal overlay)
      $taskId.tsx                             /workspace/:urlName/tasks/:taskId  (modal overlay)
    settings.tsx                              /workspace/:urlName/settings  (layout → Outlet)
    settings/
      index.tsx                               /workspace/:urlName/settings/  → redirect to general
      general.tsx                             /workspace/:urlName/settings/general
      assignees.tsx                           /workspace/:urlName/settings/assignees
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

## Known CSS Variables (from existing components)

| Variable               | Usage                          |
| ---------------------- | ------------------------------ |
| `var(--header-bg)`     | Header background              |
| `var(--line)`          | Border color                   |
| `var(--chip-bg)`       | Pill/chip background           |
| `var(--chip-line)`     | Pill/chip border               |
| `var(--sea-ink)`       | Primary text color             |
| `var(--sea-ink-soft)`  | Secondary/muted text           |
| `var(--link-bg-hover)` | Nav link hover background      |
| `var(--z-dropdown)`    | Z-index for dropdowns/overlays |

## Static Assets (`public/`)

| File                 | Description                                    |
| -------------------- | ---------------------------------------------- |
| `workspace-icon.png` | 32px circular workspace logo (PNG 800×796)     |
| `logo.svg`           | App logo used in Header right side             |

## Component Notes

**Header.tsx** — 3-column CSS Grid (`1fr auto 1fr`). Left: Avatar+DropdownMenu pill (`UserTrigger` styled.button with `asChild`). Center: workspace name + 32px `WorkspaceIcon` img. Right: `NavLink` (styled TanStack `Link`) items + `LogoImage`. ThemeToggle lives in the user dropdown as a `DropdownMenuItem` with `onSelect={(e) => e.preventDefault()}` to prevent menu close on toggle.

---

# Workflow (MANDATORY — follow for every file)

1. **INGEST** — Review the provided file/component.
2. **PLAN** — List required changes to meet standards. Ask if unclear.
3. **EXECUTE** — Output fully refactored, production-ready code only.