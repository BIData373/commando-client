# Orval Migration — Assignee Feature

Tracking progress of migrating from legacy custom hooks (`src/hooks/`) and old types (`src/types/`) to orval-generated hooks (`src/api/`) and `AssigneeDto` / `UserDto`.

---

## Files to Update

### `src/components/settings/AssigneeDialog.tsx`
- [ ] Replace `useCreateAssignee` / `useUpdateAssignee` from `#/hooks/useAssignees` → `src/api/assignee/assignee`
- [ ] Replace `useUsers` from `#/hooks/useUsers` → `useListUsers` from `src/api/user/user`
- [ ] Replace `IAssignee` → `AssigneeDto`, `IUser` → `UserDto`
- [ ] Add `workspaceId` from `useWorkspace()` to `CreateAssigneeDto` payload
- [ ] Update `useCreateAssignee` call: now takes `{ data: CreateAssigneeDto }` (workspaceId required)
- [ ] Update `useUpdateAssignee` call: now takes `{ pathParams: { id }, data: UpdateAssigneeDto }` (was `{ assigneeId, data }`)
- [ ] Rename `emblem` → `icon` throughout
- [ ] Drop or rewire `userIds` logic — `AssigneeDto` has no `userIds` field (check if a separate endpoint exists)
- [ ] Update user field references: `user.name` / `user.email` → `user.upn` / `user.info.*`

---

### `src/components/settings/DeleteAssigneePopconfirm.tsx`
- [ ] Replace `useDeleteAssignee` from `#/hooks/useAssignees` → `src/api/assignee/assignee`
- [ ] Update call signature: now takes `{ pathParams: { id } }` (was just the `id` number)

---

### `src/components/settings/AssigneeCard.tsx`
- [ ] Update prop type `IAssignee` → `AssigneeDto`
- [ ] Rename `assignee.emblem` → `assignee.icon`
- [ ] `assignee.color` is now non-nullable — remove null guards if any

---

### `src/components/settings/DropdownUsers.tsx`
- [ ] Replace `useUsers` from `#/hooks/useUsers` → `useListUsers` from `src/api/user/user`
- [ ] Replace `IUser` → `UserDto`
- [ ] Update field references: `user.name` / `user.email` → `user.upn` / `user.info.*`

---

### `src/components/settings/UsersLists.tsx`
- [ ] Update prop type `IUser[]` → `UserDto[]`
- [ ] Update field references: `user.name` / `user.email` → `user.upn` / `user.info.*`

---

### `src/routes/workspace/$urlName/settings/assignees.tsx`
- [x] Already imports `useListAssignees` from `src/api/assignee/assignee`
- [x] Already imports `useListUsers` from `src/api/user/user`
- [x] `useListAssignees({ workspaceId })` — matches `ListAssigneesParams` shape
- [x] `userNames` mapping uses `u.upn` — correct for `UserDto`
- [x] `assigneeStatusEditable` from `useWorkspace()` — field exists on `WorkspaceDto`, no change needed

---

## Cleanup (after all above are done)
- [ ] Delete `src/hooks/useAssignees.ts` (no longer imported anywhere)
- [ ] Delete `src/hooks/useUsers.ts` (no longer imported anywhere)
- [ ] Remove old types from `src/types/assignee.ts` and `src/types/user.ts` if unused elsewhere

---

## Key Type Differences

| Old | New |
|-----|-----|
| `IAssignee.emblem` | `AssigneeDto.icon` |
| `IAssignee.userIds: number[]` | _(no equivalent — dropped or separate endpoint)_ |
| `IAssignee.color: string \| null` | `AssigneeDto.color: string` (non-nullable) |
| `IUser.name` | `UserDto.upn` |
| `IUser.email` | `UserDto.info.*` |
| `useCreateAssignee(data)` | `useCreateAssignee({ data: { workspaceId, ... } })` |
| `useUpdateAssignee({ assigneeId, data })` | `useUpdateAssignee({ pathParams: { id }, data })` |
| `useDeleteAssignee(id)` | `useDeleteAssignee({ pathParams: { id } })` |
