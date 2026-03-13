import styled from '@emotion/styled';
import {
  Archive,
  ChevronDown,
  ChevronUp,
  Columns3,
  Edit,
  Eye,
  EyeOff,
  Flag,
  GripVertical,
  Link2,
  MessageSquare,
  MoreVertical,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';
import { Fragment, useState } from 'react';
import { useDropdown } from '../../../hooks/useDropdown';
import type { IInstructionListItem, InstructionStatus, SortDirection } from '../../../types';
import { DUE_DATE_TYPE_LABELS } from '../../../types';
import { computeAggregatedStatus } from '../../../utils/assigneeStatus';
import { formatDate, getDueDateDisplay, isNew } from '../../../utils/dateUtils';
import Checkbox from '../../shared/Checkbox';
import DropdownMenu from '../../shared/DropdownMenu/DropdownMenu';
import DropdownMenuContent from '../../shared/DropdownMenu/DropdownMenuContent';
import DropdownMenuItem from '../../shared/DropdownMenu/DropdownMenuItem';
import DropdownMenuSeparator from '../../shared/DropdownMenu/DropdownMenuSeparator';
import DropdownMenuTrigger from '../../shared/DropdownMenu/DropdownMenuTrigger';
import StatusChip from '../../shared/StatusChip';
import Tooltip from '../../shared/Tooltip';
import UserAvatarGroup from '../../shared/UserAvatarGroup';
import AssigneeSubTable from './AssigneeSubTable';
import ColumnHeaderCell from './ColumnHeaderCell';

interface FilterOption {
  value: string;
  label: string;
}

export interface ColumnFilterOptions {
  assignees: FilterOption[];
  dueDate: FilterOption[];
  status: FilterOption[];
}

interface ColumnDef {
  id: string;
  label: string;
  sortable: boolean;
  filterable: boolean;
  defaultVisible: boolean;
  minWidth?: number;
}

type DueDateVariant = 'immediate' | 'routine';

const columns: ColumnDef[] = [
  {
    id: 'title',
    label: 'שם ההנחיה',
    sortable: false,
    filterable: false,
    defaultVisible: true,
    minWidth: 200,
  },
  {
    id: 'description',
    label: 'פירוט ההנחיה',
    sortable: false,
    filterable: false,
    defaultVisible: true,
    minWidth: 160,
  },
  {
    id: 'assignees',
    label: 'אחראים',
    sortable: false,
    filterable: true,
    defaultVisible: true,
    minWidth: 120,
  },
  {
    id: 'dueDate',
    label: 'תג״ב',
    sortable: true,
    filterable: true,
    defaultVisible: true,
    minWidth: 130,
  },
  {
    id: 'source',
    label: 'מקור',
    sortable: false,
    filterable: false,
    defaultVisible: true,
    minWidth: 140,
  },
  {
    id: 'notesLinks',
    label: 'הערות וקישורים',
    sortable: false,
    filterable: false,
    defaultVisible: true,
    minWidth: 120,
  },
  {
    id: 'createdAt',
    label: 'תאריך יצירה',
    sortable: true,
    filterable: false,
    defaultVisible: true,
    minWidth: 120,
  },
  {
    id: 'status',
    label: 'סטטוס',
    sortable: false,
    filterable: true,
    defaultVisible: true,
    minWidth: 110,
  },
  {
    id: 'updatedAt',
    label: 'עודכן ב',
    sortable: true,
    filterable: false,
    defaultVisible: true,
    minWidth: 120,
  },
  {
    id: 'actions',
    label: '',
    sortable: false,
    filterable: false,
    defaultVisible: true,
    minWidth: 48,
  },
];

interface InstructionsTableProps {
  instructions: IInstructionListItem[];
  sortState: { column: string | null; direction: SortDirection | null };
  onSort: (column: string) => void;
  columnFilters: Record<string, string[]>;
  filterOptions: ColumnFilterOptions;
  onFilterApply: (column: string, values: string[]) => void;
  onFilterReset: (column: string) => void;
  onViewInstruction: (instructionId: string) => void;
  onEditInstruction?: (instructionId: string) => void;
  onArchiveInstruction: (instructionId: string) => void;
  onRestoreInstruction?: (instructionId: string) => void;
  onDeleteInstruction: (instructionId: string) => void;
  onAssigneeStatusChange?: (
    instructionId: string,
    assigneeId: string,
    status: InstructionStatus
  ) => void;
  onBatchStatusChange?: (instructionId: string, status: InstructionStatus) => void;
}

// FIX Table isnt updating from create single instruction or create discussion
export default function InstructionsTable({
  instructions,
  sortState,
  onSort,
  columnFilters,
  filterOptions,
  onFilterApply,
  onFilterReset,
  onViewInstruction,
  onEditInstruction,
  onArchiveInstruction,
  onRestoreInstruction,
  onDeleteInstruction,
  onAssigneeStatusChange,
  onBatchStatusChange,
}: InstructionsTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.filter((c) => c.defaultVisible).map((c) => c.id))
  );
  const [columnOrder, setColumnOrder] = useState(columns);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const columnMenu = useDropdown();

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

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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

  const getFilterOptionsForColumn = (colId: string): FilterOption[] => {
    return (filterOptions as unknown as Record<string, FilterOption[]>)[colId] || [];
  };

  const activeColumns = columnOrder.filter((c) => visibleColumns.has(c.id));

  return (
    <Root>
      <ColumnToggleRow ref={columnMenu.ref}>
        <Tooltip content="הצג/הסתר עמודות טבלה">
          <ColumnToggleButton
            onClick={() => columnMenu.setOpen(!columnMenu.open)}
            aria-label="הצג/הסתר עמודות טבלה"
          >
            <Columns3 size={16} />
          </ColumnToggleButton>
        </Tooltip>

        {columnMenu.open && (
          <ColumnMenu>
            {columnOrder
              .filter((c) => c.id !== 'actions')
              .map((col, idx) => {
                const isDraggable = col.id !== 'title';
                return (
                  <ColumnMenuItem
                    key={col.id}
                    $fixed={!isDraggable}
                    $isDragging={dragIndex === idx}
                    $isDragOver={dragOverIndex === idx && dragIndex !== idx}
                    draggable={isDraggable}
                    onDragStart={() => isDraggable && handleColumnDragStart(idx)}
                    onDragOver={(e) => isDraggable && handleColumnDragOver(e, idx)}
                    onDrop={() => isDraggable && handleColumnDrop(idx)}
                    onDragEnd={handleColumnDragEnd}
                  >
                    {isDraggable ? <GripHandle size={14} /> : <GripPlaceholder />}
                    <ColumnVisibilityButton
                      onClick={() => toggleColumn(col.id)}
                      disabled={col.id === 'title'}
                    >
                      {visibleColumns.has(col.id) ? <Eye size={16} /> : <EyeOffIcon size={16} />}
                      <span>{col.label}</span>
                    </ColumnVisibilityButton>
                  </ColumnMenuItem>
                );
              })}
          </ColumnMenu>
        )}
      </ColumnToggleRow>

      <TableWrapper>
        <Table>
          <thead>
            <HeaderRow>
              <CheckboxTh>
                <Checkbox
                  checked={instructions.length > 0 && selected.size === instructions.length}
                  indeterminate={selected.size > 0 && selected.size < instructions.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  aria-label="סמן הכל"
                />
              </CheckboxTh>
              {activeColumns.map((col) =>
                col.id === 'actions' ? (
                  <ActionsTh key={col.id} $minWidth={col.minWidth} />
                ) : (
                  <ColumnHeaderCell
                    key={col.id}
                    label={col.label}
                    minWidth={col.minWidth}
                    sortable={col.sortable}
                    filterable={col.filterable}
                    sortState={sortState}
                    columnId={col.id}
                    filterValues={columnFilters[col.id] || []}
                    filterOptions={getFilterOptionsForColumn(col.id)}
                    onSort={() => onSort(col.id)}
                    onFilterApply={(values) => onFilterApply(col.id, values)}
                    onFilterReset={() => onFilterReset(col.id)}
                  />
                )
              )}
            </HeaderRow>
          </thead>
          <tbody>
            {instructions.map((instruction) => {
              const dueDisplay = getDueDateDisplay(
                instruction.dueDate ? new Date(instruction.dueDate) : null
              );
              const agg = computeAggregatedStatus(instruction.assignees);

              return (
                <Fragment key={instruction.id}>
                  <DataRow $selected={selected.has(instruction.id)}>
                    <Td>
                      <Checkbox
                        checked={selected.has(instruction.id)}
                        onChange={() => handleSelectRow(instruction.id)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`בחר ${instruction.title}`}
                      />
                    </Td>

                    {activeColumns.map((col) => (
                      <Td key={col.id}>
                        {col.id === 'notesLinks' && (
                          <NotesLinksCell>
                            {instruction.commentCount > 0 && (
                              <Tooltip content={`${instruction.commentCount} הערות`}>
                                <NotesCount>
                                  <MessageSquare size={14} />
                                  {instruction.commentCount}
                                </NotesCount>
                              </Tooltip>
                            )}
                            {instruction.source && (
                              <Tooltip content={instruction.source}>
                                <LinkIcon size={14} />
                              </Tooltip>
                            )}
                            {!instruction.commentCount && !instruction.source && (
                              <EmptyDash>—</EmptyDash>
                            )}
                          </NotesLinksCell>
                        )}

                        {col.id === 'title' && (
                          <TitleCell>
                            {instruction.isImportant && (
                              <Tooltip content="הנחיה חשובה">
                                <ImportantFlag size={16} />
                              </Tooltip>
                            )}
                            <TitleButton
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewInstruction(instruction.id);
                              }}
                            >
                              {instruction.title}
                            </TitleButton>
                            {isNew(new Date(instruction.createdAt)) && (
                              <NewBadge>
                                <Sparkles size={12} />
                                חדש
                              </NewBadge>
                            )}
                          </TitleCell>
                        )}

                        {col.id === 'description' && (
                          <DescriptionText>{instruction.description || '—'}</DescriptionText>
                        )}

                        {col.id === 'assignees' &&
                          (instruction.assignees.length > 1 ? (
                            <AssigneesButton
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(instruction.id);
                              }}
                            >
                              <Users size={16} />
                              <span>מספר ממונים ({instruction.assignees.length})</span>
                              {expandedRows.has(instruction.id) ? (
                                <ChevronUp size={14} />
                              ) : (
                                <ChevronDown size={14} />
                              )}
                            </AssigneesButton>
                          ) : (
                            <UserAvatarGroup
                              users={instruction.assignees.map((a) => a.user)}
                              max={3}
                              size={28}
                            />
                          ))}

                        {col.id === 'dueDate' && (
                          <DueDateCell>
                            {instruction.dueDateType === 'date' ? (
                              <>
                                <DateText>
                                  {formatDate(
                                    instruction.dueDate ? new Date(instruction.dueDate) : null
                                  )}
                                </DateText>
                                {dueDisplay && instruction.status !== 'completed' && (
                                  <DueDateStatus $color={dueDisplay.color}>
                                    {dueDisplay.text}
                                  </DueDateStatus>
                                )}
                              </>
                            ) : (
                              <>
                                <DueDateBadgeRow>
                                  <DueDateBadge
                                    $variant={instruction.dueDateType as DueDateVariant}
                                  >
                                    {DUE_DATE_TYPE_LABELS[instruction.dueDateType] || 'שוטף'}
                                  </DueDateBadge>
                                  {instruction.dueDate && (
                                    <DateText>{formatDate(new Date(instruction.dueDate))}</DateText>
                                  )}
                                </DueDateBadgeRow>
                                {dueDisplay && instruction.status !== 'completed' && (
                                  <DueDateStatus $color={dueDisplay.color}>
                                    {dueDisplay.text}
                                  </DueDateStatus>
                                )}
                              </>
                            )}
                          </DueDateCell>
                        )}

                        {col.id === 'status' && (
                          <StatusCell>
                            <StatusChip status={agg.overall} />
                            {agg.progressLabel && (
                              <ProgressLabel>{agg.progressLabel}</ProgressLabel>
                            )}
                          </StatusCell>
                        )}

                        {col.id === 'createdAt' && (
                          <SecondaryText>
                            {formatDate(new Date(instruction.createdAt))}
                          </SecondaryText>
                        )}

                        {col.id === 'updatedAt' && (
                          <SecondaryText>
                            {formatDate(new Date(instruction.updatedAt))}
                          </SecondaryText>
                        )}

                        {col.id === 'source' && (
                          <SourceText>{instruction.source || '—'}</SourceText>
                        )}

                        {col.id === 'actions' && (
                          <DropdownMenu>
                            <RowMenuTrigger aria-label="פעולות">
                              <MoreVertical size={16} />
                            </RowMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onViewInstruction(instruction.id)}>
                                <Eye size={16} /> צפייה
                              </DropdownMenuItem>
                              {onEditInstruction && (
                                <DropdownMenuItem onClick={() => onEditInstruction(instruction.id)}>
                                  <Edit size={16} /> עדכון
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {instruction.status === 'archived' && onRestoreInstruction ? (
                                <RestoreMenuItem
                                  onClick={() => onRestoreInstruction(instruction.id)}
                                >
                                  <Archive size={16} /> שחזור מארכיון
                                </RestoreMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => onArchiveInstruction(instruction.id)}
                                >
                                  <Archive size={16} /> העברה לארכיון
                                </DropdownMenuItem>
                              )}
                              <DeleteMenuItem onClick={() => onDeleteInstruction(instruction.id)}>
                                <Trash2 size={16} /> ביטול
                              </DeleteMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </Td>
                    ))}
                  </DataRow>

                  {expandedRows.has(instruction.id) && instruction.assignees.length > 1 && (
                    <ExpandedRow>
                      <ExpandedTd colSpan={activeColumns.length + 1}>
                        <AssigneeSubTable
                          assignees={instruction.assignees}
                          onAssigneeStatusChange={
                            onAssigneeStatusChange
                              ? (assigneeId, status) =>
                                  onAssigneeStatusChange(instruction.id, assigneeId, status)
                              : undefined
                          }
                          onBatchStatusChange={
                            onBatchStatusChange
                              ? (status) => onBatchStatusChange(instruction.id, status)
                              : undefined
                          }
                        />
                      </ExpandedTd>
                    </ExpandedRow>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </Table>
      </TableWrapper>
    </Root>
  );
}

const Root = styled.div``;

const ColumnToggleRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
  position: relative;
`;

const ColumnToggleButton = styled.button`
  padding: 0.375rem;
  border-radius: 0.375rem;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: background-color 150ms, color 150ms;

  &:hover {
    background-color: var(--color-gray-100);
    color: var(--color-text-primary);
  }
`;

const ColumnMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.25rem);
  inset-inline-end: 0;
  z-index: var(--z-dropdown);
  background-color: var(--color-paper);
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  border: 1px solid var(--color-gray-200);
  padding: 0.25rem 0;
  min-width: 220px;
`;

const GripHandle = styled(GripVertical)`
  color: var(--color-text-disabled);
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 150ms;
`;

const GripPlaceholder = styled.span`
  width: 14px;
  flex-shrink: 0;
`;

const ColumnMenuItem = styled.div<{ $fixed: boolean; $isDragging: boolean; $isDragOver: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  text-align: start;
  transition: background-color 150ms;
  border-top: ${({ $isDragOver }) => ($isDragOver ? '2px solid var(--color-primary)' : '2px solid transparent')};
  opacity: ${({ $isDragging }) => ($isDragging ? 0.4 : 1)};
  cursor: ${({ $fixed }) => ($fixed ? 'not-allowed' : 'grab')};

  ${({ $fixed }) =>
    !$fixed &&
    `
    &:hover {
      background-color: var(--color-gray-50);
    }
    &:hover ${GripHandle} {
      opacity: 1;
    }
  `}

  ${({ $fixed }) => $fixed && `opacity: 0.5;`}
`;

const ColumnVisibilityButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  color: inherit;
`;

const EyeOffIcon = styled(EyeOff)`
  color: var(--color-text-disabled);
`;

const TableWrapper = styled.div`
  background-color: var(--color-paper);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-card);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 700px;
`;

const HeaderRow = styled.tr`
  background-color: var(--color-gray-50);
`;

const CheckboxTh = styled.th`
  width: 3rem;
  padding: 0.75rem;
`;

const ActionsTh = styled.th<{ $minWidth?: number }>`
  min-width: ${({ $minWidth }) => ($minWidth ? `${$minWidth}px` : 'unset')};
  padding: 0.75rem;
`;

const DataRow = styled.tr<{ $selected: boolean }>`
  border-top: 1px solid var(--color-gray-100);
  cursor: pointer;
  transition: background-color 150ms;
  background-color: ${({ $selected }) => ($selected ? 'color-mix(in srgb, var(--color-primary) 5%, transparent)' : 'transparent')};

  &:hover {
    background-color: ${({ $selected }) => ($selected ? 'color-mix(in srgb, var(--color-primary) 5%, transparent)' : 'var(--color-gray-50)')};
  }
`;

const Td = styled.td`
  padding: 0.625rem 0.75rem;
`;

const NotesLinksCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NotesCount = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
`;

const LinkIcon = styled(Link2)`
  color: var(--color-text-secondary);
`;

const EmptyDash = styled.span`
  color: var(--color-text-disabled);
`;

const TitleCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ImportantFlag = styled(Flag)`
  color: var(--color-warning);
  fill: var(--color-warning);
  flex-shrink: 0;
`;

const TitleButton = styled.button`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  background: none;
  border: none;
  cursor: pointer;
  text-align: start;
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
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 9999px;
  background-color: var(--color-info-light);
  color: var(--color-info);
  flex-shrink: 0;
`;

const DescriptionText = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const AssigneesButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 150ms;

  &:hover {
    color: color-mix(in srgb, var(--color-primary) 80%, transparent);
  }
`;

const DueDateCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DueDateBadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const DueDateBadge = styled.span<{ $variant: DueDateVariant }>`
  display: inline-flex;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 500;
  background-color: ${({ $variant }) =>
    $variant === 'immediate' ? 'var(--color-warning-light)' : 'var(--color-info-light)'};
  color: ${({ $variant }) =>
    $variant === 'immediate' ? 'var(--color-warning)' : 'var(--color-info)'};
`;

const DateText = styled.span`
  font-size: 0.875rem;
`;

const DueDateStatus = styled.span<{ $color: string }>`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ $color }) => $color};
`;

const StatusCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const ProgressLabel = styled.span`
  font-size: 0.65rem;
  color: var(--color-text-disabled);
`;

const SecondaryText = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

const SourceText = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  display: block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RowMenuTrigger = styled(DropdownMenuTrigger)`
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

const RestoreMenuItem = styled(DropdownMenuItem)`
  color: var(--color-success) !important;
`;

const DeleteMenuItem = styled(DropdownMenuItem)`
  color: var(--color-error) !important;
`;

const ExpandedRow = styled.tr`
  background-color: color-mix(in srgb, var(--color-gray-50) 50%, transparent);
`;

const ExpandedTd = styled.td`
  padding: 0.75rem 1.5rem;
`;
