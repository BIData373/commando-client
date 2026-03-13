import styled from '@emotion/styled';
import { Archive, Eye, Flag, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  type IInstructionListItem,
  type InstructionStatus,
  STATUS_COLORS,
  STATUS_LABELS,
} from '../../types';
import { formatDate } from '../../utils/dateUtils';
import DropdownMenu from '../shared/DropdownMenu/DropdownMenu';
import DropdownMenuContent from '../shared/DropdownMenu/DropdownMenuContent';
import DropdownMenuItem from '../shared/DropdownMenu/DropdownMenuItem';
import DropdownMenuSeparator from '../shared/DropdownMenu/DropdownMenuSeparator';
import DropdownMenuTrigger from '../shared/DropdownMenu/DropdownMenuTrigger';
import PriorityChip from '../shared/PriorityChip';
import StatusChip from '../shared/StatusChip';
import UserAvatarGroup from '../shared/UserAvatarGroup';

type GroupBy = 'status' | 'assignee' | 'source';

interface GroupedColumn {
  key: string;
  label: string;
  color: string;
  items: IInstructionListItem[];
}

interface CardsViewProps {
  instructions: IInstructionListItem[];
  envId: string;
  onViewInstruction?: (id: string) => void;
  onArchiveInstruction?: (id: string) => void;
  onRestoreInstruction?: (id: string) => void;
}

interface ColumnDotProps {
  $color: string;
}

interface DueDateTextProps {
  $color: string;
}

interface ColorDropdownMenuItemProps {
  $color: string;
}

const groupOptions: { value: GroupBy; label: string }[] = [
  { value: 'status', label: 'מצב' },
  { value: 'assignee', label: 'ממונה' },
  { value: 'source', label: 'גורם מפקד' },
];

function getDueDateColor(dueDate: Date | null, status: InstructionStatus): string {
  if (!dueDate || status === 'completed' || status === 'archived')
    return 'var(--color-text-secondary)';
  const diffDays = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'var(--color-error)';
  if (diffDays <= 3) return 'var(--color-warning)';
  return 'var(--color-text-secondary)';
}

function groupByStatus(instructions: IInstructionListItem[]): GroupedColumn[] {
  const statusOrder: InstructionStatus[] = ['open', 'inProgress', 'completed', 'archived'];
  return statusOrder.map((status) => ({
    key: status,
    label: STATUS_LABELS[status],
    color: STATUS_COLORS[status],
    items: instructions.filter((i) => i.status === status),
  }));
}

function groupByAssignee(instructions: IInstructionListItem[]): GroupedColumn[] {
  const map = new Map<string, { label: string; items: IInstructionListItem[] }>();
  const colors = ['#3f51b5', '#7c4dff', '#e91e63', '#009688', '#ff5722', '#795548'];

  instructions.forEach((inst) => {
    if (inst.assignees.length === 0) {
      const existing = map.get('unassigned');
      if (existing) existing.items.push(inst);
      else map.set('unassigned', { label: 'ללא ממונה', items: [inst] });
    } else {
      inst.assignees.forEach((a) => {
        const existing = map.get(a.user.id);
        if (existing) {
          if (!existing.items.find((x) => x.id === inst.id)) existing.items.push(inst);
        } else {
          map.set(a.user.id, { label: a.user.name, items: [inst] });
        }
      });
    }
  });

  let idx = 0;
  return Array.from(map.entries()).map(([key, val]) => ({
    key,
    label: val.label,
    color: colors[idx++ % colors.length],
    items: val.items,
  }));
}

function groupBySource(instructions: IInstructionListItem[]): GroupedColumn[] {
  const map = new Map<string, IInstructionListItem[]>();
  const colors = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

  instructions.forEach((inst) => {
    const src = inst.source || 'ללא גורם מפקד';
    const existing = map.get(src);
    if (existing) existing.push(inst);
    else map.set(src, [inst]);
  });

  let idx = 0;
  return Array.from(map.entries()).map(([key, items]) => ({
    key,
    label: key,
    color: colors[idx++ % colors.length],
    items,
  }));
}

const groupedColumnsPredicates: Record<
  GroupBy,
  (instructions: IInstructionListItem[]) => GroupedColumn[]
> = {
  status: groupByStatus,
  assignee: groupByAssignee,
  source: groupBySource,
};

