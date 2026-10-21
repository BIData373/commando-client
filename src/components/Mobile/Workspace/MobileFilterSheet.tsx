import styled from "@emotion/styled"
import type { ColumnFiltersState } from "@tanstack/react-table"
import { compact, flatMap, map, uniqBy, xor } from "lodash"
import { X } from "lucide-react"
import { useState } from "react"
import type { TaskRowDto } from "src/api/model"
import { Accordion } from "src/components/ui/accordion"
import { Sheet, SheetContent } from "src/components/ui/sheet"
import { buildFilterOptionsMap } from "src/functions/filter-utils"
import { formatSourceLabel } from "src/functions/source-utils"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import MobileDateFilter from "./MobileDateFilter"
import MobileFilterSection from "./MobileFilterSection"
import MobileListFilter from "./MobileListFilter"

const DATE_SECTION = { label: "סנן לפי תאריך", key: "date" } as const

const LIST_SECTIONS = [
	{ label: "סנן לפי אחראי", key: "assignee", placeholder: "חפש אחראי" },
	{ label: "סנן על פי מקור", key: "source", placeholder: "חפש מקור" },
	{ label: "סנן על פי סטטוס", key: "status", placeholder: "חפש סטטוס" },
] as const

export type ListFilterKey = (typeof LIST_SECTIONS)[number]["key"]

const COLUMN_ACCESSORS: Record<ListFilterKey, (task: TaskRowDto) => string> = {
	assignee: (task) => task.assignee?.name ?? "",
	source: (task) => (task.source ? formatSourceLabel(task.source) : ""),
	status: (task) => task.status.type,
}

export function matchesColumnFilters(
	task: TaskRowDto,
	columnsFilters: ColumnFiltersState,
): boolean {
	return columnsFilters.every(({ id, value }) => {
		const accessor = COLUMN_ACCESSORS[id as ListFilterKey]
		return accessor ? (value as string[]).includes(accessor(task)) : true
	})
}

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
		clearMobileFilters,
	} = useTasksFilters()

	const [expandedKey, setExpandedKey] = useState("")

	const filterOptions = buildFilterOptionsMap(tasks)

	const assignees = uniqBy(
		compact(
			flatMap(tasks, ({ assignee, otherAssignees }) => [
				assignee,
				...map(otherAssignees, "assignee"),
			]),
		),
		"name",
	)

	function getColumnFilterValues(columnId: string): string[] {
		return (
			(columnsFilters.find((f) => f.id === columnId)?.value as string[]) ?? []
		)
	}

	function handleToggleListItem(columnId: string, value: string) {
		const nextValues = xor(getColumnFilterValues(columnId), [value])
		const nextFilters = columnsFilters.filter((f) => f.id !== columnId)
		if (nextValues.length > 0) {
			nextFilters.push({ id: columnId, value: nextValues })
		}
		setColumnsFilters(nextFilters)
	}

	function handleOpenChange(isOpen: boolean) {
		if (!isOpen) {
			onClose()
		}
	}

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<StyledSheetContent side="bottom" showCloseButton={false}>
				<Header>
					<Title>מסננים</Title>
					<CloseButton onClick={onClose}>
						<X size={16} />
					</CloseButton>
				</Header>

				<OptionsList
					type="single"
					collapsible
					value={expandedKey}
					onValueChange={setExpandedKey}
				>
					<MobileFilterSection
						value={DATE_SECTION.key}
						label={DATE_SECTION.label}
					>
						<MobileDateFilter
							dateType={dateType}
							dateRange={dateRange}
							onDateTypeChange={setDateType}
							onDateRangeChange={setDateRange}
						/>
					</MobileFilterSection>

					{LIST_SECTIONS.map(({ key, label, placeholder }) => (
						<MobileFilterSection key={key} value={key} label={label}>
							<MobileListFilter
								options={filterOptions[key]}
								selected={getColumnFilterValues(key)}
								onToggle={(val) => handleToggleListItem(key, val)}
								placeholder={placeholder}
								assignees={key === "assignee" ? assignees : undefined}
							/>
						</MobileFilterSection>
					))}
				</OptionsList>

				<Footer>
					<ClearText
						disabled={columnsFilters.length === 0 && !dateRange}
						onClick={clearMobileFilters}
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

const OptionsList = styled(Accordion)`
	flex: 1;
	padding: 0 24px;
	overflow-y: auto;
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
