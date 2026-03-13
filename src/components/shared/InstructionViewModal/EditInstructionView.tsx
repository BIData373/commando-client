import styled from '@emotion/styled';
import {
  Bold,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Flag,
  Link2,
  List,
  Underline,
  UserIcon,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useEnvironmentMembers } from '../../../hooks/useEnvironments';
import { useUpdateInstruction } from '../../../hooks/useInstructions';
import { useToast } from '../../../hooks/useToast';
import {
  DUE_DATE_TYPE_LABELS,
  type DueDateType,
  type IInstruction,
  type InstructionStatus,
  STATUS_COLORS,
  STATUS_LABELS,
} from '../../../types';
import { formatDateShort, formatTime, toInputDate } from '../../../utils/dateUtils';
import Button from '../Button';
import DropdownMenu from '../DropdownMenu/DropdownMenu';
import DropdownMenuContent from '../DropdownMenu/DropdownMenuContent';
import DropdownMenuItem from '../DropdownMenu/DropdownMenuItem';
import DropdownMenuTrigger from '../DropdownMenu/DropdownMenuTrigger';
import Spinner from '../Spinner';
import EditFieldWithCounter from './EditFieldWithCounter';
import ToolbarButton from './ToolbarButton';

const EDITABLE_STATUSES: { value: InstructionStatus; label: string }[] = [
  { value: 'open', label: STATUS_LABELS.open },
  { value: 'inProgress', label: STATUS_LABELS.inProgress },
  { value: 'completed', label: STATUS_LABELS.completed },
];

const DUE_DATE_TYPES: { value: DueDateType; label: string }[] = [
  { value: 'routine', label: 'שוטף' },
  { value: 'immediate', label: 'מיידי' },
  { value: 'date', label: 'תאריך' },
];

interface FormState {
  title: string;
  description: string;
  status: InstructionStatus;
  dueDateType: DueDateType;
  dueDate: string;
  dueDateFrom: string;
  source: string;
  isImportant: boolean;
  notes: string;
  assigneeIds: string[];
  showMore: boolean;
}

interface EditInstructionViewProps {
  instruction: IInstruction;
  envId: string;
  onClose: () => void;
  onSaved: () => void;
}

