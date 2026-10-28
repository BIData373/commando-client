import styled from "@emotion/styled"
import { TbFilter } from "react-icons/tb"
import type { FilterOption } from "../../utils/filter-utils"
import { FilterDropdown } from "../shared/FilterDropdown"

interface ColumnFilterDropdownProps {
	options: FilterOption[]
	activeValues: Set<string>
	onApply: (values: Set<string>) => void
	isActive: boolean
	onOpenChange: (open: boolean) => void
	searchable?: boolean
}

function ColumnFilterDropdown({
	options,
	activeValues,
	onApply,
	isActive,
	onOpenChange,
	searchable,
}: ColumnFilterDropdownProps) {
	function handleApply(values: string[]) {
		onApply(new Set(values))
	}

	return (
		<FilterDropdown
			options={options}
			activeValues={[...activeValues]}
			onApply={handleApply}
			onOpenChange={onOpenChange}
			searchable={searchable}
			searchPlaceholder="חפש..."
		>
			<IconButton $active={isActive}>
				<TbFilter size={16} />
				{isActive && <ActiveBadge />}
			</IconButton>
		</FilterDropdown>
	)
}

export { ColumnFilterDropdown }

// ─── Styled ──────────────────────────────────────────────────────────────────

const ActiveBadge = styled.span`
  position: absolute;
  top: -2px;
  inset-inline-start: -2px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #1677FF;
`

const IconButton = styled.button<{ $active: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#1677FF" : "rgba(0, 0, 0, 0.45)")};
  flex-shrink: 0;

  &:hover {
    color: ${({ $active }) => ($active ? "#1677FF" : "rgba(0, 0, 0, 0.65)")};
  }
`
