import styled from "@emotion/styled"
import { useForm } from "@tanstack/react-form"
import { useStore } from "@tanstack/react-store"
import { AlertCircle } from "lucide-react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { useState } from "react"
import { invalidateQueries } from "src/queryClient"
import type { UpdateSourceDto } from "../../api/model"
import {
	getGetSourceQueryKey,
	useGetSource,
	useUpdateSource,
} from "../../api/source/source"
import { ModalContent } from "../shared/ModalContent"
import { PrimaryButton } from "../shared/PrimaryButton"
import { Dialog } from "../ui/dialog"
import { Popover, PopoverTrigger } from "../ui/popover"
import DiscussionForm from "./DiscussionForm"

// ─── Types ──────────────────────────────────────────────────────────────────

interface EditDiscussionModalProps {
	sourceId: number
	workspaceId: number
	onClose(): void
	onSuccess(): void
}

function EditDiscussionModal({
	sourceId,
	workspaceId,
	onClose,
	onSuccess,
}: EditDiscussionModalProps) {
	const { data: source } = useGetSource({ id: sourceId })

	const { mutateAsync: updateSource } = useUpdateSource()
	const [showConfirmation, setShowConfirmation] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const defaultValues: UpdateSourceDto = {
		name: source?.name ?? "",
		date: source?.date ?? null,
		tags: source?.tags.map((t) => t.name) ?? [],
		attachment: source?.attachmentKey ? undefined : null,
		deleteAttachment: false,
	}

	const form = useForm({
		defaultValues,
		onSubmit: async ({ value: { tags, ...value } }) => {
			const data: UpdateSourceDto = { tags }
			if (value.name && value.name.trim() !== defaultValues.name) {
				data.name = value.name.trim()
			}
			if (value.date?.getTime() !== defaultValues.date?.getTime()) {
				data.date = value.date ?? undefined
			}
			if (value.attachment !== defaultValues.attachment) {
				data.attachment = value.attachment ?? undefined
			}
			if (value.deleteAttachment) {
				data.deleteAttachment = true
			}

			if (Object.keys(data).length === 0) {
				return
			}

			try {
				await updateSource({ pathParams: { id: sourceId }, data })

				invalidateQueries([getGetSourceQueryKey({ id: sourceId })])
				onSuccess()

				setShowConfirmation(false)
				onClose()
			} catch (error) {
				console.error("updateSource failed:", error)
			}
		},
	})

	const values = useStore(form.store, (state) => state.values)

	const hasChanges = !form.state.isDefaultValue

	// ─── Handlers ─────────────────────────────────────────────────────────────

	function handleNameChange(name: string) {
		form.setFieldValue("name", name)
	}

	function handleDateChange(date: Date | undefined) {
		if (date) {
			form.setFieldValue("date", date)
		}
	}

	function handleTagSelect(tag: string) {
		if (!values.tags?.includes(tag)) {
			form.setFieldValue("tags", [...(values.tags || []), tag])
		}
	}

	function handleTagRemove(tag: string) {
		form.setFieldValue(
			"tags",
			values.tags?.filter((t) => t !== tag),
		)
	}

	function handleFileChange(file: File | null) {
		form.setFieldValue("attachment", file)
		form.setFieldValue("deleteAttachment", !file && !!source?.attachmentKey)
	}

	function handleOpenChange(open: boolean) {
		if (!open) onClose()
	}

	async function handleEditConfirm() {
		setIsSubmitting(true)
		setShowConfirmation(false)
		try {
			await form.handleSubmit()
		} finally {
			setIsSubmitting(false)
		}
	}

	function handleEditCancel() {
		setShowConfirmation(false)
	}

	// ─── Render ───────────────────────────────────────────────────────────────

	if (!source) return null

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<ModalCard closable={!hasChanges}>
				<ModalBody>
					<HeaderSection>
						<ModalTitle>עריכת פרטי דיון</ModalTitle>
					</HeaderSection>

					<DiscussionForm
						workspaceId={workspaceId}
						form={values}
						onNameChange={handleNameChange}
						onDateChange={handleDateChange}
						onTagSelect={handleTagSelect}
						onTagRemove={handleTagRemove}
						onFileChange={handleFileChange}
						existingAttachmentKey={source.attachmentKey}
						existingAttachmentName={source.attachmentName}
					/>

					<EditFooter>
						<Popover
							open={showConfirmation && !isSubmitting}
							onOpenChange={setShowConfirmation}
						>
							<PopoverTrigger asChild>
								<PrimaryButton
									title="שמור שינויים"
									disabled={!hasChanges}
									loading={isSubmitting}
								/>
							</PopoverTrigger>
							<ConfirmationContent side="top" align="start" sideOffset={13}>
								<ConfirmationHeader>
									<AlertCircleIcon size={16} />
									<TextWrapper>
										<ConfirmationTitle>
											עריכת פרטי דיון לכל ההנחיות
										</ConfirmationTitle>
										<ConfirmationText>
											כלל ההנחיות תחת דיון זה יתעדכנו בשינויים.
										</ConfirmationText>
									</TextWrapper>
								</ConfirmationHeader>
								<ConfirmationActions>
									<ConfirmButton onClick={handleEditConfirm}>
										בטוח
									</ConfirmButton>
									<CancelConfirmButton onClick={handleEditCancel}>
										לא
									</CancelConfirmButton>
								</ConfirmationActions>
							</ConfirmationContent>
						</Popover>
						<CancelButton onClick={onClose}>ביטול</CancelButton>
					</EditFooter>
				</ModalBody>
			</ModalCard>
		</Dialog>
	)
}

