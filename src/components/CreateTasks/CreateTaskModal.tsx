import styled from "@emotion/styled"
import { useForm } from "@tanstack/react-form"
import { useStore } from "@tanstack/react-store"
import { omit, uniq } from "lodash"
import { useRef, useState } from "react"
import {
	type CreateTaskDto,
	DeadlineType,
	type GetTaskAssigneeDto,
	type SourceDto,
	type TaskWithWorkspaceDto,
	WorkspaceStatusType,
} from "src/api/model"
import { getListSourcesQueryKey, useCreateSource } from "src/api/source/source"
import {
	getGetTaskQueryKey,
	getListPersonalTaskRowsQueryKey,
	getListTaskRowsQueryKey,
	useUpdateTask,
} from "src/api/task/task"
import { useListWorkspaceStatuses } from "src/api/workspace-status/workspace-status"
import { invalidateQueries } from "src/queryClient"
import { getImmediateReferenceDate } from "src/utils/deadline-utils"
import { getChangedFields } from "src/utils/form-utils"
import { useSaveTasks } from "../../hooks/useSaveTasks"
import { CancelButton } from "../shared/CancelButton"
import FlagIcon from "../shared/FlagIcon"
import { FormField } from "../shared/FormField"
import ImportantFlagTooltip from "../shared/ImportantFlagTooltip"
import { ModalContent } from "../shared/ModalContent"
import { PrimaryButton } from "../shared/PrimaryButton"
import TagField from "../TagField/TagField"
import { Checkbox } from "../ui/checkbox"
import { Dialog } from "../ui/dialog"
import AssigneeField from "./AssigneeField"
import DeadlineField from "./DeadlineField"
import NotesField from "./NotesField"
import SourceField from "./SourceField"

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormAssignee extends GetTaskAssigneeDto {
	statusId?: number
	editable?: boolean
}

interface FormState extends Omit<CreateTaskDto, "workspaceId" | "assignees"> {
	source: string
	sourceDate: Date | null
	linkedSource: SourceDto | null
	assignees: FormAssignee[]
}

// ─── Component ───────────────────────────────────────────────────────────────
interface CreateTaskModalProps {
	workspaceId: number
	onClose(): void
	onCancel(): void
	onSave?(): void
	task?: TaskWithWorkspaceDto
}

