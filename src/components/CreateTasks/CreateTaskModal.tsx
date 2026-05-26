import styled from '@emotion/styled'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { useRef, useState } from 'react'
import type { FormState } from '../../data/CreateTaskForm'
import { INITIAL_FORM } from '../../data/CreateTaskForm'
import { CancelButton } from '../shared/CancelButton'
import FlagIcon from '../shared/FlagIcon'
import { PrimaryButton } from '../shared/PrimaryButton'
import { Checkbox } from '../ui/checkbox'
import AssigneeField from './AssigneeField'
import { Dialog as DialogPrimitive } from 'radix-ui'
import ImportantFlagTooltip from '../shared/ImportantFlagTooltip'
import DeadlineField from './DeadlineField'
import SourceField from './SourceField'
import TopicField from './TopicField'
import NotesField from './NotesField'
import type { DiscussionSource } from './SourceField'
import { useSaveTasks } from '../../hooks/useSaveTasks'
import { DeadlineType } from '../shared/DeadlineTag'
import { formatDate, parseDate } from '../../functions/date-utils'

// ─── Component ───────────────────────────────────────────────────────────────
interface CreateTaskModalProps {
  onClose: () => void
}

function CreateTaskModal({ onClose }: CreateTaskModalProps) {
  const saveTasks = useSaveTasks()
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function handleTitleChange(value: React.ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) {
    setField('title', value.target.value)
  }

  function handleDeadlineTypeChange(type: DeadlineType) {
    setField('deadlineType', type)
    if (type === DeadlineType.Immediate) {
      setField('dueDate', null)
    }
  }

  function handleDeadlineDateChange(date: Date | null) {
    setField('dueDate', date)
  }

  function handleAssigneeToggle(id: number) {
    setForm((prev) => {
      const isRemoving = prev.selectedAssignees.includes(id)
      const nextAssignees = isRemoving
        ? prev.selectedAssignees.filter((a) => a !== id)
        : [...prev.selectedAssignees, id]
      const nextDetails = { ...prev.assigneeDetails }
      if (isRemoving) {
        delete nextDetails[id]
      }
      return { ...prev, selectedAssignees: nextAssignees, assigneeDetails: nextDetails }
    })
  }

  function handleRemoveAssignee(id: number) {
    setForm((prev) => {
      const nextDetails = { ...prev.assigneeDetails }
      delete nextDetails[id]
      return {
        ...prev,
        selectedAssignees: prev.selectedAssignees.filter((a) => a !== id),
        assigneeDetails: nextDetails,
      }
    })
  }

  function handleAssigneeDetailChange(id: number, value: string) {
    setForm((prev) => ({
      ...prev,
      assigneeDetails: { ...prev.assigneeDetails, [id]: value },
    }))
  }

  function handleIsImportantCheckedChange(checked: boolean) {
    setField('isImportant', checked === true)
  }

  function handleSourceSelect(name: string, discussion?: DiscussionSource | null) {
    setForm((prev) => {
      if (discussion) {
        const mergedTopics = [...new Set([...prev.topics, ...discussion.tags])]
        return {
          ...prev,
          source: discussion.name,
          sourceDate: parseDate(discussion.date),
          topics: mergedTopics,
          linkedSource: discussion,
        }
      }

      const prevLinkedTags = prev.linkedSource?.tags ?? []
      const topicsWithoutPrevSource = prev.topics.filter((t) => !prevLinkedTags.includes(t))
      return {
        ...prev,
        source: name,
        sourceDate: null,
        topics: topicsWithoutPrevSource,
        linkedSource: null,
      }
    })
  }

  function handleSourceDateSelect(date: Date | undefined) {
    if (date) {
      setField('sourceDate', date)
    }
  }

  function handleTopicSelect(topic: string) {
    if (!form.topics.includes(topic)) {
      setField('topics', [...form.topics, topic])
    }
  }

  function handleTopicRemove(topic: string) {
    setField('topics', form.topics.filter((t) => t !== topic))
  }

  function handleToggleDetails() {
    setField('isDetailsExpanded', !form.isDetailsExpanded)
  }

  function handleSave() {
    saveTasks(
      [{
        title: form.title,
        assigneeIds: form.selectedAssignees,
        assigneeDetails: form.assigneeDetails,
        deadlineType: form.deadlineType,
        dueDate: form.dueDate,
        isImportant: form.isImportant,
        notes: form.notes,
      }],
      {
        discussionName: form.source.trim(),
        discussionDate: form.sourceDate ? formatDate(form.sourceDate) : '',
        hasAttachment: form.linkedSource?.hasAttachment ?? false,
        tags: form.topics,
      },
    )
    onClose()
  }

  function handleNotesChange(value: string) {
    setField('notes', value)
  }

  // ─── Scroll Shadow ─────────────────────────────────────────────────────────

  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollShadow, setScrollShadow] = useState({ top: false, bottom: false })

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const atTop = el.scrollTop <= 0
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
    setScrollShadow({ top: !atTop, bottom: !atBottom })
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose()
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
                <FormItem>
                  <FormLabelRow>
                    <RequiredMark>*</RequiredMark>
                    <LabelText>הנחיה</LabelText>
                  </FormLabelRow>
                  <DirectiveTextarea
                    value={form.title}
                    onChange={handleTitleChange}
                    placeholder="תיאור הנחיה"
                    dir="rtl"
                  />
                </FormItem>

                {/* ─── Deadline ────────────────────────────────────────────── */}
                <DeadlineField
                  deadlineType={form.deadlineType}
                  dueDate={form.dueDate}
                  onDeadlineTypeChange={handleDeadlineTypeChange}
                  onDateChange={handleDeadlineDateChange}
                />

                {/* ─── Responsible ─────────────────────────────────────────── */}
                <AssigneeField
                  selectedAssignees={form.selectedAssignees}
                  directiveTitle={form.title}
                  onToggle={handleAssigneeToggle}
                  onRemove={handleRemoveAssignee}
                  onDetailChange={handleAssigneeDetailChange}
                />

                {/* ─── Important Checkbox ──────────────────────────────────── */}
                <ImportantRow>
                  <ImportantFlagTooltip side="left" />
                  <FlagIcon/>
                  <CheckboxRow>
                    <CheckboxLabelText>הגדר כהנחיה חשובה</CheckboxLabelText>
                    <Checkbox
                      checked={form.isImportant}
                      onCheckedChange={handleIsImportantCheckedChange}
                    />
                  </CheckboxRow>
                </ImportantRow>

                {/* ─── Expand / Collapse Divider ──────────────────────────── */}
                <DividerRow>
                  <DividerLine />
                  <ExpandButton onClick={handleToggleDetails}>
                    {form.isDetailsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    <ExpandButtonText $expanded={form.isDetailsExpanded}>
                      פרטים נוספים
                    </ExpandButtonText>
                  </ExpandButton>
                  <DividerLine />
                </DividerRow>

                {/* ─── Additional Details ─────────────────────────────────── */}
                <AdditionalDetailsWrapper $expanded={form.isDetailsExpanded} aria-hidden={!form.isDetailsExpanded}>
                  <AdditionalDetails>
                    {/* Source + Date row */}
                    <SourceField
                      source={form.source}
                      sourceDate={form.sourceDate}
                      linkedSource={form.linkedSource}
                      onSourceSelect={handleSourceSelect}
                      onDateSelect={handleSourceDateSelect}
                    />

                    {/* Topic field */}
                    <TopicField
                      topics={form.topics}
                      lockedTopics={form.linkedSource?.tags ?? []}
                      onTopicSelect={handleTopicSelect}
                      onTopicRemove={handleTopicRemove}
                    />

                    {/* Notes */}
                    <NotesField
                      notes={form.notes}
                      onNotesChange={handleNotesChange}
                    />
                  </AdditionalDetails>
                </AdditionalDetailsWrapper>
              </FormContainer>
            </ScrollableContent>

            {/* ─── Action Buttons ──────────────────────────────────────── */}
            <ActionRow $shadow={scrollShadow.bottom}>
              <PrimaryButton
                title='שמור'
                onClick={handleSave}
                disabled={!form.title.trim()}
                width={133}
              />
              <CancelButton
                title='ביטול'
                onClick={onClose}
              />
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
  box-shadow: ${({ $shadow }) => ($shadow ? '0px 10px 20px 0px rgba(0, 0, 0, 0.06)' : 'none')};
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

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
`

const FormLabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  padding-block-end: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
`

const LabelText = styled.span`
  color: rgba(0, 0, 0, 0.88);
`

const RequiredMark = styled.span`
  color: #ff4d4f;
  font-size: 14px;
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
  color: ${({ $expanded }) => ($expanded ? 'rgba(0, 0, 0, 0.25)' : '#1677ff')};
  white-space: nowrap;
`

// ─── Additional Details ──────────────────────────────────────────────────────

const AdditionalDetailsWrapper = styled.div<{ $expanded: boolean }>`
  display: grid;
  width: 100%;
  grid-template-rows: ${({ $expanded }) => ($expanded ? '1fr' : '0fr')};
  opacity: ${({ $expanded }) => ($expanded ? 1 : 0)};
  transition: grid-template-rows 280ms ease, opacity 220ms ease;

  & > * {
    min-height: 0;
    overflow: ${({ $expanded }) => ($expanded ? 'visible' : 'hidden')};
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
  box-shadow: ${({ $shadow }) => ($shadow ? '0px -10px 20px 0px rgba(0, 0, 0, 0.06)' : 'none')};
`