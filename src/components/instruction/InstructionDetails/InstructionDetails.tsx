import styled from '@emotion/styled';
import {
  Archive,
  ArrowLeftRight,
  Calendar,
  ChevronDown,
  ExternalLink,
  Link as LinkIcon,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  User as UserIcon,
} from 'lucide-react';
import type { IInstruction, InstructionStatus } from '../../../types';
import { STATUS_LABELS } from '../../../types';
import { computeAggregatedStatus } from '../../../utils/assigneeStatus';
import { formatDateHebrew, getDueDateDisplay } from '../../../utils/dateUtils';
import DropdownMenu from '../../shared/DropdownMenu/DropdownMenu';
import DropdownMenuContent from '../../shared/DropdownMenu/DropdownMenuContent';
import DropdownMenuItem from '../../shared/DropdownMenu/DropdownMenuItem';
import DropdownMenuSeparator from '../../shared/DropdownMenu/DropdownMenuSeparator';
import DropdownMenuTrigger from '../../shared/DropdownMenu/DropdownMenuTrigger';
import FieldLabel from '../../shared/FieldLabel';
import StatusChip from '../../shared/StatusChip';

interface InstructionDetailsProps {
  instruction: IInstruction;
  onStatusChange: (status: InstructionStatus) => void;
  onAssigneeStatusChange?: (assigneeId: string, status: InstructionStatus) => void;
  isAdmin?: boolean;
}

export default function InstructionDetails({
  instruction,
  onStatusChange,
  onAssigneeStatusChange,
  isAdmin = true,
}: InstructionDetailsProps) {
  const dueDisplay = getDueDateDisplay(instruction.dueDate ? new Date(instruction.dueDate) : null);
  const showDueLabel =
    dueDisplay && instruction.status !== 'completed' && instruction.status !== 'archived';

  return (
    <Section>
      <SectionTopRow>
        <SectionTitle>פרטי ההנחיה</SectionTitle>
        <DropdownMenu>
          <MenuTrigger aria-label="תפריט פעולות">
            <MoreHorizontal size={20} />
          </MenuTrigger>
          <DropdownMenuContent align="start">
            {isAdmin && (
              <DropdownMenuItem>
                <Pencil size={15} /> עדכון הנחיה
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <ArrowLeftRight size={15} /> העברה למערך
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive size={15} /> העבר לארכיון
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DangerItem>
              <Trash2 size={15} /> ביטול הנחיה
            </DangerItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SectionTopRow>

      <DetailsGrid>
        <div>
          <FieldLabel>מצב זרימה</FieldLabel>
          <StatusRow>
            {isAdmin ? (
              <SelectWrapper>
                <StatusSelect
                  value={instruction.status}
                  onChange={(e) => onStatusChange(e.target.value as InstructionStatus)}
                  aria-label="שנה מצב לכולם"
                >
                  {(Object.entries(STATUS_LABELS) as [InstructionStatus, string][]).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </StatusSelect>
                <SelectChevron size={14} />
              </SelectWrapper>
            ) : (
              <StatusText>{STATUS_LABELS[instruction.status]}</StatusText>
            )}
            {instruction.assignees.length > 1 && (
              <ProgressHint>
                ({computeAggregatedStatus(instruction.assignees).progressLabel} השלימו)
              </ProgressHint>
            )}
          </StatusRow>
        </div>

        <div>
          <FieldLabel>סגל ממונים</FieldLabel>
          {instruction.assignees.length > 0 ? (
            <AssigneeList>
              {instruction.assignees.map((assignee) => (
                <AssigneeItem key={assignee.id}>
                  <AssigneeAvatar>
                    <UserIcon size={14} />
                  </AssigneeAvatar>
                  <AssigneeInfo>
                    <AssigneeName>{assignee.user.name}</AssigneeName>
                    <StatusChip status={assignee.status} size="small" />
                  </AssigneeInfo>
                  {isAdmin && onAssigneeStatusChange && instruction.assignees.length > 1 && (
                    <AssigneeSelect
                      value={assignee.status}
                      onChange={(e) =>
                        onAssigneeStatusChange(assignee.id, e.target.value as InstructionStatus)
                      }
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`שנה מצב עבור ${assignee.user.name}`}
                    >
                      {(Object.entries(STATUS_LABELS) as [InstructionStatus, string][]).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        )
                      )}
                    </AssigneeSelect>
                  )}
                </AssigneeItem>
              ))}
            </AssigneeList>
          ) : (
            <EmptyText>לא שובצו ממונים</EmptyText>
          )}
        </div>

        <div>
          <FieldLabel>תג״ב</FieldLabel>
          <DueDateRow>
            <CalendarIcon size={16} />
            <DueDateText>
              {formatDateHebrew(instruction.dueDate ? new Date(instruction.dueDate) : null)}
            </DueDateText>
            {showDueLabel && (
              <DueDateLabel $color={dueDisplay!.color}>({dueDisplay!.text})</DueDateLabel>
            )}
          </DueDateRow>
        </div>

        <div>
          <FieldLabel>גורם מפקד</FieldLabel>
          {instruction.source ? (
            <SourceLink>
              <LinkIcon size={14} />
              <span>{instruction.source}</span>
              <ExternalLinkIcon size={12} />
            </SourceLink>
          ) : (
            <EmptyText>—</EmptyText>
          )}
        </div>
      </DetailsGrid>

      <div>
        <FieldLabel>סימוני זיהוי</FieldLabel>
        <TagList>
          {instruction.tags.length > 0 ? (
            instruction.tags.map((tag) => <Tag key={tag.id}>{tag.name}</Tag>)
          ) : (
            <EmptyText>אין סימונים</EmptyText>
          )}
          {isAdmin && (
            <AddTagButton>
              <Plus size={14} />
              שבץ
            </AddTagButton>
          )}
        </TagList>
      </div>

      <div>
        <FieldLabel>פירוט</FieldLabel>
        <Description>{instruction.description || 'אין פירוט'}</Description>
      </div>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const SectionTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-gray-100);
  padding-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
`;

const MenuTrigger = styled(DropdownMenuTrigger)`
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-disabled);
  border-radius: 0.5rem;
  transition: color 150ms, background-color 150ms;

  &:hover {
    color: var(--color-text-secondary);
    background-color: var(--color-gray-100);
  }
