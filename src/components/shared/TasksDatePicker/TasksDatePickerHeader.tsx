import styled from "@emotion/styled"
import { ChevronDown } from "lucide-react"
import { DATE_TYPE } from "src/utils/date-utils"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../../ui/dropdown-menu"

interface TasksDatePickerHeaderProps {
	dateType: string
	onDateTypeChange: (type: DATE_TYPE) => void
}

export function TasksDatePickerHeader({
	dateType,
	onDateTypeChange,
}: TasksDatePickerHeaderProps) {
	return (
		<PopupHeader>
			<FilterLabel>סנן לפי:</FilterLabel>
			<DropdownMenu>
				<DateTypeTrigger>
					{dateType}
					<ChevronDown size={16} />
				</DateTypeTrigger>
				<StyledDropdownMenuContent align="start" sideOffset={6}>
					{Object.values(DATE_TYPE).map((type) => (
						<DateTypeItem
							key={type}
							$selected={type === dateType}
							dir="rtl"
							onSelect={() => onDateTypeChange(type)}
						>
							{type}
						</DateTypeItem>
					))}
				</StyledDropdownMenuContent>
			</DropdownMenu>
		</PopupHeader>
	)
}

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const FilterLabel = styled.span`
  font-size: var(--fs-base);
  font-weight: 600;
  color: var(--sea-ink-soft);
  white-space: nowrap;
`

const DateTypeTrigger = styled(DropdownMenuTrigger)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 16px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--background);
  color: var(--sea-ink);
  font-size: var(--fs-btn);
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: var(--chip-bg);
  }

  &[data-state="open"] {
    color: var(--primary);
    border-color: var(--primary);
  }
`

const StyledDropdownMenuContent = styled(DropdownMenuContent)`
  padding: 4px;
  background: var(--background);
  border-radius: 6px;
  box-shadow: var(--shadow-popover);
  z-index: var(--z-dropdown);
`

const DateTypeItem = styled(DropdownMenuItem)<{ $selected: boolean }>`
  padding: 0.4rem;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  border-radius: 6px;
  background: ${({ $selected }) =>
		$selected ? "var(--link-bg-hover)" : "transparent"};

  color: var(--sea-ink);
  font-size: var(--fs-btn);
  text-align: start;

  &:focus {
    background: var(--link-bg-hover);
  }
`
