import styled from '@emotion/styled';
import { type ChangeEvent, useEffect, useRef } from 'react';
import {
  type EnvironmentFormData,
  getIconComponent,
  getIconLabel,
} from '../../../utils/environmentUtils';
import Button from '../../shared/Button';
import DialogContent from '../../shared/Dialog/DialogContent';
import DialogFooter from '../../shared/Dialog/DialogFooter';
import DialogHeader from '../../shared/Dialog/DialogHeader';
import DialogTitle from '../../shared/Dialog/DialogTitle';
import UnitDropdown from './UnitDropdown';

const MAX_ENV_NAME_LENGTH = 255;

interface StepDetailsProps {
  form: EnvironmentFormData;
  updateForm: (patch: Partial<EnvironmentFormData>) => void;
  nameError: boolean;
  nameValid: boolean;
  onNameBlur: () => void;
  onCancel: () => void;
  onContinue: () => void;
  onReset: () => void;
}

export default function StepDetails({
  form,
  updateForm,
  nameError,
  nameValid,
  onNameBlur,
  onCancel,
  onContinue,
  onReset,
}: StepDetailsProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const IconComp = getIconComponent(form.iconName);

  useEffect(() => {
    setTimeout(() => nameRef.current?.focus(), 100);
  }, []);

  function handleChangeInput(e: ChangeEvent<HTMLInputElement>) {
    updateForm({ name: e.target.value });
  }

  function handleSelectIcon(name: string) {
    updateForm({ iconName: name });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>פרטי המערך</DialogTitle>
        <Subtitle>הגדירו את שם הסביבה ובחרו סמל יחידה.</Subtitle>
      </DialogHeader>

      <DialogContent>
        <FormStack>
          <FieldGroup>
            <FieldLabel htmlFor="env-name">
              שם המערך <RequiredMark>*</RequiredMark>
            </FieldLabel>
            <FieldInput
              ref={nameRef}
              id="env-name"
              placeholder="לדוגמה: גדוד 101 — מערך הנחיות"
              value={form.name}
              onChange={handleChangeInput}
              onBlur={onNameBlur}
              maxLength={MAX_ENV_NAME_LENGTH}
              aria-invalid={nameError}
              $error={nameError}
            />
            {nameError && <FieldError>יש להזין שם לסביבה</FieldError>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>סמל יחידה</FieldLabel>
            <UnitDropdown selectedIcon={form.iconName} onSelectIcon={handleSelectIcon} />
          </FieldGroup>

          <PreviewCard>
            <PreviewLabel>תצוגה מקדימה</PreviewLabel>
            <PreviewRow>
              <PreviewAvatar>
                <IconComp size={20} />
              </PreviewAvatar>
              <PreviewInfo>
                <PreviewName>{form.name || 'שם המערך'}</PreviewName>
                <PreviewSubtext>{getIconLabel(form.iconName)}</PreviewSubtext>
              </PreviewInfo>
            </PreviewRow>
          </PreviewCard>
        </FormStack>
      </DialogContent>

      <SpacedDialogFooter>
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          נקה טופס
        </Button>
        <FooterActions>
          <Button type="button" variant="ghost" onClick={onCancel}>
            ביטול
          </Button>
          <Button type="button" disabled={!nameValid} onClick={onContinue}>
            המשך
          </Button>
        </FooterActions>
      </SpacedDialogFooter>
    </>
  );
}

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
`;

const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const RequiredMark = styled.span`
  color: var(--color-error);
`;

const FieldInput = styled.input<{ $error?: boolean }>`
  display: flex;
  height: 2.25rem;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  transition: border-color 150ms, box-shadow 150ms;

  &::placeholder {
    color: var(--color-text-disabled);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 30%, transparent);
    border-color: var(--color-primary);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  ${({ $error }) =>
    $error &&
    `
    border-color: var(--color-error);
    &:focus {
      border-color: var(--color-error);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-error) 30%, transparent);
    }
  `}
`;

const FieldError = styled.p`
  font-size: 0.75rem;
  color: var(--color-error);
`;

const PreviewCard = styled.div`
  border: 2px dashed var(--color-gray-200);
  border-radius: 0.75rem;
  padding: 1rem;
`;

const PreviewLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
`;

const PreviewRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const PreviewAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: linear-gradient(to bottom right, var(--color-primary-dark), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-paper);
  flex-shrink: 0;
`;

const PreviewInfo = styled.div`
  min-width: 0;
  flex: 1;
`;

const PreviewName = styled.h4`
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PreviewSubtext = styled.p`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 0.125rem;
`;

const SpacedDialogFooter = styled(DialogFooter)`
  justify-content: space-between;
`;

const FooterActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
