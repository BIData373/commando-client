import styled from '@emotion/styled';
import {
  Bold,
  Calendar,
  ChevronDown,
  ChevronUp,
  Flag,
  Link2,
  List,
  Underline,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useEnvironmentMembers, useResponsibleGroups } from '../../hooks/useEnvironments';
import { useCreateInstruction } from '../../hooks/useInstructions';
import { useToast } from '../../hooks/useToast';
import { DUE_DATE_TYPES, type DueDateType } from '../../types';
import Button from '../shared/Button';
import Dialog from '../shared/Dialog/Dialog';
import DialogContent from '../shared/Dialog/DialogContent';
import DropdownMenu from '../shared/DropdownMenu/DropdownMenu';
import DropdownMenuContent from '../shared/DropdownMenu/DropdownMenuContent';
import DropdownMenuItem from '../shared/DropdownMenu/DropdownMenuItem';
import DropdownMenuTrigger from '../shared/DropdownMenu/DropdownMenuTrigger';
import ToolbarButton from '../shared/InstructionViewModal/ToolbarButton';
import Spinner from '../shared/Spinner';
import FieldWithCounter from './FieldWithCounter';

interface SingleFormState {
  title: string;
  description: string;
  isImportant: boolean;
  dueDateType: DueDateType;
  dueDate: string;
  assigneeIds: string[];
  selectedGroupIds: string[];
  showMore: boolean;
  source: string;
  notes: string;
}

const INITIAL_STATE: SingleFormState = {
  title: '',
  description: '',
  isImportant: false,
  dueDateType: 'routine',
  dueDate: '',
  assigneeIds: [],
  selectedGroupIds: [],
  showMore: false,
  source: '',
  notes: '',
};

interface CreateSingleInstructionDialogProps {
  onClose: () => void;
  open: boolean;
  envId: string;
}

