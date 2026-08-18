import styled from "@emotion/styled"
import { useForm } from "@tanstack/react-form"
import { useNavigate } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
import { Check, Paperclip, Sparkles } from "lucide-react"
import { lazy, Suspense, useEffect, useState } from "react"
import { LoadingSpinner } from "src/components/shared/LoadingSpinner"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { AI_ENABLED } from "src/utils/env-utils"
import {
	type CreateSourceDto,
	DeadlineType,
	TaskCreationType,
	type UpdateSourceDto,
} from "../../api/model"
import {
	getListSourcesQueryKey,
	useCreateSource,
	useGetSource,
	useUpdateSource,
} from "../../api/source/source"
import {
	getListPersonalTaskRowsQueryKey,
	getListTaskRowsQueryKey,
	useDeleteTask,
} from "../../api/task/task"
import { formatDate } from "../../functions/date-utils"
import { useSaveTasks } from "../../hooks/useSaveTasks"
import { invalidateQueries } from "../../queryClient"
import { ModalContent } from "../shared/ModalContent"
import { Dialog } from "../ui/dialog"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip"
import DiscussionForm from "./DiscussionForm"
import type { NewTaskRow } from "./TasksColumns"

const CreateTasksTable = lazy(() => import("./CreateTasksTable"))

// ─── Types ──────────────────────────────────────────────────────────────────

enum Steps {
	Discussion = 1,
	Tasks = 2,
}

interface CreateDiscussionModalProps {
	onClose: () => void
	sourceId?: number
}

// ─── Component ──────────────────────────────────────────────────────────────

