import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import {
  AlertTriangle,
  Archive,
  ArrowLeftRight,
  ArrowRight,
  Calendar,
  MessageCircle,
  Paperclip,
  Pencil,
  PlusCircle,
  RotateCcw,
  Tag,
  UserMinus,
  UserPlus,
} from 'lucide-react';
import { type MouseEvent, type ReactNode, useState } from 'react';
import { useActivity } from '../../hooks/useActivity';
import type { ActivityAction, IActivityEvent } from '../../types';
import { formatDateTime } from '../../utils/dateUtils';
import Spinner from '../shared/Spinner';

interface ActivityTimelineProps {
  open: boolean;
  onClose: () => void;
  instructionId: string;
}

const ACTION_CONFIG: Record<
  ActivityAction,
  { icon: ReactNode; label: string; color: string; group: string }
> = {
  created: {
    icon: <PlusCircle size={14} />,
    label: 'יצר את ההנחיה',
    color: '#3f51b5',
    group: 'כללי',
  },
  statusChanged: {
    icon: <ArrowLeftRight size={14} />,
    label: 'שינה מצב',
    color: '#f59e0b',
    group: 'מצב',
  },
  assigned: { icon: <UserPlus size={14} />, label: 'שיבץ', color: '#10b981', group: 'שיבוץ' },
  unassigned: {
    icon: <UserMinus size={14} />,
    label: 'הסיר שיבוץ',
    color: '#ef4444',
    group: 'שיבוץ',
  },
  commented: {
    icon: <MessageCircle size={14} />,
    label: 'דיווח',
    color: '#3b82f6',
    group: 'דיווחים',
  },
  edited: { icon: <Pencil size={14} />, label: 'עדכן', color: '#8b5cf6', group: 'עדכון' },
  tagAdded: { icon: <Tag size={14} />, label: 'הוסיף סימון', color: '#06b6d4', group: 'סימונים' },
  tagRemoved: { icon: <Tag size={14} />, label: 'הסיר סימון', color: '#6b7280', group: 'סימונים' },
  dueDateChanged: {
    icon: <Calendar size={14} />,
    label: 'שינה תג״ב',
    color: '#f59e0b',
    group: 'עדכון',
  },
  priorityChanged: {
    icon: <AlertTriangle size={14} />,
    label: 'שינה דחיפות',
    color: '#ef4444',
    group: 'עדכון',
  },
  attachmentAdded: {
    icon: <Paperclip size={14} />,
    label: 'הוסיף קובץ',
    color: '#10b981',
    group: 'קבצים',
  },
  attachmentRemoved: {
    icon: <Paperclip size={14} />,
    label: 'הסיר קובץ',
    color: '#6b7280',
    group: 'קבצים',
  },
  archived: {
    icon: <Archive size={14} />,
    label: 'העביר לארכיון',
    color: '#6b7280',
    group: 'כללי',
  },
  restored: {
    icon: <RotateCcw size={14} />,
    label: 'שחזר מארכיון',
    color: '#3b82f6',
    group: 'כללי',
  },
};

const FILTER_GROUPS = [...new Set(Object.values(ACTION_CONFIG).map((c) => c.group))];

function getActivityDescription(event: IActivityEvent): string {
  const config = ACTION_CONFIG[event.action];
  let desc = config.label;

  if (event.action === 'statusChanged' && event.metadata.oldValue && event.metadata.newValue) {
    desc += ` מ-"${event.metadata.oldValue}" ל-"${event.metadata.newValue}"`;
  }
  if (event.action === 'assigned' && event.metadata.targetUser) {
    desc += ` את ${event.metadata.targetUser.name}`;
  }
  if (event.action === 'unassigned' && event.metadata.targetUser) {
    desc += ` את ${event.metadata.targetUser.name}`;
  }
  if ((event.action === 'tagAdded' || event.action === 'tagRemoved') && event.metadata.tagName) {
    desc += `: ${event.metadata.tagName}`;
  }
  if (event.action === 'priorityChanged' && event.metadata.oldValue && event.metadata.newValue) {
    desc += ` מ-"${event.metadata.oldValue}" ל-"${event.metadata.newValue}"`;
  }
  if (event.action === 'dueDateChanged' && event.metadata.oldValue && event.metadata.newValue) {
    desc += ` מ-${event.metadata.oldValue} ל-${event.metadata.newValue}`;
  }
  if (event.action === 'commented' && event.metadata.commentPreview) {
    desc += ` — "${event.metadata.commentPreview}"`;
  }

  return desc;
}

