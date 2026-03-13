import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useCreateEnvironment } from '../../../hooks/useEnvironments';
import { useToast } from '../../../hooks/useToast';
import type { EnvironmentFormData } from '../../../utils/environmentUtils';
import Dialog from '../../shared/Dialog/Dialog';
import StepDetails from './StepDetails';
import StepIndicator from './StepIndicator';
import StepManagers from './StepManagers';

const INITIAL_FORM: EnvironmentFormData = {
  name: '',
  iconName: 'Briefcase',
  managerIds: [],
};

interface CreateEnvironmentDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateEnvironmentDialog({ open, onClose }: CreateEnvironmentDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<EnvironmentFormData>(INITIAL_FORM);
  const [nameTouched, setNameTouched] = useState(false);
  const createMutation = useCreateEnvironment();
  const toast = useToast();

  useEffect(() => {
    if (!open) {
      setForm(INITIAL_FORM);
      setNameTouched(false);
      setStep(1);
    }
  }, [open]);

  function updateForm(patch: Partial<EnvironmentFormData>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function resetForm() {
    setForm(INITIAL_FORM);
    setNameTouched(false);
    setStep(1);
  }

  function handleClose() {
    if (!createMutation.isPending) onClose();
  }

  function handleCreate() {
    createMutation.mutate(
      { name: form.name.trim() },
      {
        onSuccess: () => {
          toast.success('הבקשה ליצירת סביבה נשלחה בהצלחה! יצירתה ממתין לאישור.');
          onClose();
        },
        onError: () => {
          toast.error('תקלה בשליחת הבקשה. נסו שוב.');
        },
      }
    );
  }

  function handleNameBlur() {
    setNameTouched(true);
  }

  function handleContinue() {
    setStep(2);
  }

  function handleBack() {
    setStep(1);
  }

  const nameValid = form.name.trim().length > 0;
  const nameError = nameTouched && !nameValid;

  return (
    <Dialog open={open} onClose={handleClose} size="sm">
      <StepIndicatorWrapper>
        <StepIndicator currentStep={step} totalSteps={2} />
      </StepIndicatorWrapper>

      {step === 1 ? (
        <StepDetails
          form={form}
          updateForm={updateForm}
          nameError={nameError}
          nameValid={nameValid}
          onNameBlur={handleNameBlur}
          onCancel={handleClose}
          onContinue={handleContinue}
          onReset={resetForm}
        />
      ) : (
        <StepManagers
          form={form}
          updateForm={updateForm}
          onBack={handleBack}
          onCreate={handleCreate}
          onReset={resetForm}
          isPending={createMutation.isPending}
        />
      )}
    </Dialog>
  );
}

const StepIndicatorWrapper = styled.div`
  padding: 1.25rem 1.5rem 0;
`;
