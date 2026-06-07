import styled from "@emotion/styled"
import { useForm } from "@tanstack/react-form"
import { useStore } from "@tanstack/react-store"
import { Check, Paperclip, X } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { useState } from "react"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import type { CreateSourceDto } from "../../api/model"
import { useCreateSource } from "../../api/source/source"
import { formatDate } from "../../functions/date-utils"
import { useSaveTasks } from "../../hooks/useSaveTasks"
import CreateTasksTable from "./CreateTasksTable"
import DiscussionForm from "./DiscussionForm"
import type { NewTaskRow } from "./TasksColumns"

// ─── Types ──────────────────────────────────────────────────────────────────

enum Steps {
	Discussion = 1,
	Tasks = 2,
}

interface CreateDiscussionModalProps {
	onClose: () => void
}

// ─── Component ──────────────────────────────────────────────────────────────

function CreateDiscussionModal({ onClose }: CreateDiscussionModalProps) {
	const saveTasks = useSaveTasks()
	const { mutateAsync: createSource } = useCreateSource()
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	const defaultValues: CreateSourceDto = {
		workspaceId,
		name: "",
		date: null,
		tags: [],
		attachment: null,
	}

	const form = useForm({
		defaultValues,
	})

	const values = useStore(form.store, (state) => state.values)
	const [currentStep, setCurrentStep] = useState<Steps>(Steps.Discussion)

	const isCurrentStepTasks = currentStep === Steps.Tasks

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
		const current = values.tags ?? []
		if (!current.includes(tag)) {
			form.setFieldValue("tags", [...current, tag])
		}
	}

	function handleTagRemove(tag: string) {
		form.setFieldValue(
			"tags",
			(values.tags ?? []).filter((t) => t !== tag),
		)
	}

	function handleFileChange(file: File | null) {
		form.setFieldValue("attachment", file)
	}

	function handleOpenChange(open: boolean) {
		if (!open) onClose()
	}

	function handleContinue() {
		setCurrentStep(Steps.Tasks)
	}

	function handleBack() {
		setCurrentStep(Steps.Discussion)
	}

	async function handleSave(taskRows: NewTaskRow[]) {
		try {
			const source = await createSource({ data: values })
			const inputs = taskRows.map(
				({ id, rowKey, assigneeDetails, ...rest }) => ({
					...rest,
					workspaceId,
					sourceId: source.id,
					groupKey: String(id),
				}),
			)
			saveTasks(inputs)
			onClose()
		} catch (error) {
			console.error("createSource failed:", error)
		}
	}

	// ─── Render ───────────────────────────────────────────────────────────────

	return (
		<DialogPrimitive.Root open onOpenChange={handleOpenChange}>
			<DialogPrimitive.Portal>
				<Overlay />
				<ModalCard $step={currentStep}>
					<ModalCloseButton onClick={onClose}>
						<X size={16} />
					</ModalCloseButton>

					<ModalBody>
						<HeaderSection>
							<ModalTitle>יצירת הנחיות מתוך דיון</ModalTitle>

							<StepsRow>
								<StepItem>
									<StepLabel $active>פרטי הדיון</StepLabel>
									{isCurrentStepTasks ? (
										<StepCircleCompleted>
											<Check size={12} />
										</StepCircleCompleted>
									) : (
										<StepCircleActive>1</StepCircleActive>
									)}
								</StepItem>

								<StepTail $completed={isCurrentStepTasks} />

								<StepItem>
									<StepLabel $active={isCurrentStepTasks}>
										יצירת הנחיות
									</StepLabel>
									<StepCircle $active={isCurrentStepTasks}>2</StepCircle>
								</StepItem>
							</StepsRow>

							{isCurrentStepTasks && (
								<DiscussionInfoRow>
									<DiscussionInfoText>
										<DiscussionDate>
											{values.date ? formatDate(values.date) : ""}
										</DiscussionDate>
										<DiscussionName>{values.name}</DiscussionName>
									</DiscussionInfoText>
									{values.attachment && <Paperclip size={20} />}
								</DiscussionInfoRow>
							)}
						</HeaderSection>

						{currentStep === Steps.Discussion ? (
							<>
								<DiscussionForm
									form={values}
									onNameChange={handleNameChange}
									onDateChange={handleDateChange}
									onTagSelect={handleTagSelect}
									onTagRemove={handleTagRemove}
									onFileChange={handleFileChange}
								/>

								<ModalFooter>
									<ContinueButton
										onClick={handleContinue}
										disabled={!values.name.trim()}
									>
										המשך
									</ContinueButton>
								</ModalFooter>
							</>
						) : (
							<CreateTasksTable onSave={handleSave} onBack={handleBack} />
						)}
					</ModalBody>
				</ModalCard>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	)
}

export default CreateDiscussionModal

// ─── Modal Shell ────────────────────────────────────────────────────────────

const Overlay = styled(DialogPrimitive.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1px);
  z-index: var(--z-dropdown);
`

const ModalCard = styled(DialogPrimitive.Content)<{ $step: Steps }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: ${({ $step }) =>
		$step === Steps.Discussion ? "753px" : "1550px"};
  transition: width 300ms ease;
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
  font-size: 42px;
  line-height: 50px;
  color: var(--foreground);
  margin: 0;
  text-align: end;
`

// ─── Discussion Info (Step 2 header) ────────────────────────────────────────

const DiscussionInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  color: var(--text-color-2);
`

const DiscussionInfoText = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  white-space: nowrap;
`

const DiscussionName = styled.span`
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  color: var(--foreground);
`

const DiscussionDate = styled.span`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: var(--foreground);
`

// ─── Footer ─────────────────────────────────────────────────────────────────

const ModalFooter = styled.div`
  direction: ltr;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

const ContinueButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 133px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(165deg, #6866ff 0%, #7604c8 100%);
  color: white;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  cursor: pointer;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`

// ─── Steps Indicator ────────────────────────────────────────────────────────

const StepsRow = styled.div`
  direction: rtl;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 657px;
  height: 24px;
  align-self: flex-end;
`

const StepItem = styled.div`
  direction: ltr;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

const stepCircleBase = `
  width: 24px;
  height: 24px;
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  flex-shrink: 0;
`

const StepCircleActive = styled.div`
  ${stepCircleBase}
  background: #6866ff;
  color: white;
`

const StepCircleCompleted = styled.div`
  ${stepCircleBase}
  background: #e2e2ff;
  color: #6866ff;
`

const StepCircle = styled.div<{ $active: boolean }>`
  ${stepCircleBase}
  background: ${({ $active }) => ($active ? "#6866ff" : "rgba(0, 0, 0, 0.06)")};
  color: ${({ $active }) => ($active ? "white" : "rgba(0, 0, 0, 0.45)")};
`

const StepLabel = styled.span<{ $active: boolean }>`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: ${({ $active }) => ($active ? "var(--text-color-2)" : "rgba(0, 0, 0, 0.45)")};
  white-space: nowrap;
`

const StepTail = styled.div<{ $completed: boolean }>`
  flex: 1;
  height: 1px;
  border-block-start: 1px ${({ $completed }) => ($completed ? "solid #6866ff" : "dashed var(--card-border)")};
`
