import styled from "@emotion/styled"
import { Download, FilterX, Search, X } from "lucide-react"
import type { ReactNode } from "react"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import type { TaskColumnMeta } from "src/utils/task-table-utils"
import { ColumnVisibilityDropdown } from "../Tasks/ColumnVisibilityDropdown"

interface FilterBarProps {
	children: ReactNode
	hasActiveFilters: boolean
	onClearAll: () => void
	onExport: () => void
	extraColumnsMeta?: TaskColumnMeta[]
	startSlot?: ReactNode
}

function FilterBar({
	children,
	hasActiveFilters,
	onClearAll,
	onExport,
	extraColumnsMeta,
	startSlot,
}: FilterBarProps) {
	const { searchQuery, setSearchQuery } = useTasksFilters()

	return (
		<BarRoot>
			<BarStart>
				{startSlot}
				<FilterDivider />
				<ColumnVisibilityDropdown extraColumnsMeta={extraColumnsMeta} />
				<ActionButton onClick={onExport}>
					<Download size={18} />
				</ActionButton>
				<SearchInputWrapper>
					<SearchField
						placeholder="חפש הנחייה"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<SearchIconBox>
						{searchQuery ? (
							<ClearIcon size={14} onClick={() => setSearchQuery("")} />
						) : (
							<SearchIcon size={16} />
						)}
					</SearchIconBox>
				</SearchInputWrapper>
			</BarStart>
			<BarEnd>
				{hasActiveFilters && (
					<>
						<ClearButton onClick={onClearAll}>
							<FilterX size={18} />
							נקה סננים
						</ClearButton>
						<FilterSeparator />
					</>
				)}
				{children}
			</BarEnd>
		</BarRoot>
	)
}

export { FilterBar }

const BarRoot = styled.div`
  direction: ltr;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
`

const BarStart = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const BarEnd = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ClearButton = styled.button`
  direction: rtl;
  display: flex;
  padding: 0 15px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  height: 40px;
  border-radius: 8px;
  font-size: var(--fs-base);
  color: var(--text-color-2);
  cursor: pointer;
  background: var(--Components-Dropdown-Global-controlItemBgHover);
  white-space: nowrap;

  &:hover {
    background: var(--link-bg-hover);
  }
`

const ActionButton = styled.button`
  display: flex;
  padding: 0 15px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--card-border);
  background: var(--background);
  box-shadow: var(--shadow-button);
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: var(--link-bg-hover);
  }
`

const SearchInputWrapper = styled.div`
  direction: rtl;
  display: flex;
  align-items: center;
  height: 40px;
  width: 222px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: white;
  overflow: hidden;
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);

  &:focus-within {
    border-color: rgba(9, 88, 217, 0.6);
  }
`

const SearchIconBox = styled.div`
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
`

const SearchIcon = styled(Search)`
  color: rgba(0, 0, 0, 0.25);
  animation: scale-in 0.15s ease;
`

const ClearIcon = styled(X)`
  color: white;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  padding: 2px;
  animation: scale-in 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.35);
  }
`

const SearchField = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  padding: 0 11px 0 0;
  text-align: right;
  direction: rtl;

  &::placeholder {
    color: var(--Text-color-text-placeholder);
  }
`

export const FilterPill = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding-inline: 12px;
  height: 32px;
  border-radius: 999px;
  font-size: var(--fs-btn);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
  border: 1px solid ${({ $active }) => ($active ? "rgba(9, 88, 217, 0.6)" : "#D9D9D9")};
  background: #FFF;
  color: ${({ $active }) => ($active ? "rgba(9, 88, 217, 1)" : "var(--sea-ink)")};

  &:hover {
    background: var(--link-bg-hover);
  }
`

const FilterDivider = styled.div`
  width: 1px;
  height: 39px;
  background: var(--card-border);
`

export const FilterSeparator = styled.div`
  width: 1px;
  height: 25px;
  background: var(--Text-color-text-placeholder);
`
