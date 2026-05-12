import { useState } from 'react'
import styled from '@emotion/styled'
import { TbFilter } from 'react-icons/tb'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Checkbox } from '../ui/checkbox'
import type { FilterOption } from '../../functions/filter-utils'

interface ColumnFilterDropdownProps {
  options: FilterOption[]
  activeValues: Set<string>
  onApply: (values: Set<string>) => void
  isActive: boolean
  onOpenChange: (open: boolean) => void
}

function ColumnFilterDropdown({
  options,
  activeValues,
  onApply,
  isActive,
  onOpenChange,
}: ColumnFilterDropdownProps) {
  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set(activeValues))

  function handleOpenChange(open: boolean) {
    if (open) {
      setSelectedValues(new Set(activeValues))
    }
    onOpenChange(open)
  }

  function toggleOption(value: string) {
    setSelectedValues((prev) => {
      const next = new Set(prev)
      if (next.has(value)) {
        next.delete(value)
      } else {
        next.add(value)
      }
      return next
    })
  }

  function handleApply() {
    onApply(selectedValues)
    onOpenChange(false)
  }

  function handleReset() {
    onApply(new Set())
    onOpenChange(false)
  }

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <IconButton
          $active={isActive}
          onClick={(e) => e.stopPropagation()}
        >
          <TbFilter size={16} />
          {isActive && <ActiveBadge />}
        </IconButton>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={8} asChild>
        <DropdownPanel>
          <ItemList>
            {options.map((option) => (
              <DropdownItem
                key={option.value}
                $selected={selectedValues.has(option.value)}
                onClick={() => toggleOption(option.value)}
              >
                <OptionLabel>{option.label}</OptionLabel>
                <Checkbox checked={selectedValues.has(option.value)} />
              </DropdownItem>
            ))}
          </ItemList>
          <Divider />
          <FooterRow>
            <ResetButton onClick={handleReset}>
              אפס
            </ResetButton>
            <ApplyButton onClick={handleApply} disabled={selectedValues.size === 0}>
              החל ({selectedValues.size})
            </ApplyButton>
          </FooterRow>
        </DropdownPanel>
      </PopoverContent>
    </Popover>
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
  color: ${({ $active }) => ($active ? '#1677FF' : 'rgba(0, 0, 0, 0.45)')};
  flex-shrink: 0;

  &:hover {
    color: ${({ $active }) => ($active ? '#1677FF' : 'rgba(0, 0, 0, 0.65)')};
  }
`

const DropdownPanel = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px;
  border-radius: 8px;
  background: white;
  box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.08),
    0px 3px 6px 0px rgba(0, 0, 0, 0.12),
    0px 9px 28px 0px rgba(0, 0, 0, 0.05);
  width: auto;
  min-width: 180px;
`

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 200px;
  overflow-y: auto;
`

const DropdownItem = styled.div<{ $selected: boolean }>`
  direction: ltr;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  height: 32px;
  padding: 5px 12px;
  cursor: pointer;
  background: ${({ $selected }) => ($selected ? 'rgba(0, 0, 0, 0.04)' : 'transparent')};

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`

const OptionLabel = styled.span`
  flex: 1;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  text-align: end;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Divider = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin-block: 4px;
`

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ApplyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding-inline: 7px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: white;
  cursor: pointer;
  background: linear-gradient(158deg, #6866ff 0%, #7604c8 100%);
  box-shadow: 0px 2px 0px 0px rgba(5, 145, 255, 0.1);

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding-inline: 7px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  cursor: pointer;
  background: transparent;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`
