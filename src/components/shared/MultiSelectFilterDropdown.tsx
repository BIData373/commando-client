import styled from "@emotion/styled"
import { ChevronDown } from "lucide-react"
import type { ReactNode } from "react"
import { FilterDropdown } from "./FilterDropdown"

interface FilterOption<T extends string | number> {
	value: T
	label: string
	icon?: ReactNode
}

interface MultiSelectFilterDropdownProps<T extends string | number> {
	label: string
	options: FilterOption<T>[]
	activeValues: Set<T>
	onApply: (selected: Set<T>) => void
	$active: boolean
	emptyTitle: string
	emptyDescription: string
}

function MultiSelectFilterDropdown<T extends string | number>({
	label,
	options,
	activeValues,
	onApply,
	$active,
	emptyTitle,
	emptyDescription,
}: MultiSelectFilterDropdownProps<T>) {
	function handleApply(values: T[]) {
		onApply(new Set(values))
	}

	return (
		<FilterDropdown
			options={options}
			activeValues={[...activeValues]}
			onApply={handleApply}
			searchPlaceholder="חפש..."
			emptyTitle={emptyTitle}
			emptyDescription={emptyDescription}
		>
			<TriggerPill $active={$active}>
				<ChevronDown size={16} />
				{label}
			</TriggerPill>
		</FilterDropdown>
	)
}

export { MultiSelectFilterDropdown }
export type { FilterOption }

const TriggerPill = styled.button<{ $active: boolean }>`
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