export default EditDiscussionModal

// ─── Modal Shell ────────────────────────────────────────────────────────────

const ModalCard = styled(ModalContent)`
  width: 100%;
  max-width: 753px;
  height: min(796px, calc(100vh - 48px));
  overflow: hidden;
  border-color: var(--card-border);
  box-shadow: var(--card-shadow);
`

const ModalBody = styled.div`
  direction: ltr;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 0;
  flex: 1;
  padding-inline: 48px;
  padding-block-end: 36px;
`

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
`

const ModalTitle = styled.h1`
  font-weight: 500;
  font-size: var(--fs-heading-h1);
  line-height: 50px;
  color: var(--foreground);
  margin: 0;
  text-align: end;
`

// ─── Footer ─────────────────────────────────────────────────────────────────

const EditFooter = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-shrink: 0;
`

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 133px;
  height: 40px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--background);
  color: var(--sea-ink);
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 24px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: var(--link-bg-hover);
  }
`

const ConfirmationContent = styled(PopoverPrimitive.Content)`
  direction: rtl;
  display: flex;
  padding: 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  width: 224px;
  background: var(--background);
  border-radius: 8px;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px rgba(0, 0, 0, 0.12),
    0px 9px 28px rgba(0, 0, 0, 0.05);
  z-index: var(--z-dropdown);

  &::after {
    content: '';
    position: absolute;
    inset-block-end: -8px;
    inset-inline-end: 16px;
    width: 16px;
    height: 8px;
    background: var(--background);
    clip-path: polygon(0 0, 100% 0, 50% 100%);
  }
`

const ConfirmationHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex: 1 0 0;
`

const AlertCircleIcon = styled(AlertCircle)`
  display: flex;
  margin-top: 3px;
  align-items: center;
  gap: 6px;
  color: #faad14;
`

const ConfirmationTitle = styled.span`
  font-size: var(--fs-btn);
  font-weight: 500;
  line-height: 22px;
  color: var(--sea-ink);
  align-self: stretch;
`

const ConfirmationText = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--sea-ink);
  align-self: stretch;
`

const ConfirmationActions = styled.div`
  direction: ltr;
  display: flex;
  align-items: center;
  align-self: stretch;
  gap: 8px;
`

const ConfirmButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 7px;
  gap: 8px;
  width: 43px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: linear-gradient(135deg, #6866ff 0%, #7604c8 100%);
  color: white;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`

const CancelConfirmButton = styled.button`
  display: flex;
  padding: 0 var(--Components-Button-Component-paddingInlineSM, 7px);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: var(--background);
  color: var(--sea-ink);
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  cursor: pointer;

  &:hover {
    background: var(--link-bg-hover);
  }
`
