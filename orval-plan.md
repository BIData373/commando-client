# Plan: Fix Build Issues Related to New Orval Hooks

## Context
After migrating to Orval-generated API hooks (`src/api/`), several files broke because:
- 3 custom hook files are missing (`useAssignees`, `useUsers`, `useWorkspaceSettings`)
- `src/types/index.ts` is missing (the `src/types/` dir has only `history.ts` and `message.ts`)
- `general.tsx` has TypeScript errors from an incomplete integration
- Components depending on old hook APIs can't compile

`WorkspaceProvider` already exists (`src/providers/WorkspaceProvider.tsx`) and provides `WorkspaceContext` (extends `WorkspaceDto` + `workspaceId`). It should be used wherever workspace data is needed instead of re-fetching.

---

## Files to Change

| File | Action |
|---|---|
| `src/routes/workspace/$urlName/settings/general.tsx` | Fix 3 TS errors |
| `src/routes/workspace/$urlName/settings/assignees.tsx` | Replace missing hooks with Orval + WorkspaceProvider |
| `src/types/index.ts` | Create — define legacy types used across the codebase |
| `src/hooks/useAssignees.ts` | Create — wrapper around Orval hooks |
| `src/hooks/useUsers.ts` | Create — wrapper around Orval hooks |
| `src/hooks/useWorkspaceSettings.ts` | Create — wrapper around `useWorkspace()` |
| `src/components/settings/AssigneeDialog.tsx` | Replace hook imports |
| `src/components/settings/DropdownUsers.tsx` | Replace hook import |
| `src/components/TaskDetail/AssigneeSection.tsx` | Replace hook import |

---

## Step-by-Step Changes

### 1. Fix `general.tsx` (3 TypeScript errors)

**Error 1 & 2 — `pikudId` missing from `FormState`:**
- Add `pikudId: number` to `FormState`
- Fix `handleCommandChange`: `setField("pikud", value)` → `setField("pikudId", Number(value))`
- Fix `setField` `updateSettings` call: include `pikudId: next.pikudId` in data payload

**Error 3 — Lowercase styled components used as JSX tags:**
The styled components `iconPreview`, `iconClearButton`, `iconPlaceholder` are used as JSX tags but lowercase is treated as HTML intrinsics by React/TS.
- Rename `iconPreview` → `IconPreview`, `iconClearButton` → `IconClearButton`, `iconPlaceholder` → `IconPlaceholder`
- Update JSX tags and `export const` declarations

---

### 2. Create `src/types/index.ts`

Define legacy types used across components and mock data. These keep non-migrated components compiling without touching them:

```ts
export enum UserRole { ADMIN = 'admin', VIEWER = 'viewer' }

export interface IWorkspaceSettings {
  name: string
  command: string | null
  logoUrl: string | null
  assigneeStatusEditable: boolean
}

export interface IAssignee {
  id: number; name: string; color: string
  role: string; email: string; emblem: string | null
  userIds: number[]
  createdAt: string; createdBy: number
  updatedAt: string; updatedBy: number
  deletedAt: string | null; deletedBy: number | null
}

export interface IUser {
  id: number; name: string; email: string
  avatarUrl: string | null; role: UserRole
  createdAt: string; updatedAt: string; lastLogin: string
}

export interface IUserSummary { id: number; name: string }
```

---

### 3. Create `src/hooks/useAssignees.ts`

Wrapper around Orval hooks. Calls `useListAssignees({ workspaceId })` using workspace from context. Maps `AssigneeDto` → `IAssignee` so existing components work unchanged.

```ts
import { useListAssignees, useCreateAssignee, useUpdateAssignee, useDeleteAssignee } from 'src/api/assignee/assignee'
import type { AssigneeDto } from 'src/api/model'
import { useWorkspace } from 'src/providers/WorkspaceProvider'
import type { IAssignee } from 'src/types'

function toIAssignee(dto: AssigneeDto): IAssignee {
  return {
    ...dto,
    emblem: dto.icon,
    userIds: dto.users.map(u => u.id),
    role: '',
    email: '',
  }
}

export function useAssignees() {
  const { workspaceId } = useWorkspace()
  const result = useListAssignees({ workspaceId })
  return { ...result, data: result.data?.map(toIAssignee) ?? [] }
}

export { useCreateAssignee, useUpdateAssignee, useDeleteAssignee }
```

---

### 4. Create `src/hooks/useUsers.ts`

Wrapper around `useListUsers` / `useGetUser`. Maps `UserDto` → `IUser`.

