import styled from '@emotion/styled';
import { ChevronDown } from 'lucide-react';
import { useDropdown } from '../../../hooks/useDropdown';
import {
  type IInstructionAssignee,
  type InstructionStatus,
  STATUS_LABELS,
  statusOptions,
} from '../../../types';
import { formatDate } from '../../../utils/dateUtils';
import StatusChip from '../../shared/StatusChip';
import UserAvatar from '../../shared/UserAvatar';

interface AssigneeRowProps {
  assignee: IInstructionAssignee;
  onStatusChange?: (assigneeId: string, status: InstructionStatus) => void;
}

export default function AssigneeRow({ assignee, onStatusChange }: AssigneeRowProps) {
  const dropdown = useDropdown();

  const handleStatusChange = (status: InstructionStatus) => {
    onStatusChange?.(assignee.id, status);
    dropdown.setOpen(false);
  };

  return (
    <Tr>
      <Td>
        <UserCell>
          <UserAvatar user={assignee.user} size={24} />
          <UserName>{assignee.user.name}</UserName>
        </UserCell>
      </Td>
      <Td>
        <StatusChip status={assignee.status} />
      </Td>
      <Td>
        <DateText>{formatDate(new Date(assignee.assignedAt))}</DateText>
      </Td>
      {onStatusChange && (
        <Td>
          <DropdownWrapper ref={dropdown.ref}>
            <ChangeStatusButton onClick={() => dropdown.setOpen(!dropdown.open)}>
              שנה מצב
              <DropdownChevron size={12} $open={dropdown.open} />
            </ChangeStatusButton>
            {dropdown.open && (
              <StatusDropdown>
                {statusOptions.map((s) => (
                  <StatusOption
                    key={s}
                    $active={s === assignee.status}
                    onClick={() => handleStatusChange(s)}
                  >
                    {STATUS_LABELS[s]}
                  </StatusOption>
                ))}
              </StatusDropdown>
            )}
          </DropdownWrapper>
        </Td>
      )}
    </Tr>
  );
}

const Tr = styled.tr`
  border-top: 1px solid var(--color-gray-100);
`;

const Td = styled.td`
  padding: 0.5rem 0.75rem;
`;

const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserName = styled.span`
  font-weight: 500;
  color: var(--color-text-primary);
`;

const DateText = styled.span`
  color: var(--color-text-secondary);
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const DropdownChevron = styled(ChevronDown)<{ $open: boolean }>`
  transition: transform 150ms;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const ChangeStatusButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: none;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: color 150ms, background-color 150ms;

  &:hover {
    color: var(--color-text-primary);
    background-color: var(--color-gray-100);
  }
`;

const StatusDropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.25rem);
  inset-inline-start: 0;
  z-index: var(--z-dropdown);
  background-color: var(--color-paper);
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  border: 1px solid var(--color-gray-200);
  padding: 0.25rem 0;
  min-width: 130px;
`;

const StatusOption = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  text-align: start;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 150ms;
  font-weight: ${({ $active }) => ($active ? '700' : '400')};
  color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'inherit')};

  &:hover {
    background-color: var(--color-gray-50);
  }
`;
