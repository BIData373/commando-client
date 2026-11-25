# Plan: migrate the FE to the source-attachments API

Server branch: `feature/source-attachments` (commando-server).
A source no longer has one attachment stored on itself. It now has a list of `SourceAttachment` rows, and each row has its own extraction status and visibility flag.

**Scope: compatibility only, no UI changes.** The current screens, components and UX stay exactly as they are. Only data access and API calls change, so the existing UI works against the new backend. Wherever the UI shows "the" attachment, it now reads `source.attachments[0]`.

Ship this before, or together with, the server deploy.

---

## 0. API contract changes

### Removed or moved endpoints

| Old | New |
|---|---|
| `GET /attachment/signed-url?key&filename`: `getAttachmentSignedUrl` (`src/api/s3/s3.ts`) | `GET /source-attachment/:id/signed-url`: `getSourceAttachmentSignedUrl({ id })` |
| `POST /source/:id/extract`: `extractSource({ id })` | `POST /source/:id/extract/:attachmentId`: `extractSource({ id, attachmentId })` |

### New endpoints (tag `source-attachment`)

| Method | Path | operationId | Body |
|---|---|---|---|
| POST | `/source-attachment` | `createSourceAttachment` | multipart: `sourceId`, `attachment` (file, required), `visibleToAssignees?` |
| GET | `/source-attachment/:id` | `getSourceAttachment` | none |
| GET | `/source-attachment/:id/signed-url` | `getSourceAttachmentSignedUrl` | none, returns `{ url }` |
| PUT | `/source-attachment/:id` | `updateSourceAttachment` | JSON `{ visibleToAssignees? }` |
| DELETE | `/source-attachment/:id` | `deleteSourceAttachment` | none |

Writes (create, update and delete) require MANAGER permission on the source's workspace. The signed URL is available to anyone who can see the attachment (see §6).

### `SourceDto` / `SourceWithTasksDto`, also nested as `TaskDto.source` and `TaskRowDto.source`

```diff
- attachmentKey: string | null
- attachmentName: string | null
- extractionStatus: ExtractionStatus | null
+ attachments: SourceAttachmentDto[]   // ordered by createdAt asc
```

```ts
SourceAttachmentDto {
	id: number
	name: string
	extractionStatus: ExtractionStatus | null
	visibleToAssignees: boolean
	sourceId: number
	createdAt, createdBy, updatedAt, updatedBy
}
```

The client no longer receives the S3 `key`. Downloads go through the attachment **id**.

### `CreateSourceDto` (`POST /source`, still multipart)

- Still takes a single `attachment` file and `aiExtraction`.
- **New:** `attachmentVisibleToAssignees?: boolean` (default `false`).
- `aiExtraction: true` without a file now returns **400**.
- An S3 upload failure now returns **503**. Before, the source was created without an attachment.

### `UpdateSourceDto` (`PUT /source/:id`)

- **It is now JSON, not multipart.**
- **Removed:** `attachment`, `deleteAttachment`, `aiExtraction`.
- Only `name`, `date`, `tags`, `draft`, `tasks` and `workspaceId` remain.
- The server silently strips unknown fields (`whitelist: true`). Sending a removed field returns **200 and does nothing**. Every call site must be fixed. TypeScript catches them only after regeneration.

### Socket `TASK_EXTRACTION_FINISHED`

The payload is the raw `getSource` shape: `SourceWithTasksDto` with `attachments[]`, and no top-level `extractionStatus`.

---

## 1. Regenerate the API client

1. Run commando-server on the `feature/source-attachments` branch.
2. `npm run orval`
3. Expected result:
   - `src/api/s3/` is deleted. `S3Controller` is gone, so `clean: true` removes it.
   - `src/api/source-attachment/source-attachment.ts` is added (the name comes from `autoTagControllers`).
   - `src/api/model/source-attachment-dto.ts` and related models are added.
   - `SourceDto`, `SourceWithTasksDto`, `CreateSourceDto` and `UpdateSourceDto` are updated.
   - `src/api/model/get-attachment-signed-url-params.ts` is deleted.
   - `updateSource` now sends JSON instead of using `serializeFormData`. Confirm this in `src/api/source/source.ts`.
4. Run `npx tsc --noEmit`. Every error should map to a step below.

---

## 2. Attachment download: `src/hooks/useAttachmentDownload.ts`

Switch from key-based to id-based downloads.

```ts
import { getSourceAttachmentSignedUrl } from "../api/source-attachment/source-attachment"

async function download(attachment?: Pick<SourceAttachmentDto, "id" | "name"> | null) {
	if (!attachment || isDownloading) {
		return
	}
	...
	const { url } = await getSourceAttachmentSignedUrl({ id: attachment.id })
	if (url) {
		await downloadFromUrl(url, attachment.name)
	}
	...
}
```

Callers: `TaskDetailPanel.tsx` and `FileUploadField.tsx` (steps 3 and 4).

---

## 3. Task detail: `src/components/TaskDetail/TaskDetailPanel.tsx`

- Line ~162: `download(source?.attachmentKey, source?.attachmentName)` becomes `download(attachment)`, where `const attachment = source?.attachments[0]`.
- Lines ~352–360: render on `attachment` instead of `source.attachmentKey`, and show `attachment.name`.

Because of visibility filtering (§6), `attachments` can be empty for assignees who are not workspace members. The existing `&&` guard, applied to `attachment`, already renders nothing in that case.

---

## 4. Discussion form and file field

### `DiscussionForm.tsx` and `FileUploadField.tsx`

- Replace the props `existingAttachmentKey` and `existingAttachmentName` with one prop: `existingAttachment?: SourceAttachmentDto | null`.
- `FileUploadField`:
  - `showExisting = file === undefined && !!existingAttachment`
  - `handleDownload = () => download(existingAttachment)`

### `CreateDiscussionModal.tsx`

| Line | Change |
|---|---|
| ~137 | `!!source?.attachmentKey` becomes `!!source?.attachments.length` |
| ~139 | `alreadyExtracted = source?.extractionStatus != null` becomes `source?.attachments[0]?.extractionStatus != null` |
| ~361–362 | Pass `existingAttachment={source?.attachments[0]}` |
| ~193–210 `createAndAdvance` | Rewrite this. See below. |

`createAndAdvance(aiExtraction)` currently calls `updateSource({ ...values, aiExtraction })` when `sourceId` exists. That path no longer works: `attachment` and `aiExtraction` are dropped, and the PUT is JSON. New flow:

```text
if no sourceId:
	createSource({ data: { ...values, aiExtraction } })            // unchanged, still multipart

if sourceId exists:
	1. updateSource({ pathParams: { id }, data: { name, date, tags } })       // JSON, metadata only
	2. if aiExtraction:
		 attachmentId =
			 values.attachment (a new File)
				 ? (await createSourceAttachment({ data: { sourceId, attachment: values.attachment } })).id
				 : source.attachments[0].id
		 await extractSource({ pathParams: { id: sourceId, attachmentId } })
	   (extract sets draft=true itself, so do not send draft)
```

`onSubmitMeta` is typed `Partial<UpdateSourceDto>`, which no longer has `aiExtraction`. Retype it as `{ aiExtraction: boolean }`.

After create, add `getGetSourceQueryKey({ id })` to the invalidated keys so `attachments` is refetched.

### `EditDiscussionModal.tsx`

The PUT can no longer touch the file. Split the submit into three parts:

| Form state | Calls |
|---|---|
| Metadata changed (`name`, `date`, `tags`) | `updateSource({ pathParams: { id }, data })` with **only** these fields |
| `deleteAttachment` (file cleared while one exists) | `deleteSourceAttachment({ pathParams: { id: existing.id } })` |
| New file picked | If one exists, `deleteSourceAttachment` first (replace semantics, as before). Then `createSourceAttachment({ data: { sourceId, attachment: file } })` |

- Remove `attachment` and `deleteAttachment` from `UpdateSourceDto`-typed `defaultValues`. Use a local form type: `UpdateSourceDto & { attachment?: File | null; deleteAttachment?: boolean }`.
- Line ~51: `source?.attachmentKey ? undefined : null` becomes `source?.attachments.length ? undefined : null`.
- Line ~121: `!!source?.attachmentKey` becomes `!!source?.attachments.length`.
- Lines ~165–166: pass `existingAttachment={source.attachments[0]}`.
- Run the calls in this order: create the new attachment, then delete the old one, then update the source. If the upload fails, the old file is kept. A replacement keeps the old attachment's `visibleToAssignees`. This lives in `src/hooks/useReplaceSourceAttachment.ts`, shared by both modals. Then invalidate `getGetSourceQueryKey`. If any call throws, keep the modal open, and the existing error toast still fires.

---

## 5. AI extraction status and retry: `CreateTasksTable.tsx`

All of these read `source.extractionStatus`, which no longer exists.

Add one helper and use it everywhere in the file:

```ts
const extractionAttachment = source?.attachments[0]
const extractionStatus = extractionAttachment?.extractionStatus ?? null
```

| Line | Change |
|---|---|
| ~84–85 `isExtracting` | Use `extractionStatus` |
| ~91 `handleRetry` | `extractSource({ pathParams: { id: sourceId, attachmentId: extractionAttachment.id } })`. Guard if there is no attachment. |
| ~134–148 socket handler | `setFinalStatus(dto.extractionStatus)` becomes the status of the attachment being extracted: `dto.attachments.find(a => a.id === extractionAttachment?.id)?.extractionStatus ?? dto.attachments[0]?.extractionStatus ?? null`. Apply the same change to the `FINISHED_WITH_TASKS` check. |
| ~154, 165–166 `useEffect` | Use `extractionStatus` |

`AIExtractionAlert.tsx` only uses the `ExtractionStatus` enum. The enum values are unchanged, so no change is needed there.

---

## 6. Paperclip indicators

| File | Change |
|---|---|
| `src/components/Tasks/cells/SourceCell.tsx:29` | `source.attachmentKey` becomes `source.attachments.length > 0` |
| `src/components/CreateTasks/SourceField.tsx:142` | `!!linkedSource?.attachmentKey` becomes `!!linkedSource?.attachments.length` |

**Visibility (behaviour change, no code error):** in task responses (`getTask`, task rows, personal task rows, assignee-status upsert), `source.attachments` contains only the attachments the user may see:

- Workspace viewers and above, and BI users: every attachment.
- Everyone else, such as external assignees: only attachments with `visibleToAssignees: true`, and only on non-draft sources.

The FE needs no change for this; the paperclip and download already render only when an attachment is present. Existing attachments are migrated with `visibleToAssignees = true`, so external assignees keep seeing them. New uploads use the server default of `false`, because the FE sends no visibility flag. External assignees won't see attachments uploaded after the deploy.

---

## 7. Verification checklist

- [ ] `npm run orval` is clean. `npx tsc --noEmit` passes. No references remain to `attachmentKey`, `attachmentName`, `deleteAttachment`, `getAttachmentSignedUrl`, or top-level `source.extractionStatus` / `dto.extractionStatus`.
- [ ] Create a discussion with a file and no AI. The paperclip shows in the task table and in task detail, and the download works.
- [ ] Create a discussion with a file and AI. The pending alert shows, the socket event finishes it, and the extracted rows appear.
- [ ] Create a discussion with AI and no file. The button is disabled. If it is forced, a 400 toast shows.
- [ ] Re-open an existing discussion and run AI extract, both on the existing file and on a newly picked file.
- [ ] Retry after `AI_SERVICE_ERROR` calls `/source/:id/extract/:attachmentId`.
- [ ] Edit a discussion: rename only, replace the file, and remove the file. Each persists. Check the network tab: the PUT is JSON and contains no file fields.
- [ ] As an external assignee (not a workspace member), the task detail shows no attachment block and no empty paperclip.
- [ ] The MSW mocks were regenerated, and Storybook or dev mocks still render.