export default function CreateSingleInstructionDialog({
  onClose,
  open,
  envId,
}: CreateSingleInstructionDialogProps) {
  const toast = useToast();

  const { data: envMembers = [] } = useEnvironmentMembers(envId);
  const { data: envGroups = [] } = useResponsibleGroups(envId);
  const { mutateAsync, isPending } = useCreateInstruction(envId);

  const [form, setForm] = useState<SingleFormState>(INITIAL_STATE);

  const setField = <K extends keyof SingleFormState>(key: K, value: SingleFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const availableMembers = envMembers.map((m) => ({ id: m.user.id, name: m.user.name }));
  const availableGroups = envGroups.map((g) => ({
    id: g.id,
    nickname: g.nickname,
    userIds: g.members.map((m) => m.id),
  }));

  useEffect(() => {
    if (!open) setForm(INITIAL_STATE);
  }, [open]);

  const formValid = form.title.trim().length > 0;

  const dueDateLabel = DUE_DATE_TYPES.find((d) => d.value === form.dueDateType)?.label || 'שוטף';

  const resolvedUserIds = [
    ...new Set([
      ...form.assigneeIds,
      ...form.selectedGroupIds.flatMap((gId) => {
        const group = availableGroups.find((g) => g.id === gId);
        return group ? group.userIds : [];
      }),
    ]),
  ];

  const filteredMembers = availableMembers.filter((m) => !form.assigneeIds.includes(m.id));

  const handleClose = () => {
    if (!isPending) {
      onClose();
    }
  };

  function handleSubmit() {
    if (!formValid) return;

    const computedDueDate =
      form.dueDateType === 'immediate'
        ? new Date().toISOString()
        : form.dueDate
          ? new Date(form.dueDate).toISOString()
          : undefined;

    mutateAsync(
      {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        priority: 'medium',
        status: 'open',
        source: form.source.trim() || undefined,
        dueDateType: form.dueDateType,
        dueDate: computedDueDate,
        assigneeIds: form.assigneeIds.length > 0 ? form.assigneeIds : undefined,
        responsibleGroupIds: form.selectedGroupIds.length > 0 ? form.selectedGroupIds : undefined,
        isImportant: form.isImportant || undefined,
      },
      {
        onSuccess: () => {
          toast.success('ההנחיה נוצרה בהצלחה');
          handleClose();
        },
        onError: () => toast.error('שגיאה ביצירת ההנחיה'),
      }
    );
  }

  const toggleGroup = (groupId: string) => {
    setField(
      'selectedGroupIds',
      form.selectedGroupIds.includes(groupId)
        ? form.selectedGroupIds.filter((id) => id !== groupId)
        : [...form.selectedGroupIds, groupId]
    );
  };

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

  return (
    <Dialog open={open} onClose={handleClose} size="md">
      <Header>
        <CloseButton type="button" onClick={handleClose} aria-label="סגור">
          <X size={20} />
        </CloseButton>
        <FormTitle>יצירת הנחיה</FormTitle>
      </Header>

      <DialogContent>
        <FormStack>
          <FieldWithCounter
            label="שם ההנחייה"
            value={form.title}
            onChange={(v) => setField('title', v)}
            placeholder="הזן את שם ההנחיה"
            maxLength={60}
            autoFocus
          />

          <FieldWithCounter
            label="תיאור ההנחיה"
            value={form.description}
            onChange={(v) => setField('description', v)}
            placeholder="הזן את תיאור ההנחיה"
            maxLength={60}
          />

          <ImportanceLabel>
            <ImportanceCheckbox
              type="checkbox"
              checked={form.isImportant}
              onChange={(e) => setField('isImportant', e.target.checked)}
            />
            <ImportantFlagIcon size={16} $active={form.isImportant} />
            <span>סמן חשיבות</span>
          </ImportanceLabel>

          <FieldsRow>
            <FieldGroup>
              <InlineLabel>תג״ב</InlineLabel>
              <DueDateRow>
                <DropdownMenu>
                  <DueDateTypeTrigger $type={form.dueDateType}>
                    {dueDateLabel}
                    <ChevronDown size={14} />
                  </DueDateTypeTrigger>
                  <DropdownMenuContent align="start">
                    {DUE_DATE_TYPES.map((opt) => (
                      <DropdownMenuItem
                        key={opt.value}
                        onClick={() => setField('dueDateType', opt.value)}
                      >
                        {opt.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {(form.dueDateType === 'routine' || form.dueDateType === 'date') && (
                  <DatePickerWrapper>
                    <CalendarIconPos size={14} />
                    <DateInput
                      type="date"
                      value={form.dueDate}
                      onChange={(e) => setField('dueDate', e.target.value)}
                    />
                  </DatePickerWrapper>
                )}
              </DueDateRow>
            </FieldGroup>

            <FieldGroup>
              <InlineLabel>אחראים</InlineLabel>
              <AssigneeChips>
                {form.assigneeIds.map((id) => {
                  const member = availableMembers.find((m) => m.id === id);
                  if (!member) return null;
                  return (
                    <AssigneeChip key={id}>
                      {member.name}
                      <ChipRemoveButton type="button" onClick={() => removeAssignee(id)}>
                        <X size={12} />
                      </ChipRemoveButton>
                    </AssigneeChip>
                  );
                })}
                {filteredMembers.length > 0 && (
                  <DropdownMenu>
                    <AssigneeTrigger type="button">
                      <ChevronDown size={16} />
                    </AssigneeTrigger>
                    <DropdownMenuContent align="end">
                      {filteredMembers.map((member) => (
                        <DropdownMenuItem key={member.id} onClick={() => addAssignee(member.id)}>
                          {member.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </AssigneeChips>
            </FieldGroup>
          </FieldsRow>

          <div>
            <GroupsLabel>קבוצות ממונים</GroupsLabel>
            <GroupChips>
              {availableGroups.map((group) => {
                const isSelected = form.selectedGroupIds.includes(group.id);
                return (
                  <GroupChip
                    key={group.id}
                    type="button"
                    $selected={isSelected}
                    onClick={() => toggleGroup(group.id)}
                  >
                    {group.nickname}
                    <GroupCount>({group.userIds.length})</GroupCount>
                    {isSelected && <X size={12} />}
                  </GroupChip>
                );
              })}
            </GroupChips>
          </div>

          {resolvedUserIds.length > 0 && (
            <ResolvedPreview>
              <ResolvedLabel>נמענים סופיים ({resolvedUserIds.length} ייחודיים)</ResolvedLabel>
              <ResolvedChips>
                {resolvedUserIds.map((uid) => {
                  const user = availableMembers.find((m) => m.id === uid);
                  return <ResolvedChip key={uid}>{user?.name || uid}</ResolvedChip>;
                })}
              </ResolvedChips>
            </ResolvedPreview>
          )}

          {/* // FIX Save button goes outside of dialog when pressing this */}
          <ShowMoreToggle type="button" onClick={() => setField('showMore', !form.showMore)}>
            <Spacer />
            <span>פרטים נוספים</span>
            {form.showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </ShowMoreToggle>

          {form.showMore && (
            <FormStack>
              <FieldWithCounter
                label="מקור"
                value={form.source}
                onChange={(v) => setField('source', v)}
                placeholder='לדוגמה: חתמ"צ שבועי'
                maxLength={60}
              />

              <div>
                <NotesLabel>הערות וקישורים</NotesLabel>
                <NotesEditor>
                  <NotesToolbar>
                    <ToolbarButton icon={List} label="רשימה" />
                    <ToolbarButton icon={Underline} label="קו תחתון" />
                    <ToolbarButton icon={Bold} label="מודגש" />
                    <ToolbarButton icon={Link2} label="קישור" />
                  </NotesToolbar>
                  <NotesTextarea
                    rows={4}
                    value={form.notes}
                    onChange={(e) => setField('notes', e.target.value)}
                  />
                </NotesEditor>
              </div>
            </FormStack>
          )}
        </FormStack>
      </DialogContent>

      <Footer>
        <Button type="button" onClick={handleSubmit} disabled={!formValid || isPending}>
          {isPending && <ButtonSpinner $size={16} />}
          {isPending ? 'שומר...' : 'שמור'}
        </Button>
      </Footer>
    </Dialog>
  );
}

const Header = styled.div`
  position: relative;
  padding: 1.25rem 1.5rem 0.5rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  inset-inline-start: 1rem;
  padding: 0.375rem;
  border-radius: 0.375rem;
  border: none;
  background: none;
  color: var(--color-text-disabled);
  cursor: pointer;
  transition: background-color 150ms, color 150ms;

  &:hover {
    background-color: var(--color-gray-100);
    color: var(--color-text-secondary);
  }
`;

const FormTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
  color: var(--color-text-primary);
  margin: 0;
`;

const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
  accent-color: var(--color-warning);
  cursor: pointer;
`;

const ImportantFlagIcon = styled(Flag)<{ $active: boolean }>`
  color: ${({ $active }) => ($active ? 'var(--color-warning)' : 'var(--color-gray-400)')};
  fill: ${({ $active }) => ($active ? 'var(--color-warning)' : 'none')};
`;

const FieldsRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
`;

const FieldGroup = styled.div`
  flex: 1;
`;

const InlineLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 0.375rem;
  text-align: end;
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
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: opacity 150ms;
  background-color: ${({ $type }) =>
    $type === 'routine'
      ? 'var(--color-info-light)'
      : $type === 'immediate'
        ? 'var(--color-warning-light)'
        : 'var(--color-gray-100)'};
  color: ${({ $type }) =>
    $type === 'routine'
      ? 'var(--color-info)'
      : $type === 'immediate'
        ? 'var(--color-warning)'
        : 'var(--color-text-primary)'};
`;

const DatePickerWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const CalendarIconPos = styled(Calendar)`
  position: absolute;
  inset-inline-start: 0.625rem;
  color: var(--color-text-disabled);
  pointer-events: none;
`;

const DateInput = styled.input`
  height: 2rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-gray-200);
  padding-inline-start: 2rem;
  padding-inline-end: 0.75rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 150ms;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-primary) 30%, transparent);
  }
`;

const AssigneeChips = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
`;

const AssigneeChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background-color: var(--color-gray-100);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-gray-200);
`;

const ChipRemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  display: flex;
  padding: 0;
  transition: color 150ms;

  &:hover {
    color: var(--color-error);
  }
`;

const AssigneeTrigger = styled(DropdownMenuTrigger)`
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-disabled);
  padding: 0.25rem;
  transition: color 150ms;

  &:hover {
    color: var(--color-text-secondary);
  }
`;

const GroupsLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 0.375rem;
  text-align: end;
`;

const GroupChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const GroupChip = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid ${({ $selected }) => ($selected ? 'var(--color-primary-light)' : 'var(--color-gray-200)')};
  cursor: pointer;
  transition: background-color 150ms, color 150ms;
  background-color: ${({ $selected }) =>
    $selected ? 'color-mix(in srgb, var(--color-primary) 8%, transparent)' : 'var(--color-paper)'};
  color: ${({ $selected }) => ($selected ? 'var(--color-primary)' : 'var(--color-text-secondary)')};

  &:hover {
    background-color: ${({ $selected }) =>
      $selected
        ? 'color-mix(in srgb, var(--color-primary) 8%, transparent)'
        : 'var(--color-gray-50)'};
  }
`;

const GroupCount = styled.span`
  font-size: 0.625rem;
  opacity: 0.6;
`;

const ResolvedPreview = styled.div`
  background-color: var(--color-gray-50);
  border-radius: 0.5rem;
  padding: 0.75rem;
  border: 1px solid var(--color-gray-100);
`;

const ResolvedLabel = styled.span`
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
`;

const ResolvedChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

const ResolvedChip = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: var(--color-paper);
  color: var(--color-text-primary);
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  border: 1px solid var(--color-gray-200);
`;

const ShowMoreToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  width: 100%;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  background: none;
  border: none;
  border-top: 1px solid var(--color-gray-200);
  padding-top: 0.75rem;
  cursor: pointer;
  transition: color 150ms;

  &:hover {
    color: var(--color-text-primary);
  }
`;

const Spacer = styled.span`
  flex: 1;
`;

const NotesLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 0.375rem;
  text-align: end;
`;

const NotesEditor = styled.div`
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  overflow: hidden;
`;

const NotesToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
  padding: 0.375rem 0.75rem;
  background-color: var(--color-gray-50);
  border-bottom: 1px solid var(--color-gray-200);
`;

const NotesTextarea = styled.textarea`
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  resize: none;
  outline: none;
  border: none;
  background: transparent;
  font-family: inherit;
`;

const Footer = styled.div`
  padding: 0.5rem 1.5rem 1.25rem;
`;

const ButtonSpinner = styled(Spinner)`
  margin-inline-end: 0.5rem;
`;
