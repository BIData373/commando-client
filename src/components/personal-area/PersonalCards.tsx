import styled from '@emotion/styled';
import {
  AlertTriangle,
  Archive,
  Edit,
  Flag,
  FolderInput,
  MessageCircle,
  MoreVertical,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  type InstructionStatus,
  type IPersonalInstruction,
  STATUS_COLORS,
  STATUS_LABELS,
} from '../../types';
import { formatDate, getDueDateDisplay, isNew } from '../../utils/dateUtils';
import DropdownMenu from '../shared/DropdownMenu/DropdownMenu';
import DropdownMenuContent from '../shared/DropdownMenu/DropdownMenuContent';
import DropdownMenuItem from '../shared/DropdownMenu/DropdownMenuItem';
import DropdownMenuSeparator from '../shared/DropdownMenu/DropdownMenuSeparator';
import DropdownMenuTrigger from '../shared/DropdownMenu/DropdownMenuTrigger';
import PriorityChip from '../shared/PriorityChip';
import UserAvatarGroup from '../shared/UserAvatarGroup';

interface PersonalCardsProps {
  instructions: IPersonalInstruction[];
  onViewInstruction: (instructionId: string, envId: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
}

interface StatusGroup {
  key: InstructionStatus;
  label: string;
  color: string;
  items: IPersonalInstruction[];
}

const STATUS_ORDER: InstructionStatus[] = ['open', 'inProgress', 'completed', 'archived'];

export default function PersonalCards({
  instructions,
  onViewInstruction,
  onArchive,
  onRestore,
}: PersonalCardsProps) {
  const navigate = useNavigate();

  const groups: StatusGroup[] = STATUS_ORDER.map((status) => ({
    key: status,
    label: STATUS_LABELS[status],
    color: STATUS_COLORS[status],
    items: instructions.filter((i) => i.status === status),
  })).filter((g) => g.items.length > 0);

  return (
    <CardsGrid>
      {groups.map((group) => (
        <div key={group.key}>
          <GroupHeader>
            <StatusDot $color={group.color} />
            <GroupLabel>{group.label}</GroupLabel>
            <GroupCount>{group.items.length}</GroupCount>
          </GroupHeader>
          <CardsList>
            {group.items.map((instruction) => {
              const dueDateInfo = getDueDateDisplay(
                instruction.dueDate ? new Date(instruction.dueDate) : null,
                instruction.status
              );

              return (
                <Card
                  key={instruction.id}
                  onClick={() => onViewInstruction(instruction.id, instruction.environmentId)}
                >
                  <CardTopRow>
                    <PriorityChip priority={instruction.priority} />
                    <CardActions>
                      <EnvironmentBadge>{instruction.environmentName}</EnvironmentBadge>
                      <DropdownMenu>
                        <CardMenuTrigger aria-label="פעולות" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical size={16} />
                        </CardMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewInstruction(instruction.id, instruction.environmentId);
                            }}
                          >
                            <Edit size={16} /> צפה בהנחיה
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/env/${instruction.environmentId}`);
                            }}
                          >
                            <FolderInput size={16} /> עבור למערך
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {instruction.status === 'archived' ? (
                            <RestoreMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onRestore(instruction.id);
                              }}
                            >
                              <Archive size={16} /> שחזור מארכיון
                            </RestoreMenuItem>
                          ) : (
                            <ArchiveMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onArchive(instruction.id);
                              }}
                            >
                              <Archive size={16} /> העברה לארכיון
                            </ArchiveMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardActions>
                  </CardTopRow>

                  <TitleRow>
                    {instruction.isImportant && <FlagIcon size={16} />}
                    <CardTitle>
                      {instruction.title}
                      {isNew(new Date(instruction.createdAt)) && <SparklesIcon size={12} />}
                    </CardTitle>
                  </TitleRow>

                  <CardFooterRow>
                    <UserAvatarGroup
                      users={instruction.assignees.map((a) => a.user)}
                      max={3}
                      size={24}
                    />
                    <DueDateWrapper>
                      {instruction.dueDate ? (
                        <DueDate $color={dueDateInfo?.color || 'var(--color-text-secondary)'}>
                          {formatDate(new Date(instruction.dueDate))}
                        </DueDate>
                      ) : (
                        <RoutineLabel>שגרתית</RoutineLabel>
                      )}
                    </DueDateWrapper>
                  </CardFooterRow>

                  <IndicatorsFooter>
                    {instruction.commentCount > 0 && (
                      <CommentCount>
                        <MessageCircle size={12} /> {instruction.commentCount}
                      </CommentCount>
                    )}
                    {dueDateInfo?.overdue && (
                      <OverdueIndicator>
                        <AlertTriangle size={12} /> חריגה
                      </OverdueIndicator>
                    )}
                  </IndicatorsFooter>
                </Card>
              );
            })}
          </CardsList>
        </div>
      ))}
    </CardsGrid>
  );
}

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;

  @media (min-width: 768px)  { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (min-width: 1024px) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  @media (min-width: 1280px) { grid-template-columns: repeat(4, minmax(0, 1fr)); }
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const StatusDot = styled.div<{ $color: string }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  flex-shrink: 0;
  background-color: ${({ $color }) => $color};
`;

const GroupLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
`;

const GroupCount = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-disabled);
  background-color: var(--color-gray-100);
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
`;

const CardsList = styled.div`
  & > * + * {
    margin-top: 0.75rem;
  }
`;

const Card = styled.div`
  background-color: var(--color-paper);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-card);
  padding: 1rem;
  cursor: pointer;
  border: 1px solid var(--color-gray-100);
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: var(--shadow-hover);
    transform: translateY(-0.125rem);
  }
`;

const CardTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const EnvironmentBadge = styled.span`
  font-size: 0.65rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background-color: color-mix(in srgb, var(--color-primary) 8%, transparent);
  color: var(--color-primary);
  font-weight: 500;
  border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
`;

const CardMenuTrigger = styled(DropdownMenuTrigger)`
  padding: 0.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  background: none;
  border: none;
  color: var(--color-text-secondary);
  transition: color 150ms, background-color 150ms;

  &:hover {
    background-color: var(--color-gray-100);
    color: var(--color-text-primary);
  }
`;

const RestoreMenuItem = styled(DropdownMenuItem)`
  color: var(--color-success) !important;
`;

const ArchiveMenuItem = styled(DropdownMenuItem)`
  color: var(--color-warning) !important;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
`;

const CardTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardFooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DueDateWrapper = styled.div`
  text-align: end;
`;

const DueDate = styled.span<{ $color: string }>`
  font-size: 0.75rem;
  color: ${({ $color }) => $color};
`;

const RoutineLabel = styled.span`
  font-size: 0.75rem;
  color: var(--color-warning);
`;

const IndicatorsFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-gray-50);
`;

const CommentCount = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.65rem;
  color: var(--color-text-disabled);
`;

const OverdueIndicator = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.65rem;
  color: var(--color-error);
`;

const FlagIcon = styled(Flag)`
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--color-warning);
  fill: var(--color-warning);
`;

const SparklesIcon = styled(Sparkles)`
  display: inline;
  margin-inline-start: 0.25rem;
  color: var(--color-info);
`;
