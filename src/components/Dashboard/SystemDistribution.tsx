import styled from "@emotion/styled"
import { chain, compact, countBy, flatMap, get } from "lodash"
import { Users } from "lucide-react"
import { useMemo } from "react"
import { TbHelpCircle } from "react-icons/tb"
import { useListAssignees } from "src/api/assignee/assignee"
import {
	DistributionTab,
	type TaskRowDto,
	type UserViewDto,
} from "src/api/model"
import { useListTags } from "src/api/tag/tag"
import { useUserView } from "src/providers/UserViewProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import addAssignee from "../../assets/icons/add-person.svg"
import subject from "../../assets/icons/subjects.svg"
import { EmptyCardState } from "../shared/EmptyCardState"
import { Button } from "../ui/button"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip"

interface DistributionTabConfig {
	id: DistributionTab
	label: string
}

interface SystemDistributionProps {
	onSetAssignees?: () => void
	tasks: TaskRowDto[]
}

const TABS: DistributionTabConfig[] = [
	{ id: DistributionTab.load, label: "חלוקת עומסים" },
	{ id: DistributionTab.attention, label: "חלוקת קשב" },
]

const TabsDescription = {
	[DistributionTab.load]: {
		imgSrc: addAssignee,
		title: "טרם הוגדרו אחראים",
		description: "לא נמצאו אחראים כדי להציג נתונים",
	},
	[DistributionTab.attention]: {
		imgSrc: subject,
		title: "טרם הוגדרו נושאים",
		description: "ביצירת הנחיות ניתן לחלק אותם לנושאים,\nקטגוריות או מאמצים",
	},
}

const HEADER_LABELS = {
	[DistributionTab.load]: { name: "אחראי", count: "כמות הנחיות" },
	[DistributionTab.attention]: { name: "נושא", count: "כמות הנחיות" },
}

type NamedEntity = { name: string }

type DistributionKey = "assignee" | "tags" | "source.tags"

function buildDistribution<T extends NamedEntity>(
	sourceList: T[],
	keys: DistributionKey | DistributionKey[],
	tasks: TaskRowDto[],
): { name: string; count: number }[] {
	const keyList = Array.isArray(keys) ? keys : [keys]
	const counts = countBy(
		flatMap(tasks, (task) =>
			compact(flatMap(keyList, (key) => [get(task, key)].flat())),
		),
		"name",
	)

	return chain(sourceList)
		.map((s) => ({ name: s.name, count: counts[s.name] ?? 0 }))
		.filter(({ count }) => count > 0)
		.orderBy("count", "desc")
		.value()
}