// FIX Doesnt close on save
export default function EditInstructionView({
  instruction,
  envId,
  onClose,
  onSaved,
}: EditInstructionViewProps) {
  const toast = useToast();
  const updateMutation = useUpdateInstruction(envId);
  const { data: envMembers = [] } = useEnvironmentMembers(envId);

  const availableMembers = envMembers.map((m) => ({ id: m.user.id, name: m.user.name }));

  const [form, setForm] = useState<FormState>({
    title: instruction.title,
    description: instruction.description || '',
    status: instruction.status,
    dueDateType: instruction.dueDateType,
    dueDate: toInputDate(instruction.dueDate ? new Date(instruction.dueDate) : null),
    dueDateFrom: toInputDate(instruction.dueDateFrom ? new Date(instruction.dueDateFrom) : null),
    source: instruction.source || '',
    isImportant: instruction.isImportant,
    notes: '',
    assigneeIds: instruction.assignees.map((a) => a.user.id),
    showMore: true,
  });

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const formValid = form.title.trim().length > 0;

  const hasChanges =
    form.title !== instruction.title ||
    form.description !== (instruction.description || '') ||
    form.status !== instruction.status ||
    form.isImportant !== instruction.isImportant ||
    form.dueDateType !== instruction.dueDateType ||
    form.dueDate !== toInputDate(instruction.dueDate ? new Date(instruction.dueDate) : null) ||
    form.source !== (instruction.source || '') ||
    JSON.stringify([...form.assigneeIds].sort()) !==
      JSON.stringify(instruction.assignees.map((a) => a.user.id).sort());

  const filteredMembers = availableMembers.filter((m) => !form.assigneeIds.includes(m.id));

  const removeAssignee = (id: string) => {
    setField(
      'assigneeIds',
      form.assigneeIds.filter((a) => a !== id)
    );
  };

  const addAssignee = (id: string) => {
    if (!form.assigneeIds.includes(id)) {
      setField('assigneeIds', [...form.assigneeIds, id]);
    }
  };

  const handleSave = () => {
    if (!formValid) return;

    const computedDueDate =
      form.dueDateType === 'immediate'
        ? new Date().toISOString()
        : form.dueDate
          ? new Date(form.dueDate).toISOString()
          : null;

    const computedDueDateFrom =
      form.dueDateType === 'date' && form.dueDateFrom
        ? new Date(form.dueDateFrom).toISOString()
        : null;

    updateMutation.mutate(
      {
        instructionId: instruction.id,
        data: {
          title: form.title.trim(),
          description: form.description.trim() || undefined,
          status: form.status,
          priority: instruction.priority,
          dueDateType: form.dueDateType,
          dueDate: computedDueDate,
          dueDateFrom: computedDueDateFrom,
          source: form.source.trim() || null,
          assigneeIds: form.assigneeIds,
          isImportant: form.isImportant,
        },
      },
      {
        onSuccess: () => {
          toast.success('ההנחיה עודכנה בהצלחה');
          onSaved();
        },
        onError: () => {
          toast.error('תקלה בעדכון ההנחיה');
        },
      }
    );
  };

  return (
    <>
      <ModalHeader>
        <ModalTitle>עריכת הנחיה</ModalTitle>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>
      </ModalHeader>

      <Body>
        <FormStack>
          <EditFieldWithCounter
            label="שם ההנחיה"
            value={form.title}
            onChange={(v) => setField('title', v)}
            placeholder="הזן את שם ההנחיה"
            maxLength={60}
            autoFocus
          />

          <EditFieldWithCounter
            label="תיאור ההנחיה"
            value={form.description}
            onChange={(v) => setField('description', v)}
            placeholder="הזן את תיאור ההנחיה"
            maxLength={500}
            multiline
          />

          <RowFields>
            <FieldGroup>
              <FieldLabel>סטטוס</FieldLabel>
              <DropdownMenu>
                <StatusTrigger>
                  <StatusDot $color={STATUS_COLORS[form.status]} />
                  <span>{STATUS_LABELS[form.status]}</span>
                  <ChevronDown size={16} />
                </StatusTrigger>
                <DropdownMenuContent align="start">
                  {EDITABLE_STATUSES.map((opt) => (
                    <StatusOption
                      key={opt.value}
                      $active={form.status === opt.value}
                      onClick={() => setField('status', opt.value)}
                    >
                      <StatusDot $color={STATUS_COLORS[opt.value]} />
                      {opt.label}
                      {form.status === opt.value && <Check size={16} />}
                    </StatusOption>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </FieldGroup>
          </RowFields>

          <ImportanceLabel>
            <ImportanceCheckbox
              type="checkbox"
              checked={form.isImportant}
              onChange={(e) => setField('isImportant', e.target.checked)}
            />
            <FlagIcon size={16} $active={form.isImportant} />
            <span>סמן חשיבות</span>
          </ImportanceLabel>

          <RowFields>
            <FieldGroup>
              <FieldLabel>תג״ב</FieldLabel>
              <DueDateRow>
                <DropdownMenu>
                  <DueDateTypeTrigger $type={form.dueDateType}>
                    {DUE_DATE_TYPE_LABELS[form.dueDateType]}
                    <ChevronDown size={14} />
                  </DueDateTypeTrigger>
                  <DropdownMenuContent align="start">
                    {DUE_DATE_TYPES.map((opt) => (
                      <DueDateOption
                        key={opt.value}
                        $active={form.dueDateType === opt.value}
                        onClick={() => setField('dueDateType', opt.value)}
                      >
                        {opt.label}
                      </DueDateOption>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {(form.dueDateType === 'routine' || form.dueDateType === 'date') && (
                  <DateInputsRow>
                    {form.dueDateType === 'date' && (
                      <>
                        <DateHint>מ-</DateHint>
                        <DateInputWrapper>
                          <CalendarIcon size={14} />
                          <DateInput
                            type="date"
                            value={form.dueDateFrom}
                            onChange={(e) => setField('dueDateFrom', e.target.value)}
                          />
                        </DateInputWrapper>
                      </>
                    )}
                    <DateHint>עד</DateHint>
                    <DateInputWrapper>
                      <CalendarIcon size={14} />
                      <DateInput
                        type="date"
                        value={form.dueDate}
                        onChange={(e) => setField('dueDate', e.target.value)}
                      />
                    </DateInputWrapper>
                  </DateInputsRow>
                )}
              </DueDateRow>
            </FieldGroup>

            <FieldGroup>
              <EditFieldWithCounter
                label="מקור"
                value={form.source}
                onChange={(v) => setField('source', v)}
                placeholder="לדוגמה: ישיבת הנהלה"
                maxLength={60}
              />
            </FieldGroup>
          </RowFields>

          <div>
            <FieldLabel>אחראים</FieldLabel>
            <DropdownMenu>
              <AssigneeTrigger>
                <AssigneeTagList>
                  {form.assigneeIds.map((id) => {
                    const member =
                      availableMembers.find((m) => m.id === id) ||
                      instruction.assignees.find((a) => a.user.id === id)?.user;
                    if (!member) return null;
                    return (
                      <AssigneeTag key={id}>
                        {member.name}
                        <RemoveAssigneeButton
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAssignee(id);
                          }}
                        >
                          <X size={14} />
                        </RemoveAssigneeButton>
                      </AssigneeTag>
                    );
                  })}
                  {form.assigneeIds.length === 0 && (
                    <AssigneePlaceholder>בחר אחראים...</AssigneePlaceholder>
                  )}
                </AssigneeTagList>
                <ChevronDown size={16} />
              </AssigneeTrigger>
              {filteredMembers.length > 0 && (
                <DropdownMenuContent align="end">
                  {filteredMembers.map((member) => (
                    <DropdownMenuItem key={member.id} onClick={() => addAssignee(member.id)}>
                      <UserIcon size={16} />
                      {member.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>

          <AccordionToggle type="button" onClick={() => setField('showMore', !form.showMore)}>
            <AccordionLine />
            <span>פרטים נוספים</span>
            {form.showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </AccordionToggle>

          {form.showMore && (
            <FormStack>
              <div>
                <FieldLabel>הערות וקישורים</FieldLabel>
                <RichTextEditor>
                  <RichTextToolbar>
                    <ToolbarButton icon={List} label="רשימה" />
                    <ToolbarButton icon={Underline} label="קו תחתון" />
                    <ToolbarButton icon={Bold} label="מודגש" />
                    <ToolbarButton icon={Link2} label="קישור" />
                  </RichTextToolbar>
                  <NotesTextArea
                    rows={4}
                    value={form.notes}
                    onChange={(e) => setField('notes', e.target.value)}
                    placeholder="הוסף הערות, קישורים או מידע נוסף..."
                    dir="rtl"
                  />
                </RichTextEditor>
              </div>

              <MetaInfo>
                <MetaRow>
                  <MetaKey>נוצר על ידי</MetaKey>
                  <MetaValue>{instruction.createdBy.name}</MetaValue>
                </MetaRow>
                <MetaRow>
                  <MetaKey>תאריך יצירה</MetaKey>
                  <MetaValue>
                    {formatDateShort(new Date(instruction.createdAt))}{' '}
                    {formatTime(new Date(instruction.createdAt))}
                  </MetaValue>
                </MetaRow>
                <MetaRow>
                  <MetaKey>עדכון אחרון</MetaKey>
                  <MetaValue>
                    {formatDateShort(new Date(instruction.updatedAt))}{' '}
                    {formatTime(new Date(instruction.updatedAt))}
                  </MetaValue>
                </MetaRow>
              </MetaInfo>
            </FormStack>
          )}
        </FormStack>
      </Body>

      <Footer>
        <Button
          type="button"
          onClick={handleSave}
          disabled={!formValid || !hasChanges || updateMutation.isPending}
        >
          {updateMutation.isPending && <SaveSpinner $size={16} />}
          {updateMutation.isPending ? 'שומר...' : 'שמור'}
        </Button>
        <Button type="button" variant="ghost" onClick={onClose} disabled={updateMutation.isPending}>
          ביטול
        </Button>
      </Footer>
    </>
  );
}

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem 1rem;
  border-bottom: 1px solid var(--color-gray-100);
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
`;

const CloseButton = styled.button`
  padding: 0.375rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-disabled);
  transition: color 150ms;

  &:hover {
    color: var(--color-text-primary);
  }
`;

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem;
`;

const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  text-align: end;
`;

const RowFields = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
`;

const FieldGroup = styled.div`
  flex: 1;
`;

const StatusTrigger = styled(DropdownMenuTrigger)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 2.5rem;
  padding: 0 1rem;
  width: 100%;
  justify-content: space-between;
  border-radius: 0.5rem;
  border: 1px solid var(--color-gray-200);
  background-color: var(--color-paper);
  cursor: pointer;
  transition: background-color 150ms;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);

  &:hover {
    background-color: var(--color-gray-50);
  }
`;

const StatusDot = styled.span<{ $color: string }>`
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 9999px;
  flex-shrink: 0;
  background-color: ${({ $color }) => $color};
`;

const StatusOption = styled(DropdownMenuItem)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: ${({ $active }) => ($active ? '500' : '400')};
  background-color: ${({ $active }) =>
    $active
      ? 'color-mix(in srgb, var(--color-primary) 5%, transparent)'
      : 'transparent'} !important;
`;

const ImportanceLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const ImportanceCheckbox = styled.input`
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  accent-color: var(--color-warning);
`;

const FlagIcon = styled(Flag)<{ $active: boolean }>`
  color: ${({ $active }) => ($active ? 'var(--color-warning)' : 'var(--color-gray-300)')};
  fill: ${({ $active }) => ($active ? 'var(--color-warning)' : 'none')};
`;

const DueDateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DueDateTypeTrigger = styled(DropdownMenuTrigger)<{ $type: DueDateType }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid;
  cursor: pointer;
  transition: opacity 150ms;
  background-color: ${({ $type }) =>
    $type === 'routine'
      ? 'var(--color-info-light)'
      : $type === 'immediate'
        ? 'var(--color-warning-light)'
        : 'var(--color-gray-50)'};
  color: ${({ $type }) =>
    $type === 'routine'
      ? 'var(--color-info)'
      : $type === 'immediate'
        ? 'var(--color-warning)'
        : 'var(--color-text-secondary)'};
  border-color: ${({ $type }) =>
    $type === 'routine'
      ? 'var(--color-info-light)'
      : $type === 'immediate'
        ? 'var(--color-warning-light)'
        : 'var(--color-gray-200)'};

  &:hover {
    opacity: 0.85;
  }
`;

const DueDateOption = styled(DropdownMenuItem)<{ $active: boolean }>`
  font-weight: ${({ $active }) => ($active ? '500' : '400')};
  color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'inherit')} !important;
  background-color: ${({ $active }) =>
    $active
      ? 'color-mix(in srgb, var(--color-primary) 5%, transparent)'
      : 'transparent'} !important;
`;

const DateInputsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const DateHint = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-disabled);
`;

const DateInputWrapper = styled.div`
  position: relative;
`;

const CalendarIcon = styled(Calendar)`
  position: absolute;
  inset-inline-start: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-disabled);
  pointer-events: none;
`;

const DateInput = styled.input`
  height: 2.25rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-gray-200);
  padding-inline-start: 2rem;
  padding-inline-end: 0.75rem;
  font-size: 0.875rem;
  background-color: var(--color-paper);
  color: var(--color-text-primary);

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 30%, transparent);
  }
`;

const AssigneeTrigger = styled(DropdownMenuTrigger)`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
  min-height: 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-gray-200);
  background-color: var(--color-paper);
  padding: 0.5rem 0.75rem;
  width: 100%;
  cursor: pointer;
  text-align: start;
`;

const AssigneeTagList = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
  flex: 1;
`;

const AssigneeTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-primary);
  font-size: 0.875rem;
  padding: 0.25rem 0.625rem;
  border-radius: 0.5rem;
  border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
`;

const RemoveAssigneeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 150ms;

  &:hover {
    color: var(--color-error);
  }
`;

const AssigneePlaceholder = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-disabled);
`;

const AccordionToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  width: 100%;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: none;
  border: none;
  border-top: 1px solid var(--color-gray-100);
  padding-top: 1rem;
  cursor: pointer;
  transition: color 150ms;

  &:hover {
    color: var(--color-text-primary);
  }
`;

const AccordionLine = styled.span`
  flex: 1;
`;

const RichTextEditor = styled.div`
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: box-shadow 150ms, border-color 150ms;

  &:focus-within {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 30%, transparent);
  }
`;

const RichTextToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
  padding: 0.375rem 0.75rem;
  background-color: var(--color-gray-50);
  border-bottom: 1px solid var(--color-gray-200);
`;

const NotesTextArea = styled.textarea`
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  outline: none;
  resize: none;
  color: var(--color-text-primary);
  background-color: var(--color-paper);

  &::placeholder {
    color: var(--color-text-disabled);
  }
`;

const MetaInfo = styled.div`
  background-color: var(--color-gray-50);
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--color-gray-100);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
`;

const MetaKey = styled.span`
  color: var(--color-text-disabled);
`;

const MetaValue = styled.span`
  font-weight: 500;
  color: var(--color-text-secondary);
`;

const SaveSpinner = styled(Spinner)`
  margin-inline-end: 0.5rem;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-top: 1px solid var(--color-gray-100);
  background-color: color-mix(in srgb, var(--color-gray-50) 50%, transparent);
`;