function CreateDiscussionModal({
	onClose,
	sourceId,
}: CreateDiscussionModalProps) {
	const navigate = useNavigate({ from: "/workspace/$urlName/tasks/new" })
	const { mutateAsync: createSource, isPending: isCreateSource } =
		useCreateSource({
			mutation: {
				onSuccess: () => {
					invalidateQueries([
						getListTaskRowsQueryKey({ workspaceId }),
						getListPersonalTaskRowsQueryKey(),
						getListSourcesQueryKey({ workspaceId }),
					])
				},
			},
		})
	const { mutateAsync: updateSource, isPending: isUpdateSource } =
		useUpdateSource({
			mutation: {
				onSuccess: () => {
					invalidateQueries([getListSourcesQueryKey({ workspaceId })])
				},
			},
		})
	const { mutate: deleteTask } = useDeleteTask()
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()
	const { saveTasks, isPending: isCreateTasks } = useSaveTasks(
		workspaceId,
		onClose,
	)

	const { data: source } = useGetSource(
		{ id: sourceId ?? 0 },
		{ query: { enabled: sourceId !== undefined } },
	)

	const [step, setStep] = useState<Steps>(
		sourceId ? Steps.Tasks : Steps.Discussion,
	)
	const [tasksStepReached, setTasksStepReached] = useState(step === Steps.Tasks)

	const defaultValues: CreateSourceDto = {
		workspaceId,
		name: "",
		date: null,
		tags: [],
		attachment: sourceId ? undefined : null,
	}

	const form = useForm({
		defaultValues,
		onSubmitMeta: { aiExtraction: false } as Partial<UpdateSourceDto>,
		onSubmit: async ({ meta }) => {
			await createAndAdvance(!!meta.aiExtraction)
		},
	})

	const values = useStore(form.store, (state) => state.values)

	useEffect(() => {
		if (step === Steps.Tasks) setTasksStepReached(true)
	}, [step])

	useEffect(() => {
		if (!source) return
		form.setFieldValue("name", source.name)
		form.setFieldValue("date", source.date)
		form.setFieldValue(
			"tags",
			source.tags.map((tag) => tag.name),
		)
	}, [source?.id])

	const isCurrentStepTasks = step === Steps.Tasks
	const isDiscussionIncomplete = !values.name.trim() || !values.date
	const hasAttachment =
		values.attachment === undefined
			? !!source?.attachmentKey
			: !!values.attachment
	const alreadyExtracted = source?.extractionStatus != null
	const isAiExtractDisabled =
		isDiscussionIncomplete ||
		!hasAttachment ||
		alreadyExtracted ||
		isCreateSource ||
		isUpdateSource

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
		form.handleSubmit({ aiExtraction: false })
	}

	function handleAiExtract() {
		form.handleSubmit({ aiExtraction: true })
	}

	function handleBack() {
		setStep(Steps.Discussion)
	}

	async function createAndAdvance(aiExtraction: boolean) {
		if (!aiExtraction && sourceId === undefined) {
			setStep(Steps.Tasks)
			return
		}

		try {
			const source = sourceId
				? await updateSource({
						pathParams: { id: sourceId },
						data: { ...values, aiExtraction },
					})
				: await createSource({ data: { ...values, aiExtraction } })
			navigate({ search: (prev) => ({ ...prev, sourceId: source.id }) })
			setStep(Steps.Tasks)
		} catch (error) {
			console.error("createSource failed:", error)
		}
	}

	function resolveCreationType(
		taskId: number | undefined,
		touched: boolean | undefined,
	): TaskCreationType {
		if (taskId === undefined) return TaskCreationType.HUMAN
		return touched ? TaskCreationType.AI_HUMAN : TaskCreationType.AI
	}

	async function handleSave(taskRows: NewTaskRow[]) {
		if (sourceId === undefined) {
			await createSource({
				data: {
					...values,
					tasks: taskRows.map(
						({
							title,
							deadlineType,
							dueDate,
							notes,
							flagged,
							assigneeIds,
							assigneeDetails,
						}) => ({
							title: title.trim(),
							deadlineType: deadlineType ?? DeadlineType.ROLLING,
							dueDate: dueDate ?? null,
							notes: notes || undefined,
							flagged,
							assignees: assigneeIds.map((assigneeId) => ({
								id: assigneeId,
								description: assigneeDetails[assigneeId] || undefined,
							})),
						}),
					),
				},
			})

			onClose()
		} else {
			const inputs = taskRows.map(
				({
					id,
					rowKey,
					assigneeIds,
					assigneeDetails,
					touched,
					taskId,
					...rest
				}) => ({
					...rest,
					taskId,
					workspaceId,
					sourceId,
					groupKey: String(id),
					creationType: resolveCreationType(taskId, touched),
					assignees: assigneeIds.map((assigneeId) => ({
						id: assigneeId,
						description: assigneeDetails[assigneeId] || undefined,
					})),
				}),
			)

			await updateSource({
				pathParams: { id: sourceId },
				data: { draft: false },
			})

			saveTasks(inputs)
		}
	}

	function handleDeleteRow(row: NewTaskRow) {
		if (row.taskId === undefined) return
		deleteTask({ pathParams: { id: row.taskId } })
	}

	function validateName({ value }: { value: string }) {
		return !value.trim() ? "יש להזין שם דיון" : undefined
	}

	function validateDate({ value }: { value: Date | null | undefined }) {
		return !value ? "יש לבחור תאריך" : undefined
	}

	// ─── Render ───────────────────────────────────────────────────────────────

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<ModalCard $step={step} closable={false}>
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
								<StepLabel $active={isCurrentStepTasks}>יצירת הנחיות</StepLabel>
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

					<StepPane $active={!isCurrentStepTasks}>
						<form.Field name="name" validators={{ onSubmit: validateName }}>
							{(nameField) => (
								<form.Field name="date" validators={{ onSubmit: validateDate }}>
									{(dateField) => (
										<DiscussionForm
											workspaceId={workspaceId}
											form={values}
											onNameChange={handleNameChange}
											onDateChange={handleDateChange}
											onTagSelect={handleTagSelect}
											onTagRemove={handleTagRemove}
											onFileChange={handleFileChange}
											existingAttachmentKey={source?.attachmentKey}
											existingAttachmentName={source?.attachmentName}
											fields={{ name: nameField, date: dateField }}
										/>
									)}
								</form.Field>
							)}
						</form.Field>

						<ModalFooter>
							<ContinueButton
								onClick={handleContinue}
								disabled={isDiscussionIncomplete}
							>
								המשך
							</ContinueButton>

							{AI_ENABLED && (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<AiExtractButton
												onClick={handleAiExtract}
												disabled={isAiExtractDisabled}
											>
												חילוץ הנחיות אוטומטי
												<Sparkles size={16} />
											</AiExtractButton>
										</TooltipTrigger>

										<TooltipContent>
											{alreadyExtracted
												? "המסמך הזה כבר חולץ"
												: "בהעלאת סיכום דיון ניתן לחלץ הנחיות באמצעות AI. עובד בקובץ DOCX"}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
						</ModalFooter>
					</StepPane>

					<StepPane $active={isCurrentStepTasks}>
						{tasksStepReached && (
							<Suspense fallback={<LoadingSpinner />}>
								<CreateTasksTable
									onSave={handleSave}
									onDeleteRow={handleDeleteRow}
									onBack={handleBack}
									isLoading={isCreateTasks || isCreateSource || isUpdateSource}
									sourceId={sourceId}
								/>
							</Suspense>
						)}
					</StepPane>
				</ModalBody>
			</ModalCard>
		</Dialog>
	)
}

export default CreateDiscussionModal

// ─── Modal Shell ────────────────────────────────────────────────────────────

const ModalCard = styled(ModalContent)<{ $step: Steps }>`
  width: 100%;
  max-width: ${({ $step }) =>
		$step === Steps.Discussion ? "753px" : "min(1550px, 95vw)"};
  transition: max-width 300ms ease;
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

const StepPane = styled.div<{ $active: boolean }>`
  display: ${({ $active }) => ($active ? "contents" : "none")};
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
  font-size: var(--fs-xl);
  font-weight: 400;
  line-height: 28px;
  color: var(--foreground);
`

const DiscussionDate = styled.span`
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 24px;
  color: var(--foreground);
`

// ─── Footer ─────────────────────────────────────────────────────────────────

const ModalFooter = styled.div`
  direction: ltr;
  display: flex;
  align-items: center;
  gap: 12px;
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
  font-size: var(--fs-base);
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

const AiExtractButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding-inline: 16px;
  border-radius: 8px;
  border: 1px solid #6866ff;
  background: transparent;
  color: #6866ff;
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 24px;
  cursor: pointer;
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: rgba(var(--purple-accent-rgb), 0.06);
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
  font-size: var(--fs-btn);
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
  font-size: var(--fs-btn);
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