export default function SystemDistribution({
	onSetAssignees,
	tasks,
}: SystemDistributionProps) {
	const { view, updateView } = useUserView()

	const activeTab = view.dashboard.distributionTab

	const {
		workspace: { id: workspaceId },
	} = useWorkspace()
	const { data: assignees = [] } = useListAssignees({ workspaceId })
	const { data: tags = [] } = useListTags({ workspaceId })

	const assigneeDistribution = useMemo(
		() => buildDistribution(assignees, "assignee", tasks),
		[tasks, assignees],
	)

	const tagDistribution = useMemo(
		() => buildDistribution(tags, ["tags", "source.tags"], tasks),
		[tasks, tags],
	)

	const activeData =
		activeTab === DistributionTab.load ? assigneeDistribution : tagDistribution

	const tabDescription = TabsDescription[activeTab]

	const hasData = !!(activeData && activeData.length > 0)

	const maxCount =
		hasData && activeData ? Math.max(...activeData.map((d) => d.count), 1) : 1

	const headerLabels = HEADER_LABELS[activeTab]

	async function handleTabClick(distributionTab: DistributionTab) {
		const nextView: UserViewDto = {
			...view,
			dashboard: {
				...view.dashboard,
				distributionTab,
			},
		}

		await updateView(nextView)
	}

	return (
		<Section>
			<TabsWrapper>
				<TabsHeader>
					{TABS.map((tab) => (
						<TabItem
							key={tab.id}
							$active={tab.id === activeTab}
							onClick={() => handleTabClick(tab.id)}
						>
							<TabTitle $active={tab.id === activeTab}>{tab.label}</TabTitle>
						</TabItem>
					))}

					<Tooltip>
						<TooltipTrigger asChild>
							<HelpIconWrapper>
								<TbHelpCircle size={16} />
							</HelpIconWrapper>
						</TooltipTrigger>
						<TooltipContent side="top" sideOffset={-16} collisionPadding={12}>
							הנחיות שלא הסתיימו בלבד
						</TooltipContent>
					</Tooltip>
				</TabsHeader>
				<ContentPanel $hasData={hasData}>
					{hasData ? (
						<ChartWrapper>
							<ChartHeader>
								<HeaderLabel>{headerLabels.name}</HeaderLabel>
								<HeaderLabel>{headerLabels.count}</HeaderLabel>
							</ChartHeader>
							<BarList>
								{activeData?.map((item) => (
									<BarRow key={item.name}>
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<AssigneeName>{item.name}</AssigneeName>
												</TooltipTrigger>
												<TooltipContent>{item.name}</TooltipContent>
											</Tooltip>
										</TooltipProvider>
										<BarTrack>
											<BarFill $pct={(item.count / maxCount) * 100} />
										</BarTrack>
										<CountLabel>{item.count}</CountLabel>
									</BarRow>
								))}
							</BarList>
						</ChartWrapper>
					) : (
						<EmptyCardState
							imgSrc={tabDescription.imgSrc}
							title={tabDescription.title}
							description={tabDescription.description}
						>
							{activeTab === DistributionTab.load && (
								<Button variant="outline" size="sm" onClick={onSetAssignees}>
									הגדרת מקבלי הנחיות
									<Users size={16} />
								</Button>
							)}
						</EmptyCardState>
					)}
				</ContentPanel>
			</TabsWrapper>
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
  justify-self: end;

  @media (max-width: 1300px) {
    grid-column: 2;
    grid-row: 2;
    width: 100%;
    flex-shrink: 1;
  }
`

const TabsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const TabsHeader = styled.div`
  display: flex;
  gap: 2px;
  position: relative;
  z-index: 2;
`

const TabItem = styled.button<{ $active: boolean }>`
  height: 46px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom-color: ${({ $active }) =>
		$active ? "var(--background)" : "var(--border)"};
  border-radius: 6px 6px 0 0;
  background: ${({ $active }) =>
		$active ? "var(--background)" : "transparent"};
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  cursor: pointer;
  margin-bottom: -1px;
  transition: opacity 0.15s;
`

const TabTitle = styled.span<{ $active: boolean }>`
  font-size: 15px;
  font-weight: 400;
  color: var(--foreground);
`

const HelpIconWrapper = styled.span`
  margin-inline-start: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color-400);
  padding: 0.8rem;
  flex-shrink: 0;
`

const ContentPanel = styled.div<{ $hasData?: boolean }>`
  flex: 1;
  background: var(--background);
  border-radius: 8px;
  border-start-start-radius: 0;
  max-height: 352px;
  display: flex;
  align-items: ${({ $hasData }) => ($hasData ? "flex-start" : "center")};
  justify-content: center;
  position: relative;
  z-index: 1;
  overflow-y: auto;
  direction: ltr;
`

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 20px 20px;
  width: 100%;
  direction: rtl;
`

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
`

const HeaderLabel = styled.span`
  font-size: var(--fs-base);
  color: var(--sea-ink-soft);
`

const BarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 324px;
  padding: 5px 15px;
  overflow-y: auto;
`

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`

const AssigneeName = styled.span`
  font-size: var(--fs-base);
  color: var(--sea-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 120px;
  flex-shrink: 0;
`

const CountLabel = styled.span`
  font-size: var(--fs-base);
  color: var(--sea-ink);
  width: 24px;
  text-align: end;
  flex-shrink: 0;
`

const BarTrack = styled.div`
  flex: 1;
  height: 8px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`

const BarFill = styled.div<{ $pct: number }>`
  position: absolute;
  inset-inline-end: 0;
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: #bae0ff;
`