`;

const DangerItem = styled(DropdownMenuItem)`
  color: var(--color-error) !important;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 4rem;
  row-gap: 2.5rem;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 160px;
`;

const StatusSelect = styled.select`
  appearance: none;
  width: 100%;
  background-color: var(--color-paper);
  border: 1px solid var(--color-gray-200);
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  outline: none;
  cursor: pointer;
  transition: border-color 150ms;

  &:focus {
    border-color: var(--color-primary);
  }
`;

const SelectChevron = styled(ChevronDown)`
  position: absolute;
  right: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-disabled);
  pointer-events: none;
`;

const StatusText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const ProgressHint = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
`;

const AssigneeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const AssigneeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AssigneeAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: var(--color-gray-100);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AssigneeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const AssigneeName = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
`;

const AssigneeSelect = styled.select`
  font-size: 0.625rem;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.25rem;
  padding: 0.125rem 0.25rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  background-color: var(--color-paper);
`;

const EmptyText = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-disabled);
`;

const DueDateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const CalendarIcon = styled(Calendar)`
  color: var(--color-text-disabled);
`;

const DueDateText = styled.span``;

const DueDateLabel = styled.span<{ $color: string }>`
  font-size: 0.625rem;
  font-weight: 700;
  margin-inline-end: 0.5rem;
  color: ${({ $color }) => $color};
`;

const SourceLink = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-primary);
  font-weight: 500;
`;

const ExternalLinkIcon = styled(ExternalLink)`
  opacity: 0.5;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  background-color: var(--color-gray-50);
  color: var(--color-text-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 700;
  border: 1px solid var(--color-gray-100);
`;

const AddTagButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--color-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: color-mix(in srgb, var(--color-primary) 8%, transparent);
  }
`;

const Description = styled.p`
  color: var(--color-text-secondary);
  line-height: 1.6;
  font-size: 0.875rem;
  max-width: 48rem;
`;
