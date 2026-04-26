import styled from '@emotion/styled'
import { ChevronDown } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu'


export const DATE_TYPES = [
    'תאריך יצירה',
    'לפי ת"ג',
    'תאריך מתן הנחייה',
    'תאריך עדכון',
    'תאריך סיום',
] as const

interface PickerHeaderProps {
    dateType: string
    onDateTypeChange: (type: string) => void
}

export function DatePickerHeader({ dateType, onDateTypeChange }: PickerHeaderProps) {
    return (
        <PopupHeader>
            <FilterLabel>סנן לפי:</FilterLabel>
            <DropdownMenu>
                <DateTypeTrigger>
                    {dateType}
                    <ChevronDown size={16} />
                </DateTypeTrigger>
                <DropdownMenuContent align="end">
                    {DATE_TYPES.map((type) => (
                        <DropdownMenuItem key={type} onSelect={() => onDateTypeChange(type)}>
                            {type}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </PopupHeader>
    )
}


const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const FilterLabel = styled.span`
  font-size: 14px;
  color: var(--sea-ink-soft);
  white-space: nowrap;
`

const DateTypeTrigger = styled(DropdownMenuTrigger)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--background);
  color: var(--sea-ink);
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: var(--chip-bg);
  }
`