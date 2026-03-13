import styled from '@emotion/styled';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useEnvironmentMembers } from '../../../hooks/useEnvironments';
import { useCreateInstruction } from '../../../hooks/useInstructions';
import { useToast } from '../../../hooks/useToast';
import type { DueDateType } from '../../../types';
import Button from '../../shared/Button';
import Dialog from '../../shared/Dialog/Dialog';
import DialogContent from '../../shared/Dialog/DialogContent';
import Spinner from '../../shared/Spinner';
import DiscussionStepIndicator from './DiscussionStepIndicator';
import DiscussionStepOne from './DiscussionStepOne';
import DiscussionStepTwo from './DiscussionStepTwo';

export type DiscussionStep = 1 | 2;
export type ExtractionMethod = 'manual' | 'ai';

export interface DiscussionMember {
  id: string;
  name: string;
}

export interface DiscussionInstruction {
  id: string;
  title: string;
  description: string;
  assigneeIds: string[];
  dueDateType: DueDateType;
  dueDate: string;
  notes: string;
}

interface DiscussionFormState {
  step: DiscussionStep;
  discussionName: string;
  discussionDate: string;
  extractionMethod: ExtractionMethod;
  instructions: DiscussionInstruction[];
  aiText: string;
  aiExtracting: boolean;
}

const INITIAL_STATE: DiscussionFormState = {
  step: 1,
  discussionName: '',
  discussionDate: new Date().toISOString().split('T')[0],
  extractionMethod: 'manual',
  instructions: [],
  aiText: '',
  aiExtracting: false,
};

interface CreateDiscussionDialogProps {
  onClose: () => void;
  open: boolean;
  envId: string;
}

