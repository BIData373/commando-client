import styled from "@emotion/styled"
import { useForm } from "@tanstack/react-form"
import { useStore } from "@tanstack/react-store"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { useRef, useState } from "react"
import {
	type CreateTaskDto,
	DeadlineType,
	type GetTaskAssigneeDto,
	type SourceDto,
} from "src/api/model"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { useSaveTasks } from "../../hooks/useSaveTasks"
import { CancelButton } from "../shared/CancelButton"
import FlagIcon from "../shared/FlagIcon"
import { FormField } from "../shared/FormField"
import ImportantFlagTooltip from "../shared/ImportantFlagTooltip"
import { PrimaryButton } from "../shared/PrimaryButton"
import { Checkbox } from "../ui/checkbox"
import AssigneeField from "./AssigneeField"
import DeadlineField from "./DeadlineField"
import NotesField from "./NotesField"
import SourceField from "./SourceField"
import TagField from "./TagField"

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState extends Omit<CreateTaskDto, "workspaceId"> {
	source: string
	sourceDate: Date | null
	linkedSource: SourceDto | null
}

// ─── Component ───────────────────────────────────────────────────────────────
interface CreateTaskModalProps {
	onClose: () => void
}

function CreateTaskModal({ onClose }: CreateTaskModalProps) {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	const saveTasks = useSaveTasks()

	const [isDetailsExpanded, setIsDetailsExpanded] = useState(false)

	const form = useForm({
		defaultValues: {
			title: "",
			deadlineType: DeadlineType.DATE,
			dueDate: null,
			flagged: false,
			source: "",
			sourceDate: null,
			tags: [],
			notes: "",
			sourceId: null,
			assignees: [],
			linkedSource: null,
		} as FormState,
		onSubmit: async ({ value: { source, sourceDate, linkedSource, ...rest } }) => {
			await saveTasks([{ workspaceId, ...rest }])
			onClose()
		},
	})

	const values = useStore(form.store, (state) => state.values)

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

		form.setFieldValue(
			"assignees",
			isRemoving ? current.filter((a) => a.id !== id) : [...current, { id }],
		)
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
			(values.assignees ?? []).map(
				(a): GetTaskAssigneeDto =>
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
		if (date) form.setFieldValue("sourceDate", date)
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

	function handleToggleDetails() {
		setIsDetailsExpanded((prev) => !prev)
	}

	function handleNotesChange(value: string) {
		form.setFieldValue("notes", value)
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

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			onClose()
		}
	}

	// ─── Render ────────────────────────────────────────────────────────────────

	return (
		<DialogPrimitive.Root open onOpenChange={handleOpenChange}>
			<DialogPrimitive.Portal>
				<Overlay />
				<ModalCard>
					<ModalCloseButton onClick={onClose}>
						<X size={16} />
					</ModalCloseButton>

					<ModalBody>
						<ModalHeader $shadow={scrollShadow.top}>
							<ModalTitle>יצירת הנחיה</ModalTitle>
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
								/>

								{/* ─── Responsible ─────────────────────────────────────────── */}
								<AssigneeField
									selectedAssignees={(values.assignees ?? []).map((a) => a.id)}
									directiveTitle={values.title}
									onToggle={handleAssigneeToggle}
									onRemove={handleRemoveAssignee}
									onDetailChange={handleAssigneeDetailChange}
								/>

								{/* ─── Important Checkbox ──────────────────────────────────── */}
								<form.Field name="flagged">
									{(field) => (
										<ImportantRow>
											<ImportantFlagTooltip side="left" />
											<FlagIcon />
											<CheckboxRow>
												<CheckboxLabelText>הגדר כהנחיה חשובה</CheckboxLabelText>
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

								{/* ─── Expand / Collapse Divider ──────────────────────────── */}
								<DividerRow>
									<DividerLine />
									<ExpandButton onClick={handleToggleDetails}>
										{isDetailsExpanded ? (
											<ChevronUp size={16} />
										) : (
											<ChevronDown size={16} />
										)}
										<ExpandButtonText $expanded={isDetailsExpanded}>
											פרטים נוספים
										</ExpandButtonText>
									</ExpandButton>
									<DividerLine />
								</DividerRow>

								{/* ─── Additional Details ─────────────────────────────────── */}
								<AdditionalDetailsWrapper
									$expanded={isDetailsExpanded}
									aria-hidden={!isDetailsExpanded}
								>
									<AdditionalDetails>
										{/* Source + Date row */}
										<SourceField
											source={values.source}
											sourceDate={values.sourceDate}
											linkedSource={values.linkedSource}
											onSourceSelect={handleSourceSelect}
											onDateSelect={handleSourceDateSelect}
										/>

										{/* Tag field */}
										<TagField
											tags={values.tags ?? []}
											lockedTags={
												values.linkedSource?.tags.map((t) => t.name) ?? []
											}
											onTagSelect={handleTagSelect}
											onTagRemove={handleTagRemove}
										/>

										{/* Notes */}
										<NotesField
											notes={values.notes ?? ""}
											onNotesChange={handleNotesChange}
										/>
									</AdditionalDetails>
								</AdditionalDetailsWrapper>
							</FormContainer>
						</ScrollableContent>

						{/* ─── Action Buttons ──────────────────────────────────────── */}
						<ActionRow $shadow={scrollShadow.bottom}>
							<PrimaryButton
								title="שמור"
								onClick={form.handleSubmit}
								disabled={!values.title.trim()}
								width={133}
							/>
							<CancelButton title="ביטול" onClick={onClose} />
						</ActionRow>
					</ModalBody>
				</ModalCard>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	)
}

export default CreateTaskModal

// ─── Modal Shell ─────────────────────────────────────────────────────────────

const Overlay = styled(DialogPrimitive.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1px);
  z-index: var(--z-dropdown);
`

const ModalCard = styled(DialogPrimitive.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 900px;
  max-height: 82vh;
  min-height: 800px;
  overflow: hidden;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  box-shadow:
    0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px rgba(0, 0, 0, 0.12),
    0px 9px 28px rgba(0, 0, 0, 0.05);
  z-index: var(--z-dropdown);
  display: flex;
  flex-direction: column;
  padding-block-start: 36px;
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
    color: rgba(0, 0, 0, 0.88);
    background: rgba(0, 0, 0, 0.04);
  }
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
  box-shadow: ${({ $shadow }) => ($shadow ? "0px 10px 20px 0px rgba(0, 0, 0, 0.06)" : "none")};
`

const ScrollableContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-block-end: 24px;
  padding-inline-end: 24px;
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
  font-size: 42px;
  line-height: 50px;
  color: black;
  margin: 0;
`

// ─── Directive Textarea ──────────────────────────────────────────────────────

const DirectiveTextarea = styled.textarea`
  width: 100%;
  height: 60px;
  padding: 4px 11px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: white;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.88);
  resize: none;
  outline: none;
  box-sizing: border-box;
  overflow-y: auto;

  &::placeholder {
    color: rgba(0, 0, 0, 0.25);
  }

  &:focus {
    border-color: #4096ff;
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
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
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
  cursor: pointer;
`

// ─── Divider ─────────────────────────────────────────────────────────────────

const DividerRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: #d9d9d9;
`

const ExpandButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 32px;
  padding-inline: 15px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`

const ExpandButtonText = styled.span<{ $expanded: boolean }>`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: ${({ $expanded }) => ($expanded ? "rgba(0, 0, 0, 0.25)" : "#1677ff")};
  white-space: nowrap;
`

// ─── Additional Details ──────────────────────────────────────────────────────

const AdditionalDetailsWrapper = styled.div<{ $expanded: boolean }>`
  display: grid;
  width: 100%;
  grid-template-rows: ${({ $expanded }) => ($expanded ? "1fr" : "0fr")};
  opacity: ${({ $expanded }) => ($expanded ? 1 : 0)};
  transition: grid-template-rows 280ms ease, opacity 220ms ease;

  & > * {
    min-height: 0;
    overflow: ${({ $expanded }) => ($expanded ? "visible" : "hidden")};
  }
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
