import styled from "@emotion/styled"
import { Cell, Pie, PieChart } from "recharts"
import type { TaskRowDto } from "src/api/model"
import {
	countTasksByStatus,
	type StatusTaskCount,
} from "src/functions/status-counts"
import { useWorkspace } from "src/providers/WorkspaceProvider"

interface StatusCardProps {
	tasks: TaskRowDto[]
}

const CHART_EMPTY_COLOR = "var(--chip-bg)"

const EMPTY_STATUS = {
	id: -1,
	name: "לא משוייך",
	color: CHART_EMPTY_COLOR, //  'black'
}

export default function StatusCard({ tasks }: StatusCardProps) {
	const { statuses } = useWorkspace()

	const unassignedCount = tasks.filter((t) => t.status == null).length
	const statusList: StatusTaskCount[] = [
		...countTasksByStatus(tasks, statuses),
		...(unassignedCount > 0
			? [{ ...EMPTY_STATUS, count: unassignedCount }]
			: []),
	]

	const total = tasks.length

	const chartData =
		total === 0
			? [{ key: "empty", value: 1 }]
			: statusList.map(({ id, count }) => ({ key: id, value: count }))

	const cellFills =
		total === 0 ? [CHART_EMPTY_COLOR] : statusList.map(({ color }) => color)

	return (
		<Section>
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
					{statusList.map((status) => (
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

const Card = styled.div`
  flex: 1;
  background: var(--background);
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
  font-size: var(--fs-heading-1);
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
  font-size: var(--fs-xl);
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
  font-size: var(--fs-xl);
  font-weight: 400;
  white-space: nowrap;
  ${({ $color }) => `color: oklch(from ${$color} clamp(0, l, 0.5) c h);`}
  ${({ $color }) => `background: rgb(from ${$color} r g b / 0.1);`}
`