```ts
import { useListUsers, useGetUser } from 'src/api/user/user'
import type { UserDto } from 'src/api/model'
import type { IUser } from 'src/types'
import { UserRole } from 'src/types'

function toIUser(dto: UserDto): IUser {
  return {
    id: dto.id,
    name: dto.info?.name ?? dto.upn,
    email: dto.upn,
    avatarUrl: null,
    role: UserRole.VIEWER,
    createdAt: '', updatedAt: '', lastLogin: '',
  }
}

export function useUsers() {
  const result = useListUsers()
  return { ...result, data: result.data?.map(toIUser) ?? [] }
}

export function useUser(id: number) {
  const result = useGetUser({ id })
  return { ...result, data: result.data ? toIUser(result.data) : undefined }
}
```

---

### 5. Create `src/hooks/useWorkspaceSettings.ts`

Re-uses `useWorkspace()` context. Maps `WorkspaceDto` → `IWorkspaceSettings`:

```ts
import { useWorkspace } from 'src/providers/WorkspaceProvider'
import type { IWorkspaceSettings } from 'src/types'
import { useUpdateWorkspace } from 'src/api/workspace/workspace'

export function useWorkspaceSettings(_urlName?: string) {
  const workspace = useWorkspace()
  const settings: IWorkspaceSettings = {
    name: workspace.title,
    command: null,       // pikudId is an int in new schema, no string command
    logoUrl: workspace.icon,
    assigneeStatusEditable: workspace.assigneeStatusEditable,
  }
  return { data: settings }
}

export function useUpdateWorkspaceSettings(_urlName?: string) {
  const { workspaceId } = useWorkspace()
  const { mutate, ...rest } = useUpdateWorkspace()
  return {
    ...rest,
    mutate: (patch: Partial<IWorkspaceSettings>) =>
      mutate({ pathParams: { id: workspaceId }, data: { assigneeStatusEditable: patch.assigneeStatusEditable } }),
  }
}
```

---

### 6. Fix `assignees.tsx`

- Remove imports of the 3 old hook files
- Import `useWorkspace` from `WorkspaceProvider`
- Import `useListAssignees` from `src/api/assignee/assignee`
- Import `useListUsers` from `src/api/user/user`
- Import `useUpdateWorkspace` from `src/api/workspace/workspace`
- Use `useWorkspace()` for `workspace` (provides `workspaceId` + all `WorkspaceDto` fields)
- Replace `settings?.assigneeStatusEditable` → `workspace.assigneeStatusEditable`
- Replace `handleCheckboxChange` `updateSettings` call → `updateWorkspace({ pathParams: { id: workspace.workspaceId }, data: { assigneeStatusEditable: checked } })`
- Replace `assignees.filter(a => a.name.includes(searchQuery))` — `AssigneeDto.name` still exists ✓
- Replace `users.map((u) => [u.id, u.name])` → `users.map((u) => [u.id, u.info?.name ?? u.upn])`
- `AssigneeCard` receives `IAssignee` typed prop — either update its type to `AssigneeDto` or use the `useAssignees` wrapper hook

Note: since `assignees.tsx` is already inside the workspace route tree, WorkspaceProvider needs to wrap it. Add `WorkspaceProvider` either:
- In `src/routes/workspace/$urlName/route.tsx` (wraps all workspace sub-routes — preferred)
- OR inline in `assignees.tsx`

Check `route.tsx` to confirm where to insert it.

---

### 7. Update `AssigneeDialog.tsx`

- Replace `import { useCreateAssignee, useUpdateAssignee } from 'src/hooks/useAssignees'` → `src/api/assignee/assignee`
- Replace `import { useUsers } from 'src/hooks/useUsers'` → `src/hooks/useUsers` (keep, wrapper will exist)
- Fix mutation call signatures to match Orval: `createAssignee.mutateAsync({ data: payload })`, `updateAssignee.mutateAsync({ pathParams: { id }, data: payload })`
- `payload.emblem` → `payload.icon` to match `CreateAssigneeDto`

---

### 8. Update `DropdownUsers.tsx`

Replace `useUsers` import — `src/hooks/useUsers` (wrapper will provide same shape) ✓

---

### 9. Update `AssigneeSection.tsx`

Replace `useWorkspaceSettings(urlName)` → `useWorkspace()` from `WorkspaceProvider`. Pass `WorkspaceDto` to `AssigneeContainer` (update `AssigneeContainer`'s `workspaceSettings` prop type from `IWorkspaceSettings` to `{ assigneeStatusEditable: boolean }`).

---

## Execution Order

1. `src/types/index.ts` — unblocks everything else
2. `general.tsx` — isolated fixes, no dependencies
3. `src/hooks/useUsers.ts`
4. `src/hooks/useAssignees.ts`  
5. `src/hooks/useWorkspaceSettings.ts`
6. `src/routes/workspace/$urlName/route.tsx` — add WorkspaceProvider
7. `assignees.tsx`
8. `AssigneeDialog.tsx`
9. `DropdownUsers.tsx`
10. `AssigneeSection.tsx` + `AssigneeContainer.tsx`

## Verification
Run `npx tsc --noEmit` after each file to confirm no new errors are introduced.
