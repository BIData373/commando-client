import styled from "@emotion/styled"
import { useMemo } from "react"
import { type TaskRowDto, WorkspaceStatusType } from "src/api/model"

export const STATUS_COLOR_CONFIG: {
	type: WorkspaceStatusType
	color: string
}[] = [
	{
		type: WorkspaceStatusType.NOT_STARTED,
		color: "var(--Colors-Base-Volcano-4)",
	},
	{
		type: WorkspaceStatusType.IN_PROGRESS,
		color: "var(--Colors-Base-Geekblue-4)",
	},
	{ type: WorkspaceStatusType.COMPLETED, color: "var(--Colors-Base-Green-4)" },
]

const STATUS_LABELS: Record<WorkspaceStatusType, string> = {
	[WorkspaceStatusType.NOT_STARTED]: "טרם בוצע",
	[WorkspaceStatusType.IN_PROGRESS]: "בעבודה",
	[WorkspaceStatusType.COMPLETED]: "בוצע",
}

export interface StatusSegment {
	id: string | number
	name: string
	color: string
	count: number
}

interface MobileStatusBarProps {
	tasks: TaskRowDto[]
	segments?: StatusSegment[]
}

export default function MobileStatusBar({
	tasks,
	segments: externalSegments,
}: MobileStatusBarProps) {
	const segments = useMemo(
		() =>
			externalSegments ??
			STATUS_COLOR_CONFIG.map(({ type, color }) => ({
				id: type,
				name: STATUS_LABELS[type],
				color,
				count: tasks.filter((t) => t.status?.type === type).length,
			})),
		[tasks, externalSegments],
	)
	const total = tasks.length

	return (
		<Root>
			<TitleRow>
				<Label dir="auto">הנחיות בסביבה</Label>
				<Count>{total}</Count>
			</TitleRow>

			<BarTrack>
				{segments.map((seg) => (
					<BarSegment
						key={seg.id}
						$color={seg.color}
						$pct={total > 0 ? (seg.count / total) * 100 : 0}
					/>
				))}
			</BarTrack>

			<LegendRow>
				{segments.map((seg) => (
					<LegendItem key={seg.id}>
						<LegendLabel dir="auto">{seg.name}</LegendLabel>
						<LegendCount>{seg.count}</LegendCount>
						<LegendDot $color={seg.color} />
					</LegendItem>
				))}
			</LegendRow>
		</Root>
	)
}

const Root = styled.div`
	direction: ltr;
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 8px 16px;
	margin: -12px -16px 0;
	background: var(--background);
	border-bottom: 1px solid var(--card-border);
`

const TitleRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 8px;
`

const Label = styled.span`
	font-size: var(--fs-base);
	font-weight: 400;
	line-height: 24px;
	color: var(--Colors-Base-Neutral-8);
`

const Count = styled.span`
	font-size: var(--fs-xl);
	font-weight: 500;
	line-height: 28px;
	color: var(--Colors-Base-Neutral-8);
`

const BarTrack = styled.div`
	display: flex;
	height: 16px;
	border-radius: 8px;
	align-items: flex-start;
	align-self: stretch;
	overflow: hidden;
	background: var(--status-bar-empty);
`

const BarSegment = styled.div<{ $color: string; $pct: number }>`
	height: 100%;
	width: ${({ $pct }) => $pct}%;
	background: ${({ $color }) => $color};
`

const LegendRow = styled.div`
	display: flex;
	justify-content: space-between;
`

const LegendItem = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
`

const LegendLabel = styled.span`
	font-size: var(--fs-btn);
	font-weight: 400;
	color: var(--Colors-Base-Neutral-8);
`

const LegendCount = styled.span`
	font-size: var(--fs-btn);
	font-weight: 500;
	color: var(--sea-ink);
`

const LegendDot = styled.div<{ $color: string }>`
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: ${({ $color }) => $color};
`
