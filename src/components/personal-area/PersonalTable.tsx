import styled from '@emotion/styled';
import {
  AlertTriangle,
  Archive,
  ChevronDown,
  ChevronUp,
  Columns3,
  Edit,
  Eye,
  EyeOff,
  Flag,
  FolderInput,
  GripVertical,
  Link2,
  MessageSquare,
  MoreVertical,
  Sparkles,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IInstructionListItem, IPersonalInstruction, SortDirection } from '../../types';
import { formatDate, getDueDateDisplay, isNew } from '../../utils/dateUtils';
import Checkbox from '../shared/Checkbox';
import DropdownMenu from '../shared/DropdownMenu/DropdownMenu';
import DropdownMenuContent from '../shared/DropdownMenu/DropdownMenuContent';
import DropdownMenuItem from '../shared/DropdownMenu/DropdownMenuItem';
import DropdownMenuSeparator from '../shared/DropdownMenu/DropdownMenuSeparator';
import DropdownMenuTrigger from '../shared/DropdownMenu/DropdownMenuTrigger';
import StatusChip from '../shared/StatusChip';
import Tooltip from '../shared/Tooltip';
import UserAvatarGroup from '../shared/UserAvatarGroup';

interface ColDef {
  id: string;
  label: string;
  sortable: boolean;
  defaultVisible: boolean;
  minWidth?: number;
}

interface PersonalTableProps {
  instructions: IPersonalInstruction[];
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onViewInstruction: (instructionId: string, envId: string) => void;
}

interface ThProps {
  $minWidth?: number;
}

interface DataRowProps {
  $selected: boolean;
}

interface ColumnItemProps {
  $isDragging: boolean;
  $isDragOver: boolean;
  $isFixed: boolean;
}

interface DueDateSubtextProps {
  $color: string;
}

interface ColorMenuItemProps {
  $color: string;
}

type DueDateInfo = ReturnType<typeof getDueDateDisplay>;
type CellRenderer = (instruction: IPersonalInstruction, dueDateInfo: DueDateInfo) => ReactNode;

const TABLE_COLUMNS: ColDef[] = [
  { id: 'title', label: 'שם ההנחיה', sortable: true, defaultVisible: true, minWidth: 200 },
  {
    id: 'description',
    label: 'פירוט ההנחיה',
    sortable: false,
    defaultVisible: true,
    minWidth: 160,
  },
  { id: 'assignees', label: 'אחראים', sortable: false, defaultVisible: true, minWidth: 110 },
  { id: 'dueDate', label: 'תג״ב', sortable: true, defaultVisible: true, minWidth: 130 },
  { id: 'source', label: 'מקור', sortable: true, defaultVisible: true, minWidth: 140 },
  {
    id: 'notesLinks',
    label: 'הערות וקישורים',
    sortable: false,
    defaultVisible: true,
    minWidth: 120,
  },
  { id: 'createdAt', label: 'תאריך יצירה', sortable: true, defaultVisible: true, minWidth: 110 },
  { id: 'status', label: 'סטטוס', sortable: false, defaultVisible: true, minWidth: 110 },
  { id: 'updatedAt', label: 'עודכן ב', sortable: true, defaultVisible: true, minWidth: 110 },
  { id: 'environment', label: 'שם הסביבה', sortable: true, defaultVisible: true, minWidth: 110 },
  { id: 'actions', label: '', sortable: false, defaultVisible: true, minWidth: 48 },
];

const SORT_GETTERS: Partial<Record<string, (inst: IPersonalInstruction) => unknown>> = {
  environment: (inst) => inst.environmentName,
};

function getSortValue(inst: IPersonalInstruction, field: string): unknown {
  return SORT_GETTERS[field]?.(inst) ?? inst[field as keyof IInstructionListItem];
}

