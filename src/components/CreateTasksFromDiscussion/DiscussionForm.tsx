import styled from "@emotion/styled"
import type { CreateSourceDto, UpdateSourceDto } from "src/api/model"
import SourceField from "../CreateTasks/SourceField"
import TagField from "../CreateTasks/TagField"
import FileUploadField from "./FileUploadField"

// ─── Types ──────────────────────────────────────────────────────────────────

interface DiscussionFormProps {
	form: CreateSourceDto | UpdateSourceDto
	onNameChange: (name: string) => void
	onDateChange: (date: Date | undefined) => void
	onTagSelect: (tag: string) => void
	onTagRemove: (tag: string) => void
	onFileChange: (file: File | null) => void
}

// ─── Component ──────────────────────────────────────────────────────────────

function DiscussionForm({
	form,
	onNameChange,
	onDateChange,
	onTagSelect,
	onTagRemove,
	onFileChange,
}: DiscussionFormProps) {
	return (
		<FormContainer>
			<SourceField
				source={form.name ?? ""}
				sourceDate={form.date ?? null}
				linkedSource={null}
				onSourceSelect={onNameChange}
				onDateSelect={onDateChange}
				label="שם הדיון"
				uniqueNames
			/>

			<TagField
				tags={form.tags ?? []}
				lockedTags={[]}
				onTagSelect={onTagSelect}
				onTagRemove={onTagRemove}
			/>

			<FileUploadField
				file={form.attachment as File | null}
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
