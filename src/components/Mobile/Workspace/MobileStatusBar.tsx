import styled from "@emotion/styled"
import { STATUS_DEFAULTS } from "src/consts/status-defaults"
import type { StatusTaskCount } from "src/functions/status-counts"

const BAR_COLORS: Record<string, string> = {
	[STATUS_DEFAULTS.NOT_STARTED.name]: "var(--Colors-Base-Volcano-4)",
	[STATUS_DEFAULTS.IN_PROGRESS.name]: "var(--Colors-Base-Geekblue-4)",
	[STATUS_DEFAULTS.COMPLETED.name]: "var(--Colors-Base-Green-4)",
}

function getBarColor(seg: StatusTaskCount): string {
	return BAR_COLORS[seg.name] ?? seg.color
}

interface MobileStatusBarProps {
	segments: StatusTaskCount[]
	totalTaskCount: number
}

export default function MobileStatusBar({
	segments,
	totalTaskCount,
}: MobileStatusBarProps) {
	return (
		<Root>
			<TitleRow>
				<Label dir="auto">הנחיות בסביבה</Label>
				<Count>{totalTaskCount}</Count>
			</TitleRow>

			<BarTrack>
				{segments
					.filter((seg) => seg.count > 0)
					.map((seg) => (
						<BarSegment
							key={seg.id}
							$color={getBarColor(seg)}
							$pct={(seg.count / totalTaskCount) * 100}
						/>
					))}
			</BarTrack>

			<LegendRow>
				{segments.map((seg) => (
					<LegendItem key={seg.id}>
						<LegendLabel dir="auto">{seg.name}</LegendLabel>
						<LegendCount>{seg.count}</LegendCount>
						<LegendDot $color={getBarColor(seg)} />
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
	gap: 3px;
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
