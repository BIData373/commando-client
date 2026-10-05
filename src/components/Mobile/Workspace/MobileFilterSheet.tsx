import styled from "@emotion/styled"
import { uniqBy, xor } from "lodash"
import { ChevronDown, ChevronLeft, X } from "lucide-react"
import { useState } from "react"
import type { AssigneeDto, TaskRowDto } from "src/api/model"
import { Sheet, SheetContent } from "src/components/ui/sheet"
import { buildFilterOptionsMap } from "src/functions/filter-utils"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { DATE_TYPE } from "src/utils/date-utils"
import MobileDateFilter from "../Workspace/MobileDateFilter"
import MobileListFilter from "../Workspace/MobileListFilter"

const FILTER_SECTIONS = [
	{ label: "סנן לפי תאריך", key: "date" },
	{ label: "סנן לפי אחראי", key: "assignee" },
	{ label: "סנן על פי מקור", key: "source" },
	{ label: "סנן על פי סטטוס", key: "status" },
] as const

const LIST_PLACEHOLDERS: Record<Exclude<FilterKey, "date">, string> = {
	assignee: "חפש אחראי",
	source: "חפש מקור",
	status: "חפש סטטוס",
}

export type FilterKey = (typeof FILTER_SECTIONS)[number]["key"]

interface MobileFilterSheetProps {
	open: boolean
	onClose: () => void
	tasks: TaskRowDto[]
	filteredCount: number
}

export default function MobileFilterSheet({
	open,
	onClose,
	tasks,
	filteredCount,
}: MobileFilterSheetProps) {
	const {
		dateType,
		setDateType,
		dateRange,
		setDateRange,
		columnsFilters,
		setColumnsFilters,
	} = useTasksFilters()

	const [expandedKey, setExpandedKey] = useState<FilterKey | null>(null)

	const filterOptions = buildFilterOptionsMap(tasks)

	const assignees =
		expandedKey === "assignee"
			? uniqBy(
					tasks
						.flatMap((t) => [
							t.assignee,
							...t.otherAssignees.map((oa) => oa.assignee),
						])
						.filter(Boolean) as AssigneeDto[],
					"name",
				)
			: undefined

	function getColumnFilterValues(columnId: string): string[] {
		return (
			(columnsFilters.find((f) => f.id === columnId)?.value as string[]) ?? []
		)
	}

	function handleToggleSection(key: FilterKey) {
		setExpandedKey((prev) => (prev === key ? null : key))
	}

	function handleToggleListItem(columnId: string, value: string) {
		const nextValues = xor(getColumnFilterValues(columnId), [value])
		const nextFilters = columnsFilters.filter((f) => f.id !== columnId)
		if (nextValues.length > 0) {
			nextFilters.push({ id: columnId, value: nextValues })
		}
		setColumnsFilters(nextFilters)
	}

	function handleClearSelection() {
		setColumnsFilters([])
		setDateRange(undefined)
		setDateType(DATE_TYPE.CREATION_DATE)
	}

	return (
		<Sheet open={open} onOpenChange={(o) => !o && onClose()}>
			<StyledSheetContent side="bottom" showCloseButton={false}>
				<Header>
					<Title>מסננים</Title>
					<CloseButton onClick={onClose}>
						<X size={16} />
					</CloseButton>
				</Header>

				<OptionsList>
					{FILTER_SECTIONS.map((section) => (
						<Section key={section.key}>
							<SectionHeader onClick={() => handleToggleSection(section.key)}>
								{section.label}
								{expandedKey === section.key ? (
									<ChevronDown size={16} />
								) : (
									<ChevronLeft size={16} />
								)}
							</SectionHeader>

							{expandedKey === section.key && (
								<SectionContent>
									{section.key === "date" ? (
										<MobileDateFilter
											dateType={dateType}
											dateRange={dateRange}
											onDateTypeChange={setDateType}
											onDateRangeChange={setDateRange}
										/>
									) : (
										<MobileListFilter
											options={
												filterOptions[section.key as Exclude<FilterKey, "date">]
											}
											selected={getColumnFilterValues(section.key)}
											onToggle={(val) => handleToggleListItem(section.key, val)}
											placeholder={LIST_PLACEHOLDERS[section.key]}
											assignees={
												section.key === "assignee" ? assignees : undefined
											}
										/>
									)}
								</SectionContent>
							)}

							<SectionDivider />
						</Section>
					))}
				</OptionsList>

				<Footer>
					<ClearText
						disabled={columnsFilters.length === 0 && !dateRange}
						onClick={handleClearSelection}
					>
						נקה בחירה
					</ClearText>
					<ShowButton disabled={filteredCount === 0} onClick={onClose}>
						להציג {filteredCount > 100 ? "100+" : filteredCount} הנחיות
					</ShowButton>
				</Footer>
			</StyledSheetContent>
		</Sheet>
	)
}

const StyledSheetContent = styled(SheetContent)`
	direction: rtl;
	display: flex;
	flex-direction: column;

	button {
		&:active:not(:disabled) {
			opacity: 0.7;
		}
	}
	height: 85vh;
	padding: 0;
	gap: 0;
	border-start-start-radius: 8px;
	border-start-end-radius: 8px;
	box-shadow: var(--sheet-shadow);
`

const Header = styled.div`
	display: flex;
	align-items: center;
	padding: 24px 23px 16px 23px;
	border-bottom: 1px solid var(--button-hover);
`

const Title = styled.span`
	flex: 1;
	font-size: var(--fs-xl);
	font-weight: 400;
	color: var(--sea-ink);
`

const CloseButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	background: none;
	border: none;
	padding: 0;
	color: var(--sea-ink);
`

const OptionsList = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	padding: 0 24px;
	overflow-y: auto;
`

const Section = styled.div`
	display: flex;
	flex-direction: column;
`

const SectionHeader = styled.button`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20px 0;
	background: none;
	border: none;
	color: var(--text-color-2);
	font-size: var(--fs-xl);
	font-weight: 400;
`

const SectionContent = styled.div`
	padding-bottom: 8px;
`

const SectionDivider = styled.div`
	height: 1px;
	background: var(--Bar-hover);
`

const Footer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24px 16px;
	box-shadow: var(--sheet-footer-shadow);
`

const ClearText = styled.button`
	background: none;
	border: none;
	padding: 8px 15px;
	font-size: var(--fs-lg);
	color: var(--text-color-2);

	&:disabled {
		color: var(--sea-ink-soft);
		opacity: 0.5;
	}
`

const ShowButton = styled.button`
	height: 40px;
	padding: 0 15px;
	border: none;
	border-radius: 8px;
	background: var(--default-linear);
	color: var(--background);
	font-size: var(--fs-lg);
	font-weight: 400;
	box-shadow: var(--shadow-inset);

	&:disabled {
		opacity: 0.5;
	}
`