function CreateTaskModal({
	workspaceId,
	onClose,
	onSave,
	onCancel,
	task,
}: CreateTaskModalProps) {
	const isEditMode = !!task

	const { data: workspaceStatuses = [] } = useListWorkspaceStatuses({
		workspaceId,
	})
	const statusById = Object.fromEntries(workspaceStatuses.map((s) => [s.id, s]))

	const { saveTasks, isPending } = useSaveTasks(workspaceId, onClose)

	const { mutateAsync: createSource } = useCreateSource({
		mutation: {
			onSuccess: () => {
				invalidateQueries([getListSourcesQueryKey({ workspaceId })])
			},
		},
	})
	const { mutateAsync: updateTask } = useUpdateTask({
		mutation: {
			onSuccess: handleUpdateSuccess,
		},
	})

	function handleUpdateSuccess() {
		invalidateQueries([
			getListTaskRowsQueryKey({ workspaceId }),
			...(task ? [getGetTaskQueryKey({ id: task.id })] : []),
			getListPersonalTaskRowsQueryKey(),
		])

		onSave?.()
	}

	const form = useForm({
		defaultValues: {
			title: task?.title ?? "",
			deadlineType: task?.deadlineType ?? DeadlineType.DATE,
			dueDate: task?.dueDate ?? null,
			flagged: task?.flagged ?? false,
			source: task?.source?.name ?? "",
			sourceDate: task?.source?.date ?? null,
			tags: task?.tags.map((t) => t.name) ?? [],
			notes: task?.notes ?? "",
			sourceId: task?.source?.id ?? null,
			assignees:
				task?.assigneeStatuses.map((as) => ({
					id: as.assignee.id,
					description: as.description || undefined,
					statusId: as.status.id,
					editable: as.editable,
				})) ?? [],
			linkedSource: task?.source ?? null,
		} as FormState,
		onSubmit: async ({
			value: { source, sourceDate, linkedSource, ...rest },
		}) => {
			rest.assignees = (rest.assignees ?? []).map((assignee) =>
				omit(assignee, "editable"),
			)

			if (isEditMode) {
				const changedFields = omit(getChangedFields<FormState>(form), [
					"source",
					"sourceDate",
					"linkedSource",
				])

				if (source && !linkedSource) {
					const newSource = await createSource({
						data: { workspaceId, name: source, date: sourceDate },
					})
					changedFields.sourceId = newSource.id
				}

				await updateTask({ pathParams: { id: task.id }, data: changedFields })
			} else {
				if (source.trim() && !linkedSource) {
					const newSource = await createSource({
						data: { workspaceId, name: source, date: sourceDate },
					})
					rest.sourceId = newSource.id
				}
				saveTasks([{ workspaceId, ...rest }])
				onClose()
			}
		},
	})

	const values = useStore(form.store, (state) => state.values)
	const hasChanges = !form.state.isDefaultValue

	// ─── Handlers ──────────────────────────────────────────────────────────────

	function handleDeadlineTypeChange(type: DeadlineType) {
		form.setFieldValue("deadlineType", type)
		if (type === DeadlineType.IMMEDIATE) {
			form.setFieldValue("dueDate", null)
		}
	}

	function handleDeadlineDateChange(date: Date | null) {
		form.setFieldValue("dueDate", date)
	}

	function handleAssigneeToggle(id: number) {
		const current = values.assignees ?? []
		const isRemoving = current.some((a) => a.id === id)

		if (isRemoving) {
			form.setFieldValue(
				"assignees",
				current.filter((a) => a.id !== id),
			)
		} else {
			const defaultStatusId = isEditMode
				? Object.values(statusById).find(
						(s) => s.type === WorkspaceStatusType.NOT_STARTED,
					)?.id
				: undefined
			form.setFieldValue("assignees", [
				...current,
				{ id, statusId: defaultStatusId },
			])
		}
	}

	function handleRemoveAssignee(id: number) {
		form.setFieldValue(
			"assignees",
			(values.assignees ?? []).filter((a) => a.id !== id),
		)
	}

	function handleAssigneeDetailChange(id: number, value: string) {
		form.setFieldValue(
			"assignees",
			(values.assignees ?? []).map((a) =>
				a.id === id ? { ...a, description: value } : a,
			),
		)
	}

	function handleSourceSelect(name: string, discussion?: SourceDto | null) {
		if (discussion) {
			const discussionTagNames = discussion.tags.map((t) => t.name)
			const mergedTags = [
				...new Set([...(values.tags ?? []), ...discussionTagNames]),
			]
			form.setFieldValue("source", discussion.name)
			form.setFieldValue("sourceDate", discussion.date)
			form.setFieldValue("tags", mergedTags)
			form.setFieldValue("linkedSource", discussion)
			form.setFieldValue("sourceId", discussion.id)
			return
		}
		const prevLinkedTagNames =
			values.linkedSource?.tags.map((t) => t.name) ?? []

		form.setFieldValue("source", name)
		form.setFieldValue("sourceDate", null)

		form.setFieldValue(
			"tags",
			(values.tags ?? []).filter((t) => !prevLinkedTagNames.includes(t)),
		)

		form.setFieldValue("linkedSource", null)
		form.setFieldValue("sourceId", null)
	}

	function handleSourceDateSelect(date: Date | undefined) {
		if (date) {
			form.setFieldValue("sourceDate", date)
		}
	}

	function handleTagSelect(tag: string) {
		if (!values.tags?.includes(tag)) {
			form.setFieldValue("tags", [...(values.tags ?? []), tag])
		}
	}

	function handleTagRemove(tag: string) {
		form.setFieldValue(
			"tags",
			(values.tags ?? []).filter((t) => t !== tag),
		)
	}

	function handleNotesChange(value: string) {
		form.setFieldValue("notes", value)
	}

	function handleAssigneeStatusChange(
		_taskId: number,
		assigneeId: number,
		statusId: number,
	) {
		form.setFieldValue(
			"assignees",
			(values.assignees ?? []).map((a) =>
				a.id === assigneeId ? { ...a, statusId } : a,
			),
		)
	}

	// ─── Scroll Shadow ─────────────────────────────────────────────────────────

	const scrollRef = useRef<HTMLDivElement>(null)
	const [scrollShadow, setScrollShadow] = useState({
		top: false,
		bottom: false,
	})

	function handleScroll() {
		const el = scrollRef.current
		if (!el) {
			return
		}

		const atTop = el.scrollTop <= 0
		const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
		setScrollShadow({ top: !atTop, bottom: !atBottom })
	}

	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			onClose()
		}
	}

	const linkedTagNames = values.linkedSource?.tags.map((t) => t.name) ?? []
	const mergedTags = uniq([...linkedTagNames, ...(values.tags ?? [])])

	const assigneeExtras = isEditMode
		? Object.fromEntries(
				(values.assignees ?? []).map((a) => [
					a.id,
					{
						status: a.statusId != null ? statusById[a.statusId] : undefined,
						description: a.description,
						editable: a.editable ?? false,
					},
				]),
			)
		: undefined

	function validateSourceDate({ value }: { value: Date | null }) {
		const { source, linkedSource } = form.state.values
		if (source.trim() && !linkedSource && !value) {
			return "יש לבחור תאריך למקור חדש"
		}
		return undefined
	}

	// ─── Render ────────────────────────────────────────────────────────────────

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<ModalCard closable={!hasChanges}>
				<ModalBody>
					<ModalHeader $shadow={scrollShadow.top}>
						<ModalTitle>
							{isEditMode ? "עריכת הנחיה" : "יצירת הנחיה"}
						</ModalTitle>
					</ModalHeader>

					<ScrollableContent ref={scrollRef} onScroll={handleScroll}>
						<FormContainer>
							{/* ─── Directive Name ──────────────────────────────────────── */}
							<form.Field
								name="title"
								validators={{
									onSubmit: ({ value }) =>
										!value.trim() ? "הנחיה היא שדה חובה" : undefined,
								}}
							>
								{(field) => (
									<FormField field={field} label="הנחיה" required>
										<DirectiveTextarea
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="תיאור הנחיה"
											dir="rtl"
										/>
									</FormField>
								)}
							</form.Field>

							{/* ─── Deadline ────────────────────────────────────────────── */}
							<DeadlineField
								deadlineType={values.deadlineType}
								dueDate={values.dueDate ?? null}
								onDeadlineTypeChange={handleDeadlineTypeChange}
								onDateChange={handleDeadlineDateChange}
								isEditMode={isEditMode}
								immediateDate={
									task
										? getImmediateReferenceDate(task.source, task.createdAt)
										: null
								}
							/>

							{/* ─── Responsible ─────────────────────────────────────────── */}
							<AssigneeField
								workspaceId={workspaceId}
								selectedAssignees={(values.assignees ?? []).map((a) => a.id)}
								directiveTitle={values.title}
								onToggle={handleAssigneeToggle}
								onRemove={handleRemoveAssignee}
								onDetailChange={handleAssigneeDetailChange}
								assigneeExtras={assigneeExtras}
								onStatusChange={
									isEditMode ? handleAssigneeStatusChange : undefined
								}
								taskId={task?.id}
							/>

							{/* ─── Important Checkbox ──────────────────────────────────── */}
							<form.Field name="flagged">
								{(field) => (
									<ImportantRow>
										<ImportantFlagTooltip side="left" />
										<FlagIcon />
										<CheckboxRow>
											<CheckboxLabelText>הגדר כהנחיה במיקוד</CheckboxLabelText>
											<Checkbox
												checked={field.state.value}
												onCheckedChange={(checked) =>
													field.handleChange(checked === true)
												}
											/>
										</CheckboxRow>
									</ImportantRow>
								)}
							</form.Field>

							{/* ─── Additional Details ─────────────────────────────────── */}
							<AdditionalDetailsWrapper>
								<AdditionalDetails>
									{/* Notes */}
									<NotesField
										notes={values.notes ?? ""}
										onNotesChange={handleNotesChange}
									/>

									{/* Tag field */}
									<TagField
										workspaceId={workspaceId}
										tags={mergedTags}
										lockedTags={linkedTagNames}
										onTagSelect={handleTagSelect}
										onTagRemove={handleTagRemove}
									/>

									{/* Source + Date row */}
									<form.Field
										name="sourceDate"
										validators={{ onSubmit: validateSourceDate }}
									>
										{(field) => (
											<SourceField
												workspaceId={workspaceId}
												label="שייך למקור"
												source={values.source}
												sourceDate={values.sourceDate}
												linkedSource={values.linkedSource}
												onSourceSelect={handleSourceSelect}
												onDateSelect={handleSourceDateSelect}
												fields={{ date: field }}
												hideDateLabel
											/>
										)}
									</form.Field>
								</AdditionalDetails>
							</AdditionalDetailsWrapper>
						</FormContainer>
					</ScrollableContent>

					{/* ─── Action Buttons ──────────────────────────────────────── */}
					<ActionRow $shadow={scrollShadow.bottom}>
						<PrimaryButton
							title="שמור"
							onClick={form.handleSubmit}
							disabled={!values.title.trim() || (isEditMode && !hasChanges)}
							loading={isPending}
							width={133}
						/>
						<CancelButton title="ביטול" onClick={onCancel} />
					</ActionRow>
				</ModalBody>
			</ModalCard>
		</Dialog>
	)
}

