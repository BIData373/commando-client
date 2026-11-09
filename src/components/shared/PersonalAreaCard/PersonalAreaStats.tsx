import styled from "@emotion/styled"
import { countBy } from "lodash"
import type { TaskRowWithWorkspaceDto } from "src/api/model"
import {
	STATUS_DEFAULTS,
	STATUS_DISPLAY_ORDER,
} from "src/consts/status-defaults"
import { MOBILE_MEDIA_QUERY } from "src/hooks/use-mobile"

type PersonalAreaStatsProps = {
	taskRows: TaskRowWithWorkspaceDto[]
}
export default function PersonalAreaStats({
	taskRows,
}: PersonalAreaStatsProps) {
	const countByStatus = countBy(taskRows, (row) => row.status.type)

	const stats = STATUS_DISPLAY_ORDER.filter(
		(statusType) => countByStatus[statusType],
	).map((statusType) => ({
		statusType,
		count: countByStatus[statusType],
		...STATUS_DEFAULTS[statusType],
	}))

	return (
		<>
			{stats.map(({ statusType, count, color, name }) => (
				<StatItem key={statusType}>
					<StatNumber>{count}</StatNumber>
					<StatTag $color={color}>{name}</StatTag>
				</StatItem>
			))}
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
  background: var(--chip-bg);
  background: rgb(from ${({ $color }) => $color} r g b / 0.1);
  color: ${({ $color }) => $color};
  font-size: 12px;
  font-weight: 400;
  line-height: 22px;
  white-space: nowrap;

  ${MOBILE_MEDIA_QUERY} {
  	font-size: 14px;
  }
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  ${MOBILE_MEDIA_QUERY} {
    gap: 6px;
    font-size: 20px;
    padding: 8px 0;
  }
`

const StatNumber = styled.span`
  font-size: var(--fs-xl);
  font-weight: 400;
  line-height: 32px;
  white-space: nowrap;

  ${MOBILE_MEDIA_QUERY} {
    line-height: normal;
    font-weight: 500;
  }
`
