import styled from "@emotion/styled"
import type { Table } from "@tanstack/react-table"
import { compact, flatMap, map, uniqBy, xor } from "lodash"
import { useMemo, useState } from "react"
import type { TaskRowDto } from "src/api/model"
import { MobileDrawer } from "src/components/Mobile/MobileDrawer"
import { Accordion } from "src/components/ui/accordion"
import type { AppTableFeatures } from "src/consts/table-features"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { buildFilterOptionsMap } from "src/utils/filter-utils"
import MobileDateFilter from "./MobileDateFilter"
import MobileFilterSection from "./MobileFilterSection"
import MobileListFilter from "./MobileListFilter"

const DATE_SECTION = { label: "סנן לפי תאריך", key: "date" } as const

const LIST_SECTIONS = [
	{ label: "סנן לפי אחראי", key: "assignee", placeholder: "חפש אחראי" },
	{ label: "סנן על פי מקור", key: "source", placeholder: "חפש מקור" },
	{ label: "סנן על פי סטטוס", key: "status", placeholder: "חפש סטטוס" },
] as const

interface MobileFilterSheetProps {
	open: boolean
	onClose: () => void
	tasks: TaskRowDto[]
	table: Table<AppTableFeatures, TaskRowDto>
	filteredCount: number
}

export default function MobileFilterSheet({
	open,
	onClose,
	tasks,
	table,
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

	// The sheet stays mounted while closed, so without these every search keystroke would rebuild them
	const filterOptions = useMemo(() => buildFilterOptionsMap(tasks), [tasks])

	const assignees = useMemo(
		() =>
			uniqBy(
				compact(
					flatMap(tasks, ({ assignee, otherAssignees }) => [
						assignee,
						...map(otherAssignees, "assignee"),
					]),
				),
				"name",
			),
		[tasks],
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
		<FilterDrawer open={open} onOpenChange={handleOpenChange} title="מסננים">
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
							column={table.getColumn(key)}
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
		</FilterDrawer>
	)
}

const FilterDrawer = styled(MobileDrawer)`
  direction: rtl;
  height: 80vh;
  padding-bottom: 0;

  button {
    &:active:not(:disabled) {
      opacity: 0.7;
    }
  }
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
