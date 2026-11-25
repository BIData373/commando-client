import type { SourceAttachmentDto } from "../api/model"
import {
	useCreateSourceAttachment,
	useDeleteSourceAttachment,
} from "../api/source-attachment/source-attachment"

const errorToastOptions = { mutation: { meta: { toast: { error: true } } } }

export function useReplaceSourceAttachment() {
	const { mutateAsync: createSourceAttachment } =
		useCreateSourceAttachment(errorToastOptions)
	const { mutateAsync: deleteSourceAttachment } =
		useDeleteSourceAttachment(errorToastOptions)

	async function replaceAttachment(
		sourceId: number,
		file: File | null,
		existing?: SourceAttachmentDto | null,
	) {
		const created = file
			? await createSourceAttachment({
					data: {
						sourceId,
						attachment: file,
						visibleToAssignees: existing?.visibleToAssignees,
					},
				})
			: null

		if (existing) {
			await deleteSourceAttachment({ pathParams: { id: existing.id } })
		}

		return created
	}

	return { replaceAttachment }
}