export default function ActivityTimeline({ open, onClose, instructionId }: ActivityTimelineProps) {
  const { data: events, isLoading } = useActivity(instructionId);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  if (!open) return null;

  const filteredEvents = !events
    ? []
    : !activeFilter
      ? events
      : events.filter((e) => ACTION_CONFIG[e.action].group === activeFilter);

  function handleClickDrawer(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  function handleClickFilterChip() {
    setActiveFilter(null);
  }

  return (
    <Overlay onClick={onClose}>
      <Drawer onClick={handleClickDrawer}>
        <DrawerHeader>
          <DrawerTitle>יומן פעילות</DrawerTitle>

          <CloseButton onClick={onClose} aria-label="סגור">
            <RotatedArrow size={24} />
          </CloseButton>
        </DrawerHeader>

        <FilterRow>
          <FilterChip $active={!activeFilter} onClick={handleClickFilterChip}>
            הכל
          </FilterChip>

          {FILTER_GROUPS.map((group) => (
            <FilterChip
              key={group}
              $active={activeFilter === group}
              onClick={() => setActiveFilter(group)}
            >
              {group}
            </FilterChip>
          ))}
        </FilterRow>

        {isLoading && (
          <CenteredRow>
            <Spinner $size={24} />
          </CenteredRow>
        )}

        {filteredEvents.length === 0 && !isLoading && (
          <CenteredRow>
            <EmptyText>{activeFilter ? 'אין אירועים מסוג זה' : 'אין רשומות ביומן'}</EmptyText>
          </CenteredRow>
        )}

        {filteredEvents.length > 0 && (
          <Timeline>
            {filteredEvents.map((event) => (
              <TimelineItem key={event.id}>
                <TimelineDot />

                <EventTime>{formatDateTime(new Date(event.createdAt))}</EventTime>

                <EventText>
                  <EventAuthor>{event.user.name}</EventAuthor> {getActivityDescription(event)}
                </EventText>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </Drawer>
    </Overlay>
  );
}

const slideInRight = keyframes`
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  background-color: rgba(15, 23, 42, 0.1);
  backdrop-filter: blur(2px);
`;

const Drawer = styled.div`
  animation: ${slideInRight} 0.4s cubic-bezier(0.05, 0.7, 0.1, 1);
  background-color: var(--color-paper);
  width: 100%;
  max-width: 24rem;
  height: 100%;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  padding: 2rem;
  overflow-y: auto;
  border-inline-start: 1px solid var(--color-gray-100);
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const DrawerTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
`;

const CloseButton = styled.button`
  color: var(--color-text-disabled);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 150ms;
  display: flex;
  align-items: center;

  &:hover {
    color: var(--color-text-primary);
  }
`;

const RotatedArrow = styled(ArrowRight)`
  transform: rotate(180deg);
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 1.5rem;
`;

const FilterChip = styled.button<{ $active: boolean }>`
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 10px;
  font-weight: 700;
  border: 1px solid;
  cursor: pointer;
  transition: background-color 150ms, color 150ms;

  background-color: ${({ $active }) => ($active ? 'color-mix(in srgb, var(--color-primary) 8%, transparent)' : 'var(--color-gray-50)')};
  color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-text-disabled)')};
  border-color: ${({ $active }) => ($active ? 'color-mix(in srgb, var(--color-primary) 20%, transparent)' : 'var(--color-gray-100)')};

  &:hover {
    background-color: ${({ $active }) => ($active ? 'color-mix(in srgb, var(--color-primary) 8%, transparent)' : 'var(--color-gray-100)')};
  }
`;

const CenteredRow = styled.div`
  padding: 2rem 0;
  text-align: center;
`;

const EmptyText = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-disabled);
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset-inline-end: 0.5rem;
    top: 0.5rem;
    bottom: 0.5rem;
    width: 1px;
    background-color: var(--color-gray-100);
  }
`;

const TimelineItem = styled.div`
  position: relative;
  padding-inline-end: 2rem;
`;

const TimelineDot = styled.div`
  position: absolute;
  inset-inline-end: 0.125rem;
  top: 0.375rem;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  background-color: var(--color-paper);
  border: 2px solid var(--color-gray-200);
  z-index: 1;
`;

const EventTime = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: var(--color-text-disabled);
  margin-bottom: 0.25rem;
`;

const EventText = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
`;

const EventAuthor = styled.span`
  font-weight: 700;
  color: var(--color-text-primary);
`;
