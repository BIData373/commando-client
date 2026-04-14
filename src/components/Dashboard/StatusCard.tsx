import styled from '@emotion/styled'
import { Cell, Pie, PieChart } from 'recharts'

interface StatusCardProps {
  done?: number
  inProgress?: number
  pending?: number
}

const CHART_EMPTY_COLOR = 'var(--chip-bg)'
const CHART_COLORS = ['var(--status-done-bg)', 'var(--status-progress-bg)', 'var(--status-pending-bg)']

const VARIANT_STYLES = {
  done: { color: 'var(--status-done)', bg: 'var(--status-done-bg)' },
  progress: { color: 'var(--status-progress)', bg: 'var(--status-progress-bg)' },
  pending: { color: 'var(--status-pending)', bg: 'var(--status-pending-bg)' },
} as const

export default function StatusCard({ done = 0, inProgress = 0, pending = 0 }: StatusCardProps) {
  const total = done + inProgress + pending

  const chartData = total === 0
    ? [{ value: 1 }]
    : [{ value: done }, { value: inProgress }, { value: pending }]

  const cellFills = total === 0 ? [CHART_EMPTY_COLOR] : CHART_COLORS

  return (
    <Section>
      <SectionTitle>סטטוס הנחיות</SectionTitle>
      <Card>
        <ChartWrapper>
          <PieChart width={250} height={250}>
            <Pie
              data={chartData}
              cx={125}
              cy={125}
              innerRadius={84}
              outerRadius={110}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              strokeWidth={0}
              paddingAngle={2}
              cornerRadius={6}
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={cellFills[i] ?? CHART_EMPTY_COLOR} />
              ))}
            </Pie>
          </PieChart>
          <ChartCenter>
            <CenterCount>{total}</CenterCount>
            <CenterLabel>הנחיות בסביבה</CenterLabel>
          </ChartCenter>
        </ChartWrapper>

        <StatusRow>
          <StatusItem>
            <StatusCount>{pending}</StatusCount>
            <StatusBadge $variant="pending">טרם בוצע</StatusBadge>
          </StatusItem>
          <StatusItem>
            <StatusCount>{inProgress}</StatusCount>
            <StatusBadge $variant="progress">בעבודה</StatusBadge>
          </StatusItem>
          <StatusItem>
            <StatusCount>{done}</StatusCount>
            <StatusBadge $variant="done">בוצע</StatusBadge>
          </StatusItem>
        </StatusRow>
      </Card>
    </Section>
  )
}

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 450px;
  flex-shrink: 0;
  align-self: stretch;
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 30px;
  font-weight: 400;
  color: var(--sea-ink);
  text-align: start;
`

const Card = styled.div`
  flex: 1;
  background: var(--background);
  border: 0.5px solid var(--border);
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`

const ChartWrapper = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
  flex-shrink: 0;
`

const ChartCenter = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;
  pointer-events: none;
`

const CenterCount = styled.span`
  font-size: 38px;
  font-weight: 400;
  line-height: 1;
  color: var(--sea-ink-soft);
`

const CenterLabel = styled.span`
  font-size: 14px;
  color: var(--sea-ink-soft);
`

const StatusRow = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`

const StatusItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  width: 102px;
`

const StatusCount = styled.span`
  font-size: 20px;
  font-weight: 400;
  color: var(--foreground);
`

const StatusBadge = styled.span<{ $variant: keyof typeof VARIANT_STYLES }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1px 8px;
  border-radius: 71px;
  font-size: 20px;
  font-weight: 400;
  white-space: nowrap;
  color: ${({ $variant }) => VARIANT_STYLES[$variant].color};
  background: ${({ $variant }) => VARIANT_STYLES[$variant].bg};
`
