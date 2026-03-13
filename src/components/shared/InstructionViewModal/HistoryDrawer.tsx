import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { History, X } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useActivity } from '../../../hooks/useActivity';
import { formatActivityDate, getActivityDesc } from '../../../utils/activityUtils';
import { formatTime } from '../../../utils/dateUtils';
import Spinner from '../Spinner';

interface HistoryDrawerProps {
  instructionId: string;
  onClose: () => void;
}

export default function HistoryDrawer({ instructionId, onClose }: HistoryDrawerProps) {
  const { data: events, isLoading } = useActivity(instructionId);

  const sortedEvents = events
    ? [...events].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  function handleClickPanel(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  return (
    <Backdrop onClick={onClose}>
      <Panel onClick={handleClickPanel}>
        <PanelHeader>
          <TitleRow>
            <History size={18} />
            <PanelTitle>היסטוריית שינויים</PanelTitle>
          </TitleRow>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </PanelHeader>

        <PanelBody>
          {isLoading && (
            <SpinnerWrapper>
              <Spinner $size={24} />
            </SpinnerWrapper>
          )}
          {sortedEvents.length === 0 && !isLoading && <EmptyText>אין רשומות היסטוריה</EmptyText>}
          {sortedEvents.length > 0 && (
            <Timeline>
              {sortedEvents.map((event) => (
                <TimelineItem key={event.id}>
                  <TimelineDot />
                  <EventMeta>
                    {formatActivityDate(new Date(event.createdAt))} •{' '}
                    {formatTime(new Date(event.createdAt))}
                  </EventMeta>
                  <EventUser>{event.user.name}</EventUser>
                  <EventDesc>{getActivityDesc(event)}</EventDesc>
                </TimelineItem>
              ))}
            </Timeline>
          )}
        </PanelBody>
      </Panel>
    </Backdrop>
  );
}

const slideInLeft = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  background-color: rgb(15 23 42 / 0.1);
  backdrop-filter: blur(2px);
`;

const Panel = styled.div`
  background-color: var(--color-paper);
  width: 100%;
  max-width: 28rem;
  height: 100%;
  box-shadow: 4px 0 30px rgb(0 0 0 / 0.12);
  overflow-y: auto;
  border-inline-end: 1px solid var(--color-gray-100);
  animation: ${slideInLeft} 0.4s cubic-bezier(0.05, 0.7, 0.1, 1);
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-100);
  position: sticky;
  top: 0;
  background-color: var(--color-paper);
  z-index: 10;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
`;

const PanelTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-disabled);
  transition: color 150ms;

  &:hover {
    color: var(--color-text-primary);
  }
`;

const PanelBody = styled.div`
  padding: 1.25rem 1.5rem;
`;

const SpinnerWrapper = styled.div`
  padding: 2rem 0;
  text-align: center;
`;

const EmptyText = styled.div`
  padding: 2rem 0;
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-disabled);
`;

const Timeline = styled.div`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset-inline-start: 7px;
    top: 0.75rem;
    bottom: 0.75rem;
    width: 2px;
    background-color: var(--color-gray-100);
  }
`;

const TimelineItem = styled.div`
  position: relative;
  padding-inline-start: 2rem;
  padding-bottom: 1.5rem;

  &:last-child {
    padding-bottom: 0;
  }
`;

const TimelineDot = styled.div`
  position: absolute;
  inset-inline-start: 0;
  top: 0.375rem;
  width: 15px;
  height: 15px;
  border-radius: 9999px;
  background-color: var(--color-paper);
  border: 2.5px solid var(--color-primary);
  z-index: 1;
`;

const EventMeta = styled.div`
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--color-text-disabled);
  margin-bottom: 0.125rem;
`;

const EventUser = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.125rem;
`;

const EventDesc = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
`;
