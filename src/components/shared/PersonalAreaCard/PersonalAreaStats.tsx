import styled from "@emotion/styled"
import { countBy } from "lodash"
import type {
	TaskRowWithWorkspaceDto,
	WorkspaceStatusType,
} from "src/api/model"
import { STATUS_DEFAULTS } from "src/consts/status-defaults"

type PersonalAreaStatsProps = {
	taskRows: TaskRowWithWorkspaceDto[]
}
export default function PersonalAreaStats({
	taskRows,
}: PersonalAreaStatsProps) {
	const groupedTaskRows = countBy(taskRows, (row) => row.status.type)

	return (
		<>
			{Object.entries(groupedTaskRows).map(([statusType, taskRowCount]) => {
				const status = STATUS_DEFAULTS[statusType as WorkspaceStatusType]

				return (
					<StatItem key={statusType}>
						<StatNumber>{taskRowCount}</StatNumber>
						<StatTag $color={status.color}>{status.name}</StatTag>
					</StatItem>
				)
			})}
		</>
	)
}

const StatTag = styled.span<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 76px;
  padding: 1px 8px;
  border-radius: 35px;
  background: rgb(from ${({ $color }) => $color} r g b / 0.05);
  color: ${({ $color }) => $color};
  font-size: 12px;
  font-weight: 400;
  line-height: 22px;
  white-space: nowrap;
`
const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`

const StatNumber = styled.span`
  font-size: var(--fs-xl);
	font-weight: 500;
  white-space: nowrap;
`
