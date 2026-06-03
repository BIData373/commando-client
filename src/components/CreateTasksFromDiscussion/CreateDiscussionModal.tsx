import styled from "@emotion/styled";
import { AlertCircle, Check, Paperclip, X } from "lucide-react";
import { useState } from "react";
import SourceField from "../CreateTasks/SourceField";
import TopicField from "../CreateTasks/TopicField";
import { Popover as PopoverPrimitive } from "radix-ui"
import { Popover, PopoverTrigger } from "../ui/popover";
import CreateTasksTable from "./CreateTasksTable";
import FileUploadField from "./FileUploadField";
import type { TaskRow } from "../../providers/TasksFiltersProvider";
import { Dialog as DialogPrimitive } from "radix-ui"
import { useUpdateSource } from "../../api/source/source"
import type { DeadlineType } from "../shared/DeadlineTag"
import { formatDate } from "../../functions/date-utils"
import { useSaveTasks } from "../../hooks/useSaveTasks"


// ─── Types ──────────────────────────────────────────────────────────────────

enum Steps {
	Discussion = 1,
	Tasks = 2,
}

interface DiscussionFormState {
	name: string
	sourceDate: Date | null
	topics: string[]
	file: File | null
}

interface CreateDiscussionModalProps {
	onClose: () => void;
	sourceId?: number;
	editData?: DiscussionFormState;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const INITIAL_FORM: DiscussionFormState = {
	name: "",
	sourceDate: null,
	topics: [],
	file: null,
}

// ─── Component ──────────────────────────────────────────────────────────────

function CreateDiscussionModal({
	onClose,
	sourceId,
	editData,
}: CreateDiscussionModalProps) {
	const isEditMode = !!editData;
	const saveTasks = useSaveTasks();
	const { mutate: updateSource } = useUpdateSource();

	const [form, setForm] = useState<DiscussionFormState>(
		editData ?? INITIAL_FORM,
	);
	const [currentStep, setCurrentStep] = useState<Steps>(Steps.Discussion);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const setField = <K extends keyof DiscussionFormState>(
		key: K,
		value: DiscussionFormState[K],
	) => setForm((prev) => ({ ...prev, [key]: value }))

	const isCurrentStepTasks = currentStep === Steps.Tasks;

	function getChangedFields(): Record<string, unknown> | null {
		if (!editData) return null;
		const data: Record<string, unknown> = {};
		if (form.name.trim() !== editData.name) data.name = form.name.trim();
		if (form.sourceDate?.getTime() !== editData.sourceDate?.getTime())
			data.date = form.sourceDate ?? undefined;
		if (JSON.stringify(form.topics) !== JSON.stringify(editData.topics))
			data.tags = form.topics;
		if (form.file !== editData.file) data.file = form.file ?? undefined;
		return Object.keys(data).length > 0 ? data : null;
	}

	const hasChanges = isEditMode && getChangedFields() !== null;
	// ─── Source / Name Handlers ───────────────────────────────────────────────

	function handleSourceSelect(name: string) {
		setField("name", name)
	}

	function handleDateSelect(date: Date | undefined) {
		if (date) {
			setField("sourceDate", date)
		}
	}

	// ─── Topic Handlers ───────────────────────────────────────────────────────

	function handleTopicSelect(topic: string) {
		if (!form.topics.includes(topic)) {
			setField("topics", [...form.topics, topic])
		}
	}

	function handleTopicRemove(topic: string) {
		setField(
			"topics",
			form.topics.filter((t) => t !== topic),
		)
	}

	// ─── File Handler ──────────────────────────────────────────────────────────

	function handleFileChange(file: File | null) {
		setField("file", file)
	}

	// ─── Modal Handlers ───────────────────────────────────────────────────────

	function handleOpenChange(open: boolean) {
		if (!open) onClose()
	}

	function handleContinue() {
		setCurrentStep(Steps.Tasks)
	}

	function handleBack() {
		setCurrentStep(Steps.Discussion)
	}

	function handleSave(taskRows: TaskRow[]) {
		const inputs = taskRows.map((row) => ({
			title: row.title,
			assigneeIds: row.assignee?.id ? [row.assignee.id] : [],
			assigneeDetails: {} as Record<number, string>,
			deadlineType: row.deadlineType as DeadlineType | null,
			dueDate: row.dueDate,
			flagged: row.flagged,
			notes: row.notes ?? "",
			groupKey: String(row.id),
		}))

		saveTasks(inputs, {
			discussionName: form.name.trim(),
			discussionDate: form.sourceDate,
			hasAttachment: form.file !== null,
			tags: form.topics,
		})
		onClose()
	}

	function handleEditConfirm() {
		if (!sourceId) return;
		const data = getChangedFields();
		if (!data) return;

		updateSource(
      { pathParams: { id: sourceId }, data },
			{
        onSuccess: () => {
          setShowConfirmation(false);
					onClose();
				},
				onError: (error) => {
					console.error("updateSource failed:", error);
				},
			},
		);
	}

	function handleEditCancel() {
		setShowConfirmation(false);
	}

	// ─── Render ───────────────────────────────────────────────────────────────

	return (
		<DialogPrimitive.Root open onOpenChange={handleOpenChange}>
			<DialogPrimitive.Portal>
				<Overlay />
				<ModalCard $step={isEditMode ? Steps.Discussion : currentStep}>
					<ModalCloseButton onClick={onClose}>
						<X size={16} />
					</ModalCloseButton>

					<ModalBody>
						<HeaderSection>
							<ModalTitle>
								{isEditMode ? "עריכת פרטי דיון" : "יצירת הנחיות מתוך דיון"}
							</ModalTitle>

							{!isEditMode && (
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
							)}

							{isCurrentStepTasks && !isEditMode && (
								<DiscussionInfoRow>
									<DiscussionInfoText>
										<DiscussionDate>
											{form.sourceDate ? formatDate(form.sourceDate) : ""}
										</DiscussionDate>
										<DiscussionName>{form.name}</DiscussionName>
									</DiscussionInfoText>
									{form.file && <Paperclip size={20} />}
								</DiscussionInfoRow>
							)}
						</HeaderSection>

						{isEditMode || currentStep === Steps.Discussion ? (
							<>
								<FormContainer>
									<SourceField
										source={form.name}
										sourceDate={form.sourceDate}
										linkedSource={null}
										onSourceSelect={handleSourceSelect}
										onDateSelect={handleDateSelect}
										label="שם הדיון"
										uniqueNames
									/>

									<TopicField
										topics={form.topics}
										lockedTopics={[]}
										onTopicSelect={handleTopicSelect}
										onTopicRemove={handleTopicRemove}
									/>

									<FileUploadField
										file={form.file}
										onFileChange={handleFileChange}
									/>
								</FormContainer>

								{isEditMode ? (
									<EditFooter>
										<Popover
											open={showConfirmation}
											onOpenChange={setShowConfirmation}
										>
											<PopoverTrigger asChild>
												<SaveButton
													$disabled={!hasChanges}
													onClick={(e) => {
														if (!hasChanges) {
															e.preventDefault();
														}
													}}
												>
													שמור שינויים
												</SaveButton>
											</PopoverTrigger>
											<ConfirmationContent
												side="top"
												align="start"
												sideOffset={13}
											>
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
								) : (
									<ModalFooter>
										<ContinueButton
											onClick={handleContinue}
											disabled={!form.name.trim()}
										>
											המשך
										</ContinueButton>
									</ModalFooter>
								)}
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

// ─── Form Layout ────────────────────────────────────────────────────────────

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-end;
  flex: 1;
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
`;

// ─── Edit Mode Footer ──────────────────────────────────────────────────────

const EditFooter = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-shrink: 0;
`;

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
  font-size: 16px;
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
`;

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
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: var(--link-bg-hover);
  }
`;

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
`;

const ConfirmationHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex: 1 0 0;
`;

const AlertCircleIcon = styled(AlertCircle)`
  display: flex;
  margin-top: 3px;
  align-items: center;
  gap: 6px;
  color: #faad14;
`;

const ConfirmationTitle = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: var(--sea-ink);
  align-self: stretch;
`;

const ConfirmationText = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--sea-ink);
  align-self: stretch;
`;

const ConfirmationActions = styled.div`
  direction: ltr;
  display: flex;
  align-items: center;
  align-self: stretch;
  gap: 8px;
`;

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
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

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
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  cursor: pointer;

  &:hover {
    background: var(--link-bg-hover);
  }
`;
