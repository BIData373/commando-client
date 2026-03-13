# Role
Senior Fullstack Architect. Lead a full-project refactor enforcing strict standards and a controlled iterative workflow.

---

# Stack
- **Frontend:** React, TypeScript
- **Styling:** `@emotion/styled` (NOT SCSS/Tailwind — legacy CLAUDE.md referenced SCSS; actual codebase uses Emotion)
- **Types:** External `Shared` library only. No local entity/DTO interfaces. All fields `camelCase`.

---

# Folder Structure (`src/`)
```
api/
  endpoints/     ← API call functions
  mappers/       ← DTO → domain mappers
  queryClient.ts ← QueryOptions, MutationOptions, queryClient instance
components/
  generic/       ← Buttons, Inputs, DropdownMenu, Tooltip, etc.
  [Feature]/     ← Feature folders; co-locate child components used only here
functions/       ← Pure helpers grouped by subject (dateUtils, filterUtils, etc.)
hooks/           ← Custom React hooks
pages/           ← Full-page components
providers/       ← Contexts (avoid prop drilling)
store/           ← Global state (Zustand)
mocks/           ← MSW handlers + mock data
routes/          ← Route definitions
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

### Color Variables (from `index.css`)
| Hex | CSS Variable |
|-----|-------------|
| `#ffffff` | `var(--color-paper)` |
| `#f9fafb` | `var(--color-gray-50)` |
| `#f3f4f6` | `var(--color-gray-100)` |
| `#e5e7eb` | `var(--color-gray-200)` |
| `#94a3b8` | `var(--color-text-disabled)` |
| `#6b7280` | `var(--color-text-secondary)` |
| `#111827` | `var(--color-text-primary)` |
| `#059669` | `var(--color-success)` |
| `#d97706` | `var(--color-warning)` |
| `#dc2626` | `var(--color-error)` |
| `#3b82f6` | `var(--color-info)` |
| `#0b0f2f` | *(navbar only — leave as-is)* |

Tints: `color-mix(in srgb, var(--color-primary) 8%, transparent)`

---

# DropdownMenu System
Always use internal system — never `createPortal` or `useRef`-based menus.
```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../generic/DropdownMenu';

<DropdownMenu>
  <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}><MoreVertical size={16} /></DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); doSomething(); }}>
      <Edit size={16} /> Label
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```
- Each row/card gets its **own** `DropdownMenu` — no shared open state.
- Use `styled(DropdownMenuTrigger)` / `styled(DropdownMenuItem)` for variants.

---

# State Management

**4+ related fields → merged state + `setField`:**
```tsx
const [form, setForm] = useState<FormState>({ title: '', ... });
const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
  setForm((prev) => ({ ...prev, [key]: value }));
```

**No `useMemo`/`useCallback`** unless a concrete profiling bottleneck is documented.

---

# Table Patterns

**Column renderers:**
```tsx
const COLUMN_RENDERERS: Record<ColumnKey, (row: Instruction) => React.ReactNode> = {
  title: (row) => <TitleCell>{row.title}</TitleCell>,
  status: (row) => <StatusChip status={row.status} />,
};
```
**Sort getters:**
```tsx
const SORT_GETTERS: Record<SortKey, (i: Instruction) => string | number> = {
  title: (i) => i.title.toLowerCase(),
  dueDate: (i) => i.dueDate?.getTime() ?? Infinity,
};
```
**Min-width on `<th>`:** Use `$minWidth` transient prop — never `style={{ minWidth }}`.

---

# API / Query Hooks (`src/api/queryClient.ts`)
```tsx
export type QueryOptions<TData> = Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>;
export type MutationOptions<TVariables, TData = void> = Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>;
```
All hooks accept `options?` as last arg. Extract all param/result interfaces — no inline typing.

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