export default CreateTaskModal

// ─── Modal Shell ─────────────────────────────────────────────────────────────

const ModalCard = styled(ModalContent)`
  width: 100%;
  max-width: 900px;
  max-height: 82vh;
  min-height: 850px;
  overflow: hidden;
`

const ModalBody = styled.div`
  direction: ltr;
  display: flex;
  flex-direction: column;
  padding-inline: 48px;
  padding-block-end: 36px;
  min-height: 0;
  flex: 1;
`

const ModalHeader = styled.div<{ $shadow: boolean }>`
  display: flex;
  justify-content: flex-end;
  padding-block-end: 24px;
  flex-shrink: 0;
  transition: box-shadow 200ms ease;
  position: relative;
  z-index: 1;
  clip-path: inset(0 0 -20px 0);
  box-shadow: ${({ $shadow }) => ($shadow ? "var(--shadow-modal-header)" : "none")};
`

const ScrollableContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
`

// ─── Form Layout ─────────────────────────────────────────────────────────────

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-end;
`

const ModalTitle = styled.h1`
  font-weight: 600;
  font-size: var(--fs-heading-h1);
  line-height: 50px;
  color: var(--text-color-2);
  margin: 0;
`

// ─── Directive Textarea ──────────────────────────────────────────────────────

const DirectiveTextarea = styled.textarea`
  width: 100%;
  height: 60px;
  padding: 4px 11px;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  background: var(--background);
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 24px;
  color: var(--text-color-2);
  resize: none;
  outline: none;
  box-sizing: border-box;
  overflow-y: auto;

  &::placeholder {
    color: var(--Text-color-text-placeholder);
  }

  &:focus {
    border-color: var(--button-color-hover);
    box-shadow: var(--shadow-textarea-focus);
  }
`

// ─── Important Checkbox ──────────────────────────────────────────────────────

const ImportantRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`

const CheckboxLabelText = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  white-space: nowrap;
  cursor: pointer;
`

// ─── Additional Details ──────────────────────────────────────────────────────

const AdditionalDetailsWrapper = styled.div`
  width: 100%;
`

const AdditionalDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
  width: 100%;
`

// ─── Bottom Actions ──────────────────────────────────────────────────────────
const ActionRow = styled.div<{ $shadow: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  padding-block-start: 16px;
  position: relative;
  z-index: 1;
  clip-path: inset(-20px 0 0 0);
  transition: box-shadow 200ms ease;
  box-shadow: ${({ $shadow }) => ($shadow ? "0px -10px 20px 0px rgba(0, 0, 0, 0.06)" : "none")};
`
