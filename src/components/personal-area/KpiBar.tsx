import styled from '@emotion/styled';
import { type IInstructionStats, STATUS_COLORS } from '../../types';

const TOTAL_COLOR = 'var(--color-primary)';
const OVERDUE_COLOR = 'var(--color-error)';
const ARCHIVED_COLOR = 'var(--color-text-disabled)';

interface KpiBarProps {
  stats: IInstructionStats;
}

interface KpiItem {
  label: string;
  value: number;
  color: string;
}

interface DotProps {
  $color: string;
}

interface ProgressSegmentProps {
  $width: number;
  $color: string;
}

export default function KpiBar({ stats }: KpiBarProps) {
  const items: KpiItem[] = [
    { label: 'סה"כ', value: stats.total, color: TOTAL_COLOR },
    { label: 'ממתינות', value: stats.open, color: STATUS_COLORS.open },
    { label: 'בביצוע', value: stats.inProgress, color: STATUS_COLORS.inProgress },
    { label: 'בוצעו', value: stats.completed, color: STATUS_COLORS.completed },
    { label: 'חריגות', value: stats.overdue, color: OVERDUE_COLOR },
    { label: 'ארכיון', value: stats.archived, color: ARCHIVED_COLOR },
  ];

  return (
    <Bar>
      <Row>
        {items.map((item) => (
          <StatItem key={item.label}>
            <Dot $color={item.color} />
            <StatLabel>{item.label}</StatLabel>
            <StatValue>{item.value}</StatValue>
          </StatItem>
        ))}

        {stats.total > 0 && (
          <ProgressSection>
            <ProgressTrack>
              {stats.completed > 0 && (
                <ProgressSegment
                  $width={(stats.completed / stats.total) * 100}
                  $color={STATUS_COLORS.completed}
                />
              )}
              {stats.inProgress > 0 && (
                <ProgressSegment
                  $width={(stats.inProgress / stats.total) * 100}
                  $color={STATUS_COLORS.inProgress}
                />
              )}
              {stats.open > 0 && (
                <ProgressSegment
                  $width={(stats.open / stats.total) * 100}
                  $color={STATUS_COLORS.open}
                />
              )}
            </ProgressTrack>
            <ProgressLabel>{Math.round((stats.completed / stats.total) * 100)}% בוצע</ProgressLabel>
          </ProgressSection>
        )}
      </Row>
    </Bar>
  );
}

const Bar = styled.div`
  background-color: var(--color-paper);
  border-bottom: 1px solid var(--color-gray-100);
  padding: 0.75rem 1.5rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Dot = styled.div<DotProps>`
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 9999px;
  background-color: ${({ $color }) => $color};
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
`;

const StatValue = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
`;

const ProgressSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-inline-start: 1rem;
`;

const ProgressTrack = styled.div`
  flex: 1;
  height: 0.5rem;
  background-color: var(--color-gray-100);
  border-radius: 9999px;
  overflow: hidden;
  display: flex;
`;

const ProgressSegment = styled.div<ProgressSegmentProps>`
  height: 100%;
  width: ${({ $width }) => $width}%;
  background-color: ${({ $color }) => $color};
`;

const ProgressLabel = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
`;