export default function CardsView({
  instructions,
  envId,
  onViewInstruction,
  onArchiveInstruction,
  onRestoreInstruction,
}: CardsViewProps) {
  const navigate = useNavigate();
  const [groupBy, setGroupBy] = useState<GroupBy>('status');

  const groupedColumns = groupedColumnsPredicates[groupBy](instructions);

  const handleCardClick = (instruction: IInstructionListItem) => {
    if (onViewInstruction) {
      onViewInstruction(instruction.id);
    } else {
      navigate(`/env/${envId}/i/${instruction.id}`);
    }
  };

  return (
    <Root>
      <GroupToggleRow>
        <GroupToggleLabel>קיבוץ לפי:</GroupToggleLabel>
        <GroupToggleButtons>
          {groupOptions.map((opt) => (
            <GroupToggleButton
              key={opt.value}
              $active={groupBy === opt.value}
              onClick={() => setGroupBy(opt.value)}
            >
              {opt.label}
            </GroupToggleButton>
          ))}
        </GroupToggleButtons>
      </GroupToggleRow>

      <KanbanBoard>
        {groupedColumns.map((column) => (
          <KanbanColumn key={column.key}>
            <ColumnHeader>
              <ColumnDot $color={column.color} />
              <ColumnLabel>{column.label}</ColumnLabel>
              <ColumnCount>{column.items.length}</ColumnCount>
            </ColumnHeader>

            <ColumnBody>
              {column.items.length === 0 && (
                <EmptyColumn>
                  <EmptyText>אין הנחיות</EmptyText>
                </EmptyColumn>
              )}

              {column.items.map((instruction) => (
                <InstructionCard key={instruction.id} onClick={() => handleCardClick(instruction)}>
                  <CardTopRow>
                    <PriorityChip priority={instruction.priority} />
                    <CardActions>
                      <StatusChip status={instruction.status} />
                      <DropdownMenu>
                        <CardMenuTrigger aria-label="פעולות">
                          <MoreVertical size={16} />
                        </CardMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleCardClick(instruction)}>
                            <Eye size={16} /> צפה בהנחיה
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {instruction.status === 'archived'
                            ? onRestoreInstruction && (
                                <ColorDropdownMenuItem
                                  $color="var(--color-success)"
                                  onClick={() => onRestoreInstruction(instruction.id)}
                                >
                                  <Archive size={16} /> שחזור מארכיון
                                </ColorDropdownMenuItem>
                              )
                            : onArchiveInstruction && (
                                <ColorDropdownMenuItem
                                  $color="var(--color-warning)"
                                  onClick={() => onArchiveInstruction(instruction.id)}
                                >
                                  <Archive size={16} /> העברה לארכיון
                                </ColorDropdownMenuItem>
                              )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardActions>
                  </CardTopRow>

                  <CardTitleRow>
                    {instruction.isImportant && <FlagIcon size={16} />}
                    <CardTitle>{instruction.title}</CardTitle>
                  </CardTitleRow>

                  {instruction.assignees.length > 0 && (
                    <AssigneesRow>
                      <UserAvatarGroup
                        users={instruction.assignees.map((a) => a.user)}
                        max={3}
                        size={26}
                      />
                    </AssigneesRow>
                  )}

                  {instruction.dueDate && (
                    <DueDateText
                      $color={getDueDateColor(new Date(instruction.dueDate), instruction.status)}
                    >
                      תג״ב: {formatDate(new Date(instruction.dueDate))}
                    </DueDateText>
                  )}
                </InstructionCard>
              ))}
            </ColumnBody>
          </KanbanColumn>
        ))}
      </KanbanBoard>
    </Root>
  );
}

const Root = styled.div``;

const GroupToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const GroupToggleLabel = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
`;

const GroupToggleButtons = styled.div`
  display: inline-flex;
  border-radius: 0.5rem;
  border: 1px solid var(--color-gray-200);
  overflow: hidden;
`;

const GroupToggleButton = styled.button<{ $active: boolean }>`
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 150ms, color 150ms;
  background-color: ${({ $active }) => ($active ? 'color-mix(in srgb, var(--color-primary) 10%, transparent)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-text-secondary)')};

  &:hover {
    background-color: ${({ $active }) => ($active ? 'color-mix(in srgb, var(--color-primary) 10%, transparent)' : 'var(--color-gray-50)')};
  }
`;

const KanbanBoard = styled.div`
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.75rem;
  min-height: 400px;
`;

const KanbanColumn = styled.div`
  min-width: 300px;
  max-width: 340px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding: 0 0.25rem;
`;

const ColumnDot = styled.div<ColumnDotProps>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  flex-shrink: 0;
  background-color: ${({ $color }) => $color};
`;

const ColumnLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
`;

const ColumnCount = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  background-color: var(--color-gray-100);
  border-radius: 9999px;
  padding: 0.125rem 0.5rem;
`;

const ColumnBody = styled.div`
  flex: 1;
  background-color: var(--color-gray-50);
  border-radius: 0.5rem;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 100px;
`;

const EmptyColumn = styled.div`
  padding: 2rem 0;
  text-align: center;
`;

const EmptyText = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-disabled);
`;

const InstructionCard = styled.div`
  background-color: var(--color-paper);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-card);
  padding: 0.75rem;
  cursor: pointer;
  text-align: start;
  transition: box-shadow 150ms, transform 150ms;

  &:hover {
    box-shadow: var(--shadow-hover);
    transform: translateY(-1px);
  }
`;

const CardTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const CardMenuTrigger = styled(DropdownMenuTrigger)`
  padding: 0.25rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  background-color: transparent;
  color: var(--color-text-secondary);
  transition: background-color 150ms, color 150ms;

  &:hover {
    background-color: var(--color-gray-100);
    color: var(--color-text-primary);
  }
`;

const CardTitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
`;

const FlagIcon = styled(Flag)`
  color: var(--color-warning);
  fill: var(--color-warning);
  flex-shrink: 0;
  margin-top: 0.125rem;
`;

const CardTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const AssigneesRow = styled.div`
  margin-bottom: 0.5rem;
`;

const DueDateText = styled.span<DueDateTextProps>`
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.25rem;
  display: block;
  color: ${({ $color }) => $color};
`;

const ColorDropdownMenuItem = styled(DropdownMenuItem)<ColorDropdownMenuItemProps>`
  color: ${({ $color }) => $color} !important;
`;
