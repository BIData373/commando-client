import styled from "@emotion/styled"
import { groupBy, mapValues } from "lodash"
import { useMemo } from "react"
import { Cell, Pie, PieChart } from "recharts"
import type { TaskRow } from "src/providers/TasksFiltersProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"

interface StatusCardProps {
  tasks: TaskRow[]
}

const CHART_EMPTY_COLOR = "var(--chip-bg)"

export default function StatusCard({ tasks }: StatusCardProps) {
  const { statuses } = useWorkspace()
  const statusCounts = useMemo(
    () =>
      mapValues(groupBy(tasks, "status.id"), (tasks, id) => ({
        count: tasks.length,
        ...statuses[Number(id)],
      })),
    [tasks, statuses]
  )

  const total = tasks.length

  const chartData =
    total === 0
      ? [{ key: "all", value: 1 }]
      : Object.values(statusCounts).map(({ id, count }) => ({
        key: id,
        value: count,
      }))

  const cellFills =
    total === 0
      ? [CHART_EMPTY_COLOR]
      : Object.values(statuses).map(({ color }) => color)

  return (
    <Section>
      <SectionTitle>סטטוס הנחיות</SectionTitle>
      <Card>
        <ChartWrapper>
          <StyledPieChart width={250} height={300}>
            <Pie
              style={{ outline: "none" }}
              data={chartData}
              innerRadius={88}
              outerRadius={130}
              dataKey="value"
              startAngle={0}
              endAngle={360}
            >
              {chartData.map(({ key }, i) => (
                <Cell key={key} fill={cellFills[i] ?? CHART_EMPTY_COLOR} />
              ))}
            </Pie>
          </StyledPieChart>
          <ChartCenter>
            <CenterCount>{total}</CenterCount>
            <CenterLabel>הנחיות בסביבה</CenterLabel>
          </ChartCenter>
        </ChartWrapper>
        <StatusRow>
          {Object.values(statusCounts).map((status) => (
            <StatusItem key={status.id}>
              <StatusCount>{status.count}</StatusCount>
              <StatusBadge $color={status.color}>{status.name}</StatusBadge>
            </StatusItem>
          ))}
        </StatusRow>
      </Card>
    </Section>
  )
}

const StyledPieChart = styled(PieChart)`
  width: 300px !important;
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 450px;
  flex-shrink: 0;
  align-self: stretch;

  @media (max-width: 1300px) {
    grid-column: 1;
    grid-row: 2;
  }
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`

const ChartWrapper = styled.div`
  position: relative;
  width: 300px !important;
  height: 300px !important;
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
  color: var(--foreground);
`

const CenterLabel = styled.span`
  white-space: nowrap;
  font-size: 17px;
  color: var(--foreground);
`

const StatusRow = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
`

const StatusItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px;
  width: 80px;
`

const StatusCount = styled.span`
  font-size: 20px;
  font-weight: 400;
  color: var(--foreground);
`

const StatusBadge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1px 8px;
  width: 100px;
  border-radius: 35px;
  font-size: 20px;
  font-weight: 400;
  white-space: nowrap;
  ${({ $color }) => `color: ${$color};`}
  ${({ $color }) => `background:  rgb(from ${$color} r g b / 0.1);`}
`
