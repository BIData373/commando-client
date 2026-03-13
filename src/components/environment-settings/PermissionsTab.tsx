import styled from '@emotion/styled';
import { Plus, Trash2, UserIcon, X } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';
import { useEnvironmentMembers } from '../../hooks/useEnvironments';
import { type MemberRole, ROLE_LABELS } from '../../types';
import FieldLabel from '../shared/FieldLabel';
import SectionHeader from './SectionHeader';

interface PermissionsTabProps {
  envId: string;
}

export default function PermissionsTab({ envId }: PermissionsTabProps) {
  const { data: allMembers = [] } = useEnvironmentMembers(envId);
  // FIX Email
  const [managers, setManagers] = useState<
    { id: string; name: string; email: string; role: MemberRole }[]
  >(() =>
    allMembers
      .filter((m) => m.role === 'manager')
      .map((m) => ({ id: m.user.id, name: m.user.name, email: m.user.email ?? '', role: m.role }))
  );
  const [showAddManager, setShowAddManager] = useState(false);
  const [newManagerEmail, setNewManagerEmail] = useState('');

  const handleAddManager = () => {
    if (!newManagerEmail.trim()) return;
    const newManager = {
      id: crypto.randomUUID(),
      name: newManagerEmail.split('@')[0],
      email: newManagerEmail,
      role: 'manager' as MemberRole,
    };
    setManagers((prev) => [...prev, newManager]);
    setNewManagerEmail('');
    setShowAddManager(false);
  };

  const handleRemoveManager = (managerId: string) => {
    setManagers((prev) => prev.filter((m) => m.id !== managerId));
  };

  const handleClickAddManager = () => {
    setShowAddManager(true);
  };

  const handleChangeNewManagerEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setNewManagerEmail(e.target.value);
  };

  const handleClickCancelAddManager = () => {
    setShowAddManager(false);
  };

  return (
    <Root>
      <TopRow>
        <SectionHeader
          title="מנהלי הסביבה"
          subtitle="רק משתמשים המופיעים כאן רשאים לצפות בהגדרות הסביבה, לערוך אותן ולנהל את המערכת"
        />
        <AddManagerButton onClick={handleClickAddManager}>
          <Plus size={16} />
          הוסף מנהל
        </AddManagerButton>
      </TopRow>

      {showAddManager && (
        <AddManagerForm>
          <AddManagerField>
            <FieldLabel>אימייל</FieldLabel>
            <EmailInput
              value={newManagerEmail}
              onChange={handleChangeNewManagerEmail}
              placeholder="user@example.com"
            />
          </AddManagerField>
          <AddButton onClick={handleAddManager} disabled={!newManagerEmail.trim()}>
            הוסף
          </AddButton>
          <CancelIconButton onClick={handleClickCancelAddManager}>
            <X size={18} />
          </CancelIconButton>
        </AddManagerForm>
      )}

      <ManagersTable>
        <TableHeader>
          <span>שם</span>
          <span>אימייל</span>
          <span>תפקיד</span>
          <span />
        </TableHeader>

        {managers.map((manager) => (
          <TableRow key={manager.id}>
            <MemberCell>
              <AvatarCircle>
                <UserIcon size={14} />
              </AvatarCircle>
              <MemberName>{manager.name}</MemberName>
            </MemberCell>

            <MemberEmail>{manager.email}</MemberEmail>

            <RoleBadge>{ROLE_LABELS.manager}</RoleBadge>

            <ActionsCell>
              <RemoveButton onClick={() => handleRemoveManager(manager.id)} aria-label="הסר מנהל">
                <Trash2 size={15} />
              </RemoveButton>
            </ActionsCell>
          </TableRow>
        ))}
      </ManagersTable>
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AddManagerButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background-color: var(--color-primary);
  color: white;
  padding: 0.375rem 1rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 150ms;

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const AddManagerForm = styled.div`
  background-color: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
`;

const AddManagerField = styled.div`
  flex: 1;
`;

const EmailInput = styled.input`
  width: 100%;
  background-color: var(--color-paper);
  border: 1px solid var(--color-gray-200);
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  color: var(--color-text-primary);
  transition: border-color 150ms;

  &:focus {
    border-color: var(--color-primary);
  }
`;

const AddButton = styled.button`
  background-color: var(--color-primary);
  color: white;
  padding: 0.5rem 1rem;
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

const CancelIconButton = styled.button`
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-disabled);
  transition: color 150ms;

  &:hover {
    color: var(--color-text-secondary);
  }
`;

const ManagersTable = styled.div`
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
  overflow: hidden;
`;

const tableGrid = `
  display: grid;
  grid-template-columns: 1fr 1fr 140px 48px;
  gap: 0.5rem;
  padding: 0 1rem;
  align-items: center;
`;

const TableHeader = styled.div`
  ${tableGrid}
  background-color: var(--color-gray-50);
  padding-block: 0.625rem;
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--color-text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--color-gray-200);
`;

const TableRow = styled.div`
  ${tableGrid}
  padding-block: 0.75rem;
  border-bottom: 1px solid var(--color-gray-100);

  &:last-child {
    border-bottom: none;
  }
`;

const MemberCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const AvatarCircle = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: var(--color-gray-100);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const MemberName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MemberEmail = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 700;
  background-color: var(--color-warning-light);
  color: var(--color-warning);
  border: 1px solid color-mix(in srgb, var(--color-warning) 20%, transparent);
  width: fit-content;
`;

const ActionsCell = styled.div`
  display: flex;
  justify-content: center;
`;

const RemoveButton = styled.button`
  padding: 0.375rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-gray-300);
  transition: color 150ms;

  &:hover {
    color: var(--color-error);
  }
`;
