import styled from '@emotion/styled';
import { Check, ChevronDown, Plus, Trash2, X } from 'lucide-react';
import { DUE_DATE_TYPES, type DueDateType } from '../../../types';
import DropdownMenu from '../../shared/DropdownMenu/DropdownMenu';
import DropdownMenuContent from '../../shared/DropdownMenu/DropdownMenuContent';
import DropdownMenuItem from '../../shared/DropdownMenu/DropdownMenuItem';
import DropdownMenuTrigger from '../../shared/DropdownMenu/DropdownMenuTrigger';
import type { DiscussionInstruction, DiscussionMember } from './DiscussionDialog';

interface DiscussionTableProps {
  rows: DiscussionInstruction[];
  availableMembers: DiscussionMember[];
  onAddRow: () => void;
  onUpdateRow: (id: string, field: keyof DiscussionInstruction, value: unknown) => void;
  onRemoveRow: (id: string) => void;
  onToggleRowAssignee: (rowId: string, memberId: string) => void;
}

export default function DiscussionTable({
  rows,
  availableMembers,
  onAddRow,
  onUpdateRow,
  onRemoveRow,
  onToggleRowAssignee,
}: DiscussionTableProps) {
  return (
    <Wrapper>
      <TableContainer>
        <Table>
          <thead>
            <HeaderRow>
              <Th $width="20%">שם ההנחיה</Th>
              <Th $width="18%">תיאור מתומצת</Th>
              <Th $width="16%">אחראי</Th>
              <Th $width="16%">תג״ב</Th>
              <Th $width="15%">הערות וקישורים</Th>
              <Th $width="3%" />
            </HeaderRow>
          </thead>
          <tbody>
            {rows.map((row) => {
              const dueDateLabel =
                DUE_DATE_TYPES.find((d) => d.value === row.dueDateType)?.label || 'שוטף';
              return (
                <DataRow key={row.id}>
                  <Td>
                    <RowInput
                      type="text"
                      value={row.title}
                      onChange={(e) => onUpdateRow(row.id, 'title', e.target.value)}
                      placeholder="שם ההנחיה"
                      dir="rtl"
                    />
                  </Td>
                  <Td>
                    <RowInput
                      type="text"
                      value={row.description}
                      onChange={(e) => onUpdateRow(row.id, 'description', e.target.value)}
                      placeholder="תיאור קצר"
                      dir="rtl"
                    />
                  </Td>
                  <Td>
                    <AssigneeCell>
                      {row.assigneeIds.map((aId: string) => {
                        const member = availableMembers.find((m) => m.id === aId);
                        if (!member) return null;
                        return (
                          <AssigneeTag key={aId}>
                            {member.name}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleRowAssignee(row.id, aId);
                              }}
                            >
                              <X size={10} />
                            </button>
                          </AssigneeTag>
                        );
                      })}
                      <DropdownMenu>
                        <AssigneeTrigger>
                          {row.assigneeIds.length === 0 && (
                            <AssigneePlaceholder>בחר...</AssigneePlaceholder>
                          )}
                          <ChevronDown size={12} />
                        </AssigneeTrigger>
                        <DropdownMenuContent align="end">
                          {availableMembers.map((m) => (
                            <AssigneeOption
                              key={m.id}
                              onClick={() => onToggleRowAssignee(row.id, m.id)}
                              $selected={row.assigneeIds.includes(m.id)}
                            >
                              {row.assigneeIds.includes(m.id) && <Check size={12} />}
                              {m.name}
                            </AssigneeOption>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </AssigneeCell>
                  </Td>
                  <Td>
                    <DueDateCell>
                      <DropdownMenu>
                        <DueDateTrigger $type={row.dueDateType}>
                          {dueDateLabel}
                          <ChevronDown size={10} />
                        </DueDateTrigger>
                        <DropdownMenuContent align="start">
                          {DUE_DATE_TYPES.map((opt) => (
                            <DropdownMenuItem
                              key={opt.value}
                              onClick={() => onUpdateRow(row.id, 'dueDateType', opt.value)}
                            >
                              {opt.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {(row.dueDateType === 'routine' || row.dueDateType === 'date') && (
                        <RowDateInput
                          type="date"
                          value={row.dueDate}
                          onChange={(e) => onUpdateRow(row.id, 'dueDate', e.target.value)}
                        />
                      )}
                    </DueDateCell>
                  </Td>
                  <Td>
                    <RowInput
                      type="text"
                      value={row.notes}
                      onChange={(e) => onUpdateRow(row.id, 'notes', e.target.value)}
                      placeholder="הערות..."
                      dir="rtl"
                    />
                  </Td>
                  <Td>
                    <DeleteButton
                      type="button"
                      onClick={() => onRemoveRow(row.id)}
                      aria-label="מחק שורה"
                    >
                      <Trash2 size={14} />
                    </DeleteButton>
                  </Td>
                </DataRow>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <EmptyTd colSpan={6}>אין הנחיות עדיין — הוסף שורה או חלץ מטקסט</EmptyTd>
              </tr>
            )}
          </tbody>
        </Table>
      </TableContainer>

      <AddRowRow>
        <AddRowButton type="button" onClick={onAddRow} aria-label="הוסף שורה">
          <Plus size={16} />
        </AddRowButton>
      </AddRowRow>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const TableContainer = styled.div`
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  font-size: 0.875rem;
  min-width: 820px;
`;

const HeaderRow = styled.tr`
  background-color: var(--color-gray-50);
  border-bottom: 1px solid var(--color-gray-200);
`;

const Th = styled.th<{ $width?: string }>`
  padding: 0.625rem 0.75rem;
  text-align: start;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  width: ${({ $width }) => $width || 'auto'};
`;

const DataRow = styled.tr`
  border-bottom: 1px solid var(--color-gray-100);
  vertical-align: top;

  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: 0.5rem 0.75rem;
`;

const RowInput = styled.input`
  width: 100%;
  height: 2rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-gray-200);
  padding: 0 0.5rem;
  font-size: 0.75rem;
  background-color: var(--color-paper);
  outline: none;
  transition: border-color 150ms;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-primary) 30%, transparent);
  }
`;

const AssigneeCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
  min-height: 2rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-gray-200);
  padding: 0.25rem 0.5rem;
  background-color: var(--color-paper);
  cursor: pointer;
`;

const AssigneeTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  background-color: var(--color-info-light);
  color: var(--color-info);
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: inherit;
    display: flex;
    padding: 0;
  }
`;

const AssigneePlaceholder = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-disabled);
`;

const AssigneeTrigger = styled(DropdownMenuTrigger)`
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  padding: 0;
  margin-inline-start: auto;
`;

const AssigneeOption = styled(DropdownMenuItem)<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: ${({ $selected }) => ($selected ? '500' : '400')};
  color: ${({ $selected }) => ($selected ? 'var(--color-primary)' : 'inherit')} !important;
  background-color: ${({ $selected }) =>
    $selected
      ? 'color-mix(in srgb, var(--color-primary) 5%, transparent)'
      : 'transparent'} !important;
`;

const DueDateCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const DueDateTrigger = styled(DropdownMenuTrigger)<{ $type: DueDateType }>`
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  white-space: nowrap;
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

const RowDateInput = styled.input`
  height: 1.75rem;
  border-radius: 0.25rem;
  border: 1px solid var(--color-gray-200);
  padding: 0 0.25rem;
  font-size: 0.625rem;
  width: 100px;
  outline: none;
  transition: border-color 150ms;

  &:focus {
    border-color: var(--color-primary);
  }
`;

const DeleteButton = styled.button`
  padding: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-disabled);
  border-radius: 0.25rem;
  transition: color 150ms;
  display: flex;

  &:hover {
    color: var(--color-error);
  }
`;

const EmptyTd = styled.td`
  padding: 2rem 0.75rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-disabled);
`;

const AddRowRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

const AddRowButton = styled.button`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: var(--color-primary);
  color: var(--color-paper);
  border: none;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: opacity 150ms;

  &:hover {
    opacity: 0.9;
  }
`;
