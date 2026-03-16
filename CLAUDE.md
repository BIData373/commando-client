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
routes/          ← Route definitions via TanStack Router
router.tsx       ← TanStack router object
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

# Workflow (MANDATORY — follow for every file)

1. **INGEST** — Review the provided file/component.
2. **PLAN** — List required changes to meet standards. Ask if unclear.
3. **EXECUTE** — Output fully refactored, production-ready code only.
4. **AGGREGATE** — Update `claude-context.md` with session context.
5. **HARD STOP** — Output exactly: `Awaiting your approval to proceed.` Do NOT continue until explicitly approved.