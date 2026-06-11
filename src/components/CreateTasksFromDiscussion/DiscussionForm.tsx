import styled from "@emotion/styled"
import type { AnyFieldApi } from "@tanstack/form-core"
import type { CreateSourceDto, UpdateSourceDto } from "src/api/model"
import SourceField from "../CreateTasks/SourceField"
import TagField from "../CreateTasks/TagField"
import FileUploadField from "./FileUploadField"

// ─── Types ──────────────────────────────────────────────────────────────────

interface DiscussionFormProps {
	workspaceId: number
	form: CreateSourceDto | UpdateSourceDto
	onNameChange: (name: string) => void
	onDateChange: (date: Date | undefined) => void
	onTagSelect: (tag: string) => void
	onTagRemove: (tag: string) => void
	onFileChange: (file: File | null) => void
	existingAttachmentKey?: string | null
	existingAttachmentName?: string | null
	dateField?: AnyFieldApi
}

// ─── Component ──────────────────────────────────────────────────────────────

function DiscussionForm({
	workspaceId,
	form,
	onNameChange,
	onDateChange,
	onTagSelect,
	onTagRemove,
	onFileChange,
	existingAttachmentKey,
	existingAttachmentName,
	dateField,
}: DiscussionFormProps) {
	return (
		<FormContainer>
			<SourceField
				workspaceId={workspaceId}
				source={form.name ?? ""}
				sourceDate={form.date ?? null}
				linkedSource={null}
				onSourceSelect={onNameChange}
				onDateSelect={onDateChange}
				label="שם הדיון"
				uniqueNames
				dateField={dateField}
			/>

			<TagField
				workspaceId={workspaceId}
				tags={form.tags ?? []}
				lockedTags={[]}
				onTagSelect={onTagSelect}
				onTagRemove={onTagRemove}
			/>

			<FileUploadField
				file={form.attachment as File | null | undefined}
				existingAttachmentKey={existingAttachmentKey}
				existingAttachmentName={existingAttachmentName}
				onFileChange={onFileChange}
			/>
		</FormContainer>
	)
}

export default DiscussionForm

// ─── Styled ─────────────────────────────────────────────────────────────────

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-end;
  flex: 1;
`
