import styled from '@emotion/styled';
import { ChevronDown } from 'lucide-react';
import { useDropdown } from '../../../hooks/useDropdown';
import type { IInstructionAssignee, InstructionStatus } from '../../../types';
import { STATUS_LABELS, statusOptions } from '../../../types';
import AssigneeRow from './AssigneeRow';

interface AssigneeSubTableProps {
  assignees: IInstructionAssignee[];
  onAssigneeStatusChange?: (assigneeId: string, status: InstructionStatus) => void;
  onBatchStatusChange?: (status: InstructionStatus) => void;
}

export default function AssigneeSubTable({
  assignees,
  onAssigneeStatusChange,
  onBatchStatusChange,
}: AssigneeSubTableProps) {
  const batchDropdown = useDropdown();

  const handleBatchStatusChange = (status: InstructionStatus) => {
    onBatchStatusChange?.(status);
    batchDropdown.setOpen(false);
  };

  return (
    <Root onClick={(e) => e.stopPropagation()}>
      {onBatchStatusChange && (
        <BatchRow>
          <BatchDropdownWrapper ref={batchDropdown.ref}>
            <BatchButton onClick={() => batchDropdown.setOpen(!batchDropdown.open)}>
              שנה מצב לכולם
              <BatchChevron size={12} $open={batchDropdown.open} />
            </BatchButton>
            {batchDropdown.open && (
              <BatchDropdown>
                {statusOptions.map((s) => (
                  <BatchOption key={s} onClick={() => handleBatchStatusChange(s)}>
                    {STATUS_LABELS[s]}
                  </BatchOption>
                ))}
              </BatchDropdown>
            )}
          </BatchDropdownWrapper>
        </BatchRow>
      )}

      <InnerTable>
        <thead>
          <HeaderRow>
            <Th>ממונה</Th>
            <Th>מצב</Th>
            <Th>תאריך שיבוץ</Th>
            {onAssigneeStatusChange && <Th>פעולות</Th>}
          </HeaderRow>
        </thead>
        <tbody>
          {assignees.map((assignee) => (
            <AssigneeRow
              key={assignee.id}
              assignee={assignee}
              onStatusChange={onAssigneeStatusChange}
            />
          ))}
        </tbody>
      </InnerTable>
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const BatchRow = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 0.25rem;
`;

const BatchDropdownWrapper = styled.div`
  position: relative;
`;

const BatchButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-primary);
  background-color: color-mix(in srgb, var(--color-primary) 5%, transparent);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
  }
`;

const BatchChevron = styled(ChevronDown)<{ $open: boolean }>`
  transition: transform 150ms;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const BatchDropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.25rem);
  inset-inline-start: 0;
  z-index: var(--z-dropdown);
  background-color: var(--color-paper);
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  border: 1px solid var(--color-gray-200);
  padding: 0.25rem 0;
  min-width: 140px;
`;

const BatchOption = styled.button`
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  text-align: start;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: var(--color-gray-50);
  }
`;

const InnerTable = styled.table`
  width: 100%;
  font-size: 0.875rem;
`;

const HeaderRow = styled.tr`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-gray-200);
`;

const Th = styled.th`
  text-align: start;
  padding: 0.375rem 0.75rem;
  font-weight: 600;
`;