function sortInstructionList(
  instructions: IPersonalInstruction[],
  field: string,
  direction: SortDirection
): IPersonalInstruction[] {
  return [...instructions].sort((a, b) => {
    const aVal = getSortValue(a, field);
    const bVal = getSortValue(b, field);

    if (aVal == null) return 1;
    if (bVal == null) return -1;

    let compare: number;
    if (aVal instanceof Date && bVal instanceof Date) {
      compare = aVal.getTime() - bVal.getTime();
    } else {
      compare = String(aVal).localeCompare(String(bVal), 'he');
    }
    return direction === 'desc' ? -compare : compare;
  });
}

export default function PersonalTable({
  instructions,
  onArchive,
  onRestore,
  onViewInstruction,
}: PersonalTableProps) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(TABLE_COLUMNS.filter((c) => c.defaultVisible).map((c) => c.id))
  );
  const [columnOrder, setColumnOrder] = useState(TABLE_COLUMNS);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const sortedInstructions = sortInstructionList(instructions, sortField, sortDirection);
  const activeColumns = columnOrder.filter((c) => visibleColumns.has(c.id));

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? new Set(instructions.map((i) => i.id)) : new Set());
  };

  const handleSelectRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleColumn = (colId: string) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(colId)) {
        if (colId === 'title' || colId === 'actions') return prev;
        next.delete(colId);
      } else {
        next.add(colId);
      }
      return next;
    });
  };

  const handleColumnDragStart = (index: number) => setDragIndex(index);
  const handleColumnDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  const handleColumnDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    setColumnOrder((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const handleColumnDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <TableWrapper>
      <ColumnMenuRow>
        <DropdownMenu>
          <Tooltip content="הצג/הסתר עמודות">
            <ColumnMenuTrigger>
              <Columns3 size={16} />
            </ColumnMenuTrigger>
          </Tooltip>
          <DropdownMenuContent align="end">
            {columnOrder
              .filter((c) => c.id !== 'actions')
              .map((col, idx) => {
                const isFixed = col.id === 'title';
                return (
                  <ColumnItem
                    key={col.id}
                    draggable={!isFixed}
                    $isFixed={isFixed}
                    $isDragging={dragIndex === idx}
                    $isDragOver={dragOverIndex === idx && dragIndex !== idx}
                    onDragStart={() => !isFixed && handleColumnDragStart(idx)}
                    onDragOver={(e) => !isFixed && handleColumnDragOver(e, idx)}
                    onDrop={() => !isFixed && handleColumnDrop(idx)}
                    onDragEnd={handleColumnDragEnd}
                  >
                    {isFixed ? <GripPlaceholder /> : <GripHandle size={14} />}
                    <ColumnToggleBtn onClick={() => toggleColumn(col.id)} disabled={isFixed}>
                      {visibleColumns.has(col.id) ? <Eye size={16} /> : <EyeOff size={16} />}
                      <span>{col.label}</span>
                    </ColumnToggleBtn>
                  </ColumnItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </ColumnMenuRow>

      <TableContainer>
        <StyledTable>
          <thead>
            <HeaderRow>
              <CheckboxTh>
                <Checkbox
                  checked={instructions.length > 0 && selected.size === instructions.length}
                  indeterminate={selected.size > 0 && selected.size < instructions.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  aria-label="בחר הכל"
                />
              </CheckboxTh>
              {activeColumns.map((col) => (
                <Th key={col.id} $minWidth={col.minWidth}>
                  {col.sortable ? (
                    <SortBtn onClick={() => handleSort(col.id)}>
                      {col.label}
                      {sortField === col.id &&
                        (sortDirection === 'asc' ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        ))}
                    </SortBtn>
                  ) : (
                    col.label
                  )}
                </Th>
              ))}
            </HeaderRow>
          </thead>
          <tbody>
            {sortedInstructions.map((instruction) => {
              const dueDateInfo = getDueDateDisplay(
                instruction.dueDate ? new Date(instruction.dueDate) : null,
                instruction.status
              );
              return (
                <DataRow
                  key={instruction.id}
                  $selected={selected.has(instruction.id)}
                  onClick={() => onViewInstruction(instruction.id, instruction.environmentId)}
                >
                  <CheckboxTd>
                    <Checkbox
                      checked={selected.has(instruction.id)}
                      onChange={() => handleSelectRow(instruction.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </CheckboxTd>
                  {activeColumns.map((col) => (
                    <DataTd key={col.id}>
                      {col.id === 'actions' ? (
                        <DropdownMenu>
                          <ActionMenuTrigger aria-label="פעולות">
                            <MoreVertical size={16} />
                          </ActionMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                onViewInstruction(instruction.id, instruction.environmentId)
                              }
                            >
                              <Edit size={16} /> צפה בהנחיה
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => navigate(`/env/${instruction.environmentId}`)}
                            >
                              <FolderInput size={16} /> עבור למערך
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {instruction.status === 'archived' ? (
                              <ColorMenuItem
                                $color="var(--color-success)"
                                onClick={() => onRestore(instruction.id)}
                              >
                                <Archive size={16} /> שחזור מארכיון
                              </ColorMenuItem>
                            ) : (
                              <ColorMenuItem
                                $color="var(--color-warning)"
                                onClick={() => onArchive(instruction.id)}
                              >
                                <Archive size={16} /> העברה לארכיון
                              </ColorMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        COLUMN_RENDERERS[col.id]?.(instruction, dueDateInfo)
                      )}
                    </DataTd>
                  ))}
                </DataRow>
              );
            })}
          </tbody>
        </StyledTable>
      </TableContainer>
    </TableWrapper>
  );
}

// ── Styled Components ────────────────────────────────────────────────────────

const TableWrapper = styled.div``;

const ColumnMenuRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
  position: relative;
`;

const ColumnMenuTrigger = styled(DropdownMenuTrigger)`
  padding: 0.375rem;
  border-radius: 0.375rem;
  border: none;
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background-color 150ms, color 150ms;

  &:hover {
    background-color: var(--color-gray-100);
    color: var(--color-text-primary);
  }
`;

const GripHandle = styled(GripVertical)`
  color: var(--color-text-disabled);
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 150ms;
`;

const GripPlaceholder = styled.span`
  width: 0.875rem;
  flex-shrink: 0;
`;

const ColumnItem = styled.div<ColumnItemProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  text-align: start;
  transition: background-color 150ms;
  cursor: ${({ $isFixed }) => ($isFixed ? 'not-allowed' : 'grab')};
  opacity: ${({ $isFixed, $isDragging }) => ($isFixed ? 0.5 : $isDragging ? 0.4 : 1)};
  border-top: ${({ $isDragOver }) => ($isDragOver ? '2px solid var(--color-primary)' : '2px solid transparent')};

  &:hover {
    background-color: ${({ $isFixed }) => ($isFixed ? 'transparent' : 'var(--color-gray-50)')};
  }

  &:hover ${GripHandle} {
    opacity: 1;
  }
`;

const ColumnToggleBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  color: inherit;
  text-align: start;

  &:disabled {
    cursor: not-allowed;
  }
`;

const TableContainer = styled.div`
  background-color: var(--color-paper);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
`;

const HeaderRow = styled.tr`
  background-color: var(--color-gray-50);
`;

const CheckboxTh = styled.th`
  width: 3rem;
  padding: 0.75rem;
`;

const Th = styled.th<ThProps>`
  padding: 0.75rem;
  text-align: start;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  white-space: nowrap;
  ${({ $minWidth }) => $minWidth && `min-width: ${$minWidth}px;`}
`;

const SortBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
  transition: color 150ms;

  &:hover {
    color: var(--color-text-primary);
  }
`;

const DataRow = styled.tr<DataRowProps>`
  border-top: 1px solid var(--color-gray-100);
  cursor: pointer;
  transition: background-color 150ms;
  background-color: ${({ $selected }) => ($selected ? 'color-mix(in srgb, var(--color-primary) 5%, transparent)' : 'transparent')};

  &:hover {
    background-color: var(--color-gray-50);
  }
`;

const CheckboxTd = styled.td`
  padding: 0.625rem 0.75rem;
`;

const DataTd = styled.td`
  padding: 0.625rem 0.75rem;
`;

const ActionMenuTrigger = styled(DropdownMenuTrigger)`
  padding: 0.25rem;
  border-radius: 0.25rem;
  border: none;
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background-color 150ms, color 150ms;

  &:hover {
    background-color: var(--color-gray-100);
    color: var(--color-text-primary);
  }
`;

const ColorMenuItem = styled(DropdownMenuItem)<ColorMenuItemProps>`
  color: ${({ $color }) => $color} !important;
`;

// ── Cell content styled components ──────────────────────────────────────────

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const TitleFlagIcon = styled(Flag)`
  color: var(--color-warning);
  fill: var(--color-warning);
  flex-shrink: 0;
`;

const TitleText = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  transition: color 150ms;

  &:hover {
    color: var(--color-primary);
  }
`;

const NewBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  padding: 0.125rem 0.375rem;
  font-size: 0.65rem;
  font-weight: 600;
  border-radius: 9999px;
  background-color: var(--color-info-light);
  color: var(--color-info);
`;

const DateText = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

const DueDateWrapper = styled.div``;

const DueDateSubtext = styled.span<DueDateSubtextProps>`
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ $color }) => $color};
`;

const EnvironmentBadge = styled.span`
  display: inline-block;
  padding: 0.125rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  background-color: color-mix(in srgb, var(--color-primary) 8%, transparent);
  color: var(--color-primary);
  border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
`;

const DescriptionText = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 200px;
`;

const SourceText = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 160px;
`;

const NotesLinksWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CommentCount = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
`;

const LinkIconWrapper = styled.span`
  color: var(--color-text-secondary);
  display: flex;
`;

const EmptyDash = styled.span`
  color: var(--color-text-disabled);
`;

// ── Column cell renderers ────────────────────────────────────────────────────

const COLUMN_RENDERERS: Partial<Record<string, CellRenderer>> = {
  title: (inst, dueDateInfo) => (
    <TitleWrapper>
      {inst.isImportant && (
        <Tooltip content="הנחיה חשובה">
          <TitleFlagIcon size={16} />
        </Tooltip>
      )}
      <TitleText>{inst.title}</TitleText>
      {isNew(new Date(inst.createdAt)) && (
        <NewBadge>
          <Sparkles size={12} /> חדשה
        </NewBadge>
      )}
      {dueDateInfo?.overdue && <AlertTriangle size={14} color="var(--color-error)" />}
    </TitleWrapper>
  ),
  createdAt: (inst) => <DateText>{formatDate(new Date(inst.createdAt))}</DateText>,
  status: (inst) => <StatusChip status={inst.status} />,
  updatedAt: (inst) => <DateText>{formatDate(new Date(inst.updatedAt))}</DateText>,
  dueDate: (inst, dueDateInfo) => (
    <DueDateWrapper>
      <DateText>{formatDate(inst.dueDate ? new Date(inst.dueDate) : null)}</DateText>
      {dueDateInfo && (
        <DueDateSubtext $color={dueDateInfo.color}>{dueDateInfo.text}</DueDateSubtext>
      )}
    </DueDateWrapper>
  ),
  assignees: (inst) => (
    <UserAvatarGroup users={inst.assignees.map((a) => a.user)} max={3} size={28} />
  ),
  description: (inst) => <DescriptionText>{inst.description || '—'}</DescriptionText>,
  environment: (inst) => <EnvironmentBadge>{inst.environmentName}</EnvironmentBadge>,
  source: (inst) => <SourceText>{inst.source || '—'}</SourceText>,
  notesLinks: (inst) => (
    <NotesLinksWrapper>
      {inst.commentCount > 0 && (
        <Tooltip content={`${inst.commentCount} הערות`}>
          <CommentCount>
            <MessageSquare size={14} />
            {inst.commentCount}
          </CommentCount>
        </Tooltip>
      )}
      {inst.source && (
        <Tooltip content={inst.source}>
          <LinkIconWrapper>
            <Link2 size={14} />
          </LinkIconWrapper>
        </Tooltip>
      )}
      {!inst.commentCount && !inst.source && <EmptyDash>—</EmptyDash>}
    </NotesLinksWrapper>
  ),
};
