import styled from "@emotion/styled"
import { useForm } from "@tanstack/react-form"
import { useQueryClient } from "@tanstack/react-query"
import { useStore } from "@tanstack/react-store"
import { AlertCircle, X } from "lucide-react"
import {
	Dialog as DialogPrimitive,
	Popover as PopoverPrimitive,
} from "radix-ui"
import { useState } from "react"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import type { UpdateSourceDto } from "../../api/model"
import {
	getGetSourceQueryKey,
	useGetSource,
	useUpdateSource,
} from "../../api/source/source"
import { getGetTaskQueryKey, getListTasksQueryKey } from "../../api/task/task"
import { DialogOverlay } from "../ui/dialog"
import { Popover, PopoverTrigger } from "../ui/popover"
import DiscussionForm from "./DiscussionForm"

// ─── Types ──────────────────────────────────────────────────────────────────

interface EditDiscussionModalProps {
	onClose: () => void
	sourceId: number
	taskId: number
}

function EditDiscussionModal({
	onClose,
	sourceId,
	taskId,
}: EditDiscussionModalProps) {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()
	const { data: source } = useGetSource({ id: sourceId })

	const queryClient = useQueryClient()
	const { mutateAsync: updateSource } = useUpdateSource()
	const [showConfirmation, setShowConfirmation] = useState(false)

	const defaultValues: UpdateSourceDto = {
		name: source?.name ?? "",
		date: source?.date ?? null,
		tags: source?.tags.map((t) => t.name) ?? [],
		attachment: source?.attachmentKey ? undefined : null,
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

			if (Object.keys(data).length === 0) {
				return
			}

			try {
				await updateSource({ pathParams: { id: sourceId }, data })
				const queryKeys = [
					getListTasksQueryKey({ workspaceId }),
					getGetTaskQueryKey({ id: taskId }),
					getGetSourceQueryKey({ id: sourceId }),
				]
				await Promise.all(
					queryKeys.map((queryKey) =>
						queryClient.invalidateQueries({ queryKey }),
					),
				)
				setShowConfirmation(false)
				onClose()
			} catch (error) {
				console.error("updateSource failed:", error)
			}
		},
	})

	const values = useStore(form.store, (state) => state.values)

	const hasChanges =
		values.name?.trim() !== defaultValues.name ||
		values.date?.getTime() !== defaultValues.date?.getTime() ||
		JSON.stringify(values.tags) !== JSON.stringify(defaultValues.tags) ||
		values.attachment !== defaultValues.attachment

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
	}

	function handleOpenChange(open: boolean) {
		if (!open) onClose()
	}

	function handleEditConfirm() {
		form.handleSubmit()
	}

	function handleSaveClick(e: React.MouseEvent) {
		if (!hasChanges) {
			e.preventDefault()
		}
	}

	function handleEditCancel() {
		setShowConfirmation(false)
	}

	// ─── Render ───────────────────────────────────────────────────────────────

	if (!source) return null

	return (
		<DialogPrimitive.Root open onOpenChange={handleOpenChange}>
			<DialogPrimitive.Portal>
				<DialogOverlay />
				<ModalCard>
					<ModalCloseButton onClick={onClose}>
						<X size={16} />
					</ModalCloseButton>

					<ModalBody>
						<HeaderSection>
							<ModalTitle>עריכת פרטי דיון</ModalTitle>
						</HeaderSection>

						<DiscussionForm
							form={values}
							onNameChange={handleNameChange}
							onDateChange={handleDateChange}
							onTagSelect={handleTagSelect}
							onTagRemove={handleTagRemove}
							onFileChange={handleFileChange}
						/>

						<EditFooter>
							<Popover
								open={showConfirmation}
								onOpenChange={setShowConfirmation}
							>
								<PopoverTrigger asChild>
									<SaveButton $disabled={!hasChanges} onClick={handleSaveClick}>
										שמור שינויים
									</SaveButton>
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
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	)
}

export default EditDiscussionModal

// ─── Modal Shell ────────────────────────────────────────────────────────────

const ModalCard = styled(DialogPrimitive.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 753px;
  height: min(796px, calc(100vh - 48px));
  overflow-y: auto;
  overflow: hidden;
  background: var(--background);
  border: 1px solid var(--card-border);
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  z-index: var(--z-dropdown);
  display: flex;
  flex-direction: column;
  padding-block: 36px;
  padding-inline: 48px;
  outline: none;
`

const ModalCloseButton = styled.button`
  position: absolute;
  inset-block-start: 15px;
  inset-inline-end: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 2px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  outline: none;

  &:hover {
    color: var(--text-color-2);
    background: rgba(0, 0, 0, 0.04);
  }
`

const ModalBody = styled.div`
  direction: ltr;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 0;
  flex: 1;
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

const SaveButton = styled.button<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-inline: 24px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(165deg, #6866ff 0%, #7604c8 100%);
  color: white;
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 24px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  white-space: nowrap;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: var(--shadow-inset);
    pointer-events: none;
  }

  &:hover {
    opacity: ${({ $disabled }) => ($disabled ? 0.5 : 0.9)};
  }
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
