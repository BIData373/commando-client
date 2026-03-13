import styled from '@emotion/styled';

const SIZE = 140;
const STROKE_WIDTH = 16;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ImportantPieChartProps {
  completed: number;
  total: number;
}

export default function ImportantPieChart({ completed, total }: ImportantPieChartProps) {
  const ratio = total > 0 ? completed / total : 0;
  const percent = Math.round(ratio * 100);
  const offset = CIRCUMFERENCE * (1 - ratio);
  const isComplete = completed === total && total > 0;
  const remaining = total - completed;
  const arcColor = isComplete ? 'var(--color-success)' : 'var(--color-warning)';

  return total === 0 ? (
    <Wrapper $empty>
      <ChartBox>
        <svg width={SIZE} height={SIZE}>
          <title>ImportantPieChart</title>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-gray-100)"
            strokeWidth={STROKE_WIDTH}
          />
        </svg>
        <CenterOverlay>
          <EmptyDash>—</EmptyDash>
          <CenterSubtext>אין נתונים</CenterSubtext>
        </CenterOverlay>
      </ChartBox>
    </Wrapper>
  ) : (
    <Wrapper $empty={false}>
      <ChartBox>
        <RotatedSvg width={SIZE} height={SIZE}>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-warning-light)"
            strokeWidth={STROKE_WIDTH}
          />
          <ArcCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={arcColor}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </RotatedSvg>
        <CenterOverlay>
          <PercentText $color={arcColor}>{percent}%</PercentText>
          <CenterSubtext>
            {completed} מתוך {total}
          </CenterSubtext>
        </CenterOverlay>
      </ChartBox>

      <Legend>
        <LegendItem>
          <LegendDot $color={arcColor} />
          <LegendText>בוצעו ({completed})</LegendText>
        </LegendItem>
        <LegendItem>
          <LegendDot $color="var(--color-warning-light)" />
          <LegendText>נותרו ({remaining})</LegendText>
        </LegendItem>
      </Legend>
    </Wrapper>
  );
}

const Wrapper = styled.div<{ $empty: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${({ $empty }) => ($empty ? '1rem' : '0')};
  padding-bottom: ${({ $empty }) => ($empty ? '1rem' : '0')};
`;

const ChartBox = styled.div`
  position: relative;
  width: ${SIZE}px;
  height: ${SIZE}px;
`;

const RotatedSvg = styled.svg`
  transform: rotate(-90deg);
`;

const ArcCircle = styled.circle`
  transition: stroke-dashoffset 700ms ease-out;
`;

const CenterOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PercentText = styled.span<{ $color: string }>`
  font-size: 1.875rem;
  font-weight: 800;
  color: ${({ $color }) => $color};
`;

const EmptyDash = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-gray-200);
`;

const CenterSubtext = styled.span`
  font-size: 11px;
  color: var(--color-text-secondary);
  font-weight: 500;
  margin-top: 0.125rem;
`;

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-top: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const LegendDot = styled.span<{ $color: string }>`
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 9999px;
  background-color: ${({ $color }) => $color};
`;

const LegendText = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
`;
