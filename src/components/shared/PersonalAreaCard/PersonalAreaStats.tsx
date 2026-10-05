import styled from "@emotion/styled"
import {
	type TaskRowWithWorkspaceDto,
	WorkspaceStatusType,
} from "src/api/model"
import { STATUS_DEFAULTS } from "src/functions/status-defaults"

type PersonalAreaStatsProps = {
	taskRows: TaskRowWithWorkspaceDto[]
}
export default function PersonalAreaStats({
	taskRows,
}: PersonalAreaStatsProps) {
	const completedCount = taskRows.filter(
		(t) => t.status?.type === WorkspaceStatusType.COMPLETED,
	).length

	const inProgressCount = taskRows.filter(
		(t) => t.status?.type === WorkspaceStatusType.IN_PROGRESS,
	).length

	const notStartedCount = taskRows.filter(
		(t) => t.status?.type === WorkspaceStatusType.NOT_STARTED,
	).length

	return (
		<>
			<StatItem>
				<StatNumber>{completedCount}</StatNumber>
				<StatTag $color={STATUS_DEFAULTS[WorkspaceStatusType.COMPLETED].color}>
					{STATUS_DEFAULTS[WorkspaceStatusType.COMPLETED].name}
				</StatTag>
			</StatItem>
			<StatItem>
				<StatNumber>{inProgressCount}</StatNumber>
				<StatTag
					$color={STATUS_DEFAULTS[WorkspaceStatusType.IN_PROGRESS].color}
				>
					{STATUS_DEFAULTS[WorkspaceStatusType.IN_PROGRESS].name}
				</StatTag>
			</StatItem>
			<StatItem>
				<StatNumber>{notStartedCount}</StatNumber>
				<StatTag
					$color={STATUS_DEFAULTS[WorkspaceStatusType.NOT_STARTED].color}
				>
					{STATUS_DEFAULTS[WorkspaceStatusType.NOT_STARTED].name}
				</StatTag>
			</StatItem>
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
  background: rgb(from ${({ $color }) => $color} r g b / 0.1);
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
  font-weight: 400;
  line-height: 32px;
  color: var(--text-color-2);
  white-space: nowrap;
`