export default function CreateDiscussionDialog({
  onClose,
  open,
  envId,
}: CreateDiscussionDialogProps) {
  const toast = useToast();

  const { data: envMembers = [] } = useEnvironmentMembers(envId);
  const { mutateAsync, isPending } = useCreateInstruction(envId);

  const [form, setForm] = useState<DiscussionFormState>(INITIAL_STATE);

  const setField = <K extends keyof DiscussionFormState>(key: K, value: DiscussionFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const availableMembers: DiscussionMember[] = envMembers.map((m) => ({
    id: m.user.id,
    name: m.user.name,
  }));

  useEffect(() => {
    if (!open) setForm(INITIAL_STATE);
  }, [open]);

  const formattedDate = (() => {
    if (!form.discussionDate) return '';
    const [y, m, d] = form.discussionDate.split('-');
    return `${d}/${m}/${y?.slice(2)}`;
  })();

  const handleClose = () => {
    if (!isPending) {
      onClose();
    }
  };

  function handleSubmitDiscussion() {
    if (form.instructions.length === 0) return;

    form.instructions.forEach((inst, index) => {
      const isLast = index === form.instructions.length - 1;
      const computedDueDate =
        inst.dueDateType === 'immediate'
          ? new Date().toISOString()
          : inst.dueDateType === 'date' && inst.dueDate
            ? new Date(inst.dueDate).toISOString()
            : undefined;

      mutateAsync(
        {
          title: inst.title.trim(),
          description: inst.description.trim() || undefined,
          priority: 'medium',
          status: 'open',
          source: form.discussionName.trim() || undefined,
          dueDateType: inst.dueDateType,
          dueDate: computedDueDate,
          assigneeIds: inst.assigneeIds.length > 0 ? inst.assigneeIds : undefined,
        },
        {
          onSuccess: isLast
            ? () => {
                toast.success('ההנחיות נוצרו בהצלחה');
                handleClose();
              }
            : undefined,
          onError: () => toast.error('שגיאה ביצירת ההנחיה'),
        }
      );
    });
  }

  const handleAiExtract = async () => {
    if (!form.aiText.trim()) return;
    setField('aiExtracting', true);
    await new Promise((r) => setTimeout(r, 2000));
    const lines = form.aiText.split('\n').filter((l) => l.trim());
    const extracted: DiscussionInstruction[] = lines.slice(0, 5).map((line) => ({
      id: crypto.randomUUID(),
      title: line.trim().substring(0, 200),
      description: '',
      assigneeIds: [],
      dueDateType: 'routine' as DueDateType,
      dueDate: '',
      notes: '',
    }));
    setForm((prev) => ({ ...prev, instructions: extracted, aiExtracting: false }));
  };

  const addRow = () => {
    setField('instructions', [
      ...form.instructions,
      {
        id: crypto.randomUUID(),
        title: '',
        description: '',
        assigneeIds: [],
        dueDateType: 'routine',
        dueDate: '',
        notes: '',
      },
    ]);
  };

  const updateRow = (id: string, field: keyof DiscussionInstruction, value: unknown) => {
    setField(
      'instructions',
      form.instructions.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const removeRow = (id: string) => {
    setField(
      'instructions',
      form.instructions.filter((row) => row.id !== id)
    );
  };

  const toggleRowAssignee = (rowId: string, memberId: string) => {
    setField(
      'instructions',
      form.instructions.map((row) => {
        if (row.id !== rowId) return row;
        const has = row.assigneeIds.includes(memberId);
        return {
          ...row,
          assigneeIds: has
            ? row.assigneeIds.filter((id) => id !== memberId)
            : [...row.assigneeIds, memberId],
        };
      })
    );
  };

  const canSubmit =
    form.instructions.length > 0 && !form.instructions.some((r) => !r.title.trim()) && !isPending;

  return (
    <Dialog open={open} onClose={handleClose} size="wide">
      <Header>
        <CloseButton type="button" onClick={handleClose} aria-label="סגור">
          <X size={20} />
        </CloseButton>
        <FormTitle>יצירת הנחיות מתוך דיון</FormTitle>
      </Header>

      <DialogContent>
        <FormStack>
          <StepsRow>
            <DiscussionStepIndicator step={1} current={form.step} label="פרטי הסביבה" />
            <StepDivider />
            <DiscussionStepIndicator step={2} current={form.step} label="בעלי תפקידים" />
          </StepsRow>

          {form.step === 1 && (
            <DiscussionStepOne
              discussionName={form.discussionName}
              discussionDate={form.discussionDate}
              onChangeName={(v) => setField('discussionName', v)}
              onChangeDate={(v) => setField('discussionDate', v)}
            />
          )}

          {form.step === 2 && (
            <DiscussionStepTwo
              discussionName={form.discussionName}
              formattedDate={formattedDate}
              extractionMethod={form.extractionMethod}
              onMethodChange={(m) => setField('extractionMethod', m)}
              aiText={form.aiText}
              onAiTextChange={(v) => setField('aiText', v)}
              aiExtracting={form.aiExtracting}
              onAiExtract={handleAiExtract}
              instructions={form.instructions}
              availableMembers={availableMembers}
              onAddRow={addRow}
              onUpdateRow={updateRow}
              onRemoveRow={removeRow}
              onToggleRowAssignee={toggleRowAssignee}
            />
          )}
        </FormStack>
      </DialogContent>

      <Footer>
        {form.step === 1 && (
          <Button
            type="button"
            onClick={() => setField('step', 2)}
            disabled={!form.discussionName.trim()}
          >
            המשך
          </Button>
        )}
        {form.step === 2 && (
          <>
            <Button type="button" onClick={handleSubmitDiscussion} disabled={!canSubmit}>
              {isPending && <ButtonSpinner $size={16} />}
              {isPending ? 'שומר...' : 'שמור'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setField('step', 1)}>
              חזור
            </Button>
          </>
        )}
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

const StepsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const StepDivider = styled.div`
  height: 1px;
  flex: 1;
  background-color: var(--color-gray-200);
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem 1.25rem;
`;

const ButtonSpinner = styled(Spinner)`
  margin-inline-end: 0.5rem;
`;
