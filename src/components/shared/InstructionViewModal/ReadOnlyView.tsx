import styled from '@emotion/styled';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  History,
  LinkIcon,
  MessageCircle,
  UserIcon,
  X,
} from 'lucide-react';
import { DUE_DATE_TYPE_LABELS, type DueDateType, type IInstruction } from '../../../types';
import { formatDateHebrew, formatDateShort, formatTime } from '../../../utils/dateUtils';
import Button from '../Button';
import PriorityChip from '../PriorityChip';
import StatusChip from '../StatusChip';
import NotesSection from './NotesSection';

interface ReadOnlyViewProps {
  instruction: IInstruction;
  onClose: () => void;
  onEdit: () => void;
  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  setHistoryOpen: (v: boolean) => void;
}

export default function ReadOnlyView({
  instruction,
  onClose,
  onEdit,
  chatOpen,
  setChatOpen,
  setHistoryOpen,
}: ReadOnlyViewProps) {
  return (
    <>
      <Header>
        <HeaderInfo>
          <Title>{instruction.title}</Title>
          <MetaRow>
            <StatusChip status={instruction.status} size="medium" />
            <PriorityChip priority={instruction.priority} size="small" />
            <DateLabel>
              {formatDateHebrew(new Date(instruction.createdAt))}{' '}
              {formatTime(new Date(instruction.createdAt))}
            </DateLabel>
            <HistoryButton onClick={() => setHistoryOpen(true)} title="היסטוריית שינויים">
              <History size={16} />
            </HistoryButton>
          </MetaRow>
        </HeaderInfo>
        <HeaderActions>
          <Button variant="outline" size="sm" onClick={onEdit}>
            עריכה
          </Button>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </HeaderActions>
      </Header>

      <Body>
        {instruction.description && <Description>{instruction.description}</Description>}

        <DetailsGrid>
          <div>
            <SectionLabel>אחראים</SectionLabel>
            {instruction.assignees.length > 0 ? (
              <AssigneeList>
                {instruction.assignees.map((a) => (
                  <AssigneeCard key={a.id}>
                    <AssigneeAvatar>
                      <UserIcon size={13} />
                    </AssigneeAvatar>
                    <AssigneeInfo>
                      <AssigneeName>{a.user.name}</AssigneeName>
                      <StatusChip status={a.status} size="small" />
                    </AssigneeInfo>
                  </AssigneeCard>
                ))}
              </AssigneeList>
            ) : (
              <EmptyText>לא שובצו אחראים</EmptyText>
            )}
          </div>

          <div>
            <SectionLabel>תג״ב</SectionLabel>
            <DueDateRow>
              <DueDateTypeBadge $type={instruction.dueDateType as DueDateType}>
                {DUE_DATE_TYPE_LABELS[instruction.dueDateType]}
              </DueDateTypeBadge>
              {instruction.dueDateType === 'date' &&
              instruction.dueDateFrom &&
              instruction.dueDate ? (
                <DateRange>
                  <Calendar size={14} />
                  {formatDateShort(new Date(instruction.dueDateFrom))} -{' '}
                  {formatDateShort(new Date(instruction.dueDate))}
                </DateRange>
              ) : instruction.dueDate ? (
                <DateRange>
                  <Calendar size={14} />
                  עד {formatDateShort(new Date(instruction.dueDate))}
                </DateRange>
              ) : null}
            </DueDateRow>
          </div>

          <div>
            <SectionLabel>מקור</SectionLabel>
            {instruction.source ? (
              <SourceLink>
                <LinkIcon size={14} />
                {instruction.source}
              </SourceLink>
            ) : (
              <EmptyText>—</EmptyText>
            )}
          </div>
        </DetailsGrid>

        <NotesWrapper>
          <SectionLabel>הערות וקישורים</SectionLabel>
          <NotesSection description={instruction.description} />
        </NotesWrapper>
      </Body>

      <ChatToggle onClick={() => setChatOpen(!chatOpen)}>
        <ChatToggleLeft>
          <MessageCircle size={16} />
          <ChatToggleLabel>שיחה ועדכונים</ChatToggleLabel>
          {instruction.commentCount > 0 && <CommentBadge>{instruction.commentCount}</CommentBadge>}
        </ChatToggleLeft>
        {chatOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </ChatToggle>
    </>
  );
}

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.75rem 2rem 1rem;
  border-bottom: 1px solid var(--color-gray-100);
`;

const HeaderInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.3;
  margin: 0 0 0.5rem;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const DateLabel = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-disabled);
`;

const HistoryButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-disabled);
  transition: color 150ms;

  &:hover {
    color: var(--color-primary);
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  padding: 0.375rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-disabled);
  transition: color 150ms;

  &:hover {
    color: var(--color-text-primary);
  }
`;

const Body = styled.div`
  padding: 1.25rem 2rem;
  flex: 1;
  overflow-y: auto;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 1.25rem;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem 3rem;
`;

const SectionLabel = styled.label`
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--color-text-disabled);
  display: block;
  margin-bottom: 0.5rem;
  letter-spacing: 0.025em;
  text-transform: uppercase;
`;

const AssigneeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const AssigneeCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background-color: var(--color-gray-50);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-gray-100);
`;

const AssigneeAvatar = styled.div`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const AssigneeInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AssigneeName = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
`;

const EmptyText = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-disabled);
`;

const DueDateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DueDateTypeBadge = styled.span<{ $type: DueDateType }>`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  border: 1px solid;
  background-color: ${({ $type }) =>
    $type === 'routine'
      ? 'var(--color-info-light)'
      : $type === 'immediate'
        ? 'var(--color-warning-light)'
        : 'var(--color-gray-50)'};
  color: ${({ $type }) =>
    $type === 'routine'
      ? 'var(--color-info)'
      : $type === 'immediate'
        ? 'var(--color-warning)'
        : 'var(--color-text-secondary)'};
  border-color: ${({ $type }) =>
    $type === 'routine'
      ? 'var(--color-info-light)'
      : $type === 'immediate'
        ? 'var(--color-warning-light)'
        : 'var(--color-gray-200)'};
`;

const DateRange = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const SourceLink = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-primary);
  font-weight: 500;
`;

const NotesWrapper = styled.div`
  margin-top: 1.25rem;
`;

const ChatToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 2rem;
  background-color: var(--color-gray-50);
  border-top: 1px solid var(--color-gray-200);
  border: none;
  border-top: 1px solid var(--color-gray-200);
  width: 100%;
  cursor: pointer;
  transition: background-color 150ms;
  color: var(--color-text-secondary);

  &:hover {
    background-color: var(--color-gray-100);
  }
`;

const ChatToggleLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChatToggleLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
`;

const CommentBadge = styled.span`
  background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
  color: var(--color-primary);
  font-size: 0.625rem;
  font-weight: 700;
  border-radius: 9999px;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;
