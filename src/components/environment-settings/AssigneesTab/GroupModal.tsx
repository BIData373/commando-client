import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Check, Edit2, Mail, Plus, UserPlus, X } from 'lucide-react';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';

interface GroupMember {
  id: string;
  name: string;
  email: string;
}

interface GroupModalProps {
  isEditing: boolean;
  groupName: string;
  onGroupNameChange: (v: string) => void;
  members: GroupMember[];
  onAddMember: (email: string) => void;
  onRemoveMember: (id: string) => void;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
}

export default function GroupModal({
  isEditing,
  groupName,
  onGroupNameChange,
  members,
  onAddMember,
  onRemoveMember,
  onSave,
  onClose,
  isSaving,
}: GroupModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const isValidEmail = emailInput.includes('@') && emailInput.includes('.');
  const isValid = groupName.trim().length > 0 && members.length > 0;

  const handleAddEmail = () => {
    if (!isValidEmail) return;
    onAddMember(emailInput.trim());
    setEmailInput('');
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleGroupNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    onGroupNameChange(e.target.value);
  };

  const handleChangeEmailInput = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
  };

  return (
    <Backdrop onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderLeft>
            <IconWrapper>{isEditing ? <Edit2 size={16} /> : <UserPlus size={16} />}</IconWrapper>
            <ModalTitle>{isEditing ? 'עריכת קבוצה' : 'יצירת קבוצה חדשה'}</ModalTitle>
          </HeaderLeft>
          <CloseButton onClick={onClose}>
            <X size={18} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <FieldGroup>
            <FieldLabel>שם הקבוצה</FieldLabel>
            <TextInput
              ref={inputRef}
              value={groupName}
              onChange={handleGroupNameChange}
              placeholder='לדוגמה: מג"ד, צוות תפעול...'
              maxLength={50}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>הוספת משתמש לפי אימייל</FieldLabel>
            <EmailRow>
              <EmailInputWrapper>
                <MailIcon size={14} />
                <EmailInput
                  value={emailInput}
                  onChange={handleChangeEmailInput}
                  onKeyDown={handleEmailKeyDown}
                  placeholder="user@example.com"
                  dir="ltr"
                />
              </EmailInputWrapper>
              <AddButton onClick={handleAddEmail} disabled={!isValidEmail}>
                <Plus size={14} />
                הוסף
              </AddButton>
            </EmailRow>
          </FieldGroup>

          {members.length > 0 && (
            <FieldGroup>
              <FieldLabel>חברי הקבוצה ({members.length})</FieldLabel>
              <MemberPills>
                {members.map((member) => (
                  <MemberPill key={member.id}>
                    {member.email || member.name}
                    <RemoveMemberButton onClick={() => onRemoveMember(member.id)}>
                      <X size={12} />
                    </RemoveMemberButton>
                  </MemberPill>
                ))}
              </MemberPills>
            </FieldGroup>
          )}
        </ModalBody>

        <ModalFooter>
          <ValidationHint>{members.length === 0 ? 'יש להוסיף לפחות משתמש אחד' : ''}</ValidationHint>
          <FooterActions>
            <CancelButton onClick={onClose}>ביטול</CancelButton>
            <SaveButton onClick={onSave} disabled={!isValid || isSaving}>
              {isSaving ? <SaveSpinner /> : <Check size={16} />}
              {isEditing ? 'עדכון' : 'שמירה'}
            </SaveButton>
          </FooterActions>
        </ModalFooter>
      </Modal>
    </Backdrop>
  );
}

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(0 0 0 / 0.4);
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  position: relative;
  background-color: var(--color-paper);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  width: 100%;
  max-width: 28rem;
  margin: 0 1rem;
  overflow: hidden;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-100);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const IconWrapper = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.75rem;
  background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
`;

const CloseButton = styled.button`
  padding: 0.375rem;
  border-radius: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-disabled);
  transition: color 150ms, background-color 150ms;

  &:hover {
    color: var(--color-text-secondary);
    background-color: var(--color-gray-100);
  }
`;

const ModalBody = styled.div`
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FieldGroup = styled.div``;

const FieldLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
`;

const TextInput = styled.input`
  width: 100%;
  background-color: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  padding: 0.625rem 0.875rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 150ms, background-color 150ms, box-shadow 150ms;
  color: var(--color-text-primary);

  &:focus {
    border-color: var(--color-primary);
    background-color: var(--color-paper);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 20%, transparent);
  }
`;

const EmailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EmailInputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const MailIcon = styled(Mail)`
  position: absolute;
  inset-inline-start: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-disabled);
  pointer-events: none;
`;

const EmailInput = styled.input`
  width: 100%;
  background-color: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  padding-inline-start: 2.25rem;
  padding-inline-end: 0.75rem;
  padding-block: 0.625rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 150ms, background-color 150ms, box-shadow 150ms;
  color: var(--color-text-primary);

  &:focus {
    border-color: var(--color-primary);
    background-color: var(--color-paper);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 20%, transparent);
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background-color: var(--color-primary);
  color: white;
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  border: none;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 150ms;

  &:hover {
    background-color: var(--color-primary-dark);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MemberPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

const MemberPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-primary);
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
`;

const RemoveMemberButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 150ms;

  &:hover {
    color: var(--color-primary-dark);
  }
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-gray-100);
  background-color: color-mix(in srgb, var(--color-gray-50) 50%, transparent);
`;

const ValidationHint = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-disabled);
`;

const FooterActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CancelButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: var(--color-gray-100);
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background-color: var(--color-primary);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: var(--color-primary-dark);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const SaveSpinner = styled.span`
  width: 1rem;
  height: 1rem;
  border: 2px solid rgb(255 255 255 / 0.3);
  border-top-color: white;
  border-radius: 9999px;
  animation: ${spin} 0.6s linear infinite;
`;
