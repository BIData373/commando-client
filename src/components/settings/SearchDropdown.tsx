import styled from '@emotion/styled'
import { Loader2, Search, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'

interface SearchDropdownProps<T extends { id: number | string }> {
  items: T[]
  renderItem: (item: T) => ReactNode
  onSelect: (item: T) => void
  value: string
  onChange: (value: string) => void
  placeholder?: string
  isLoading?: boolean
  onClear?: () => void
}

export function SearchDropdown<T extends { id: number | string }>({
  items,
  renderItem,
  onSelect,
  value,
  onChange,
  placeholder,
  isLoading,
  onClear,
}: SearchDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value)
    setIsOpen(e.target.value.trim().length > 0)
  }

  // function handleBlur() {
  //   setIsOpen(false)
  // }

  function handleSelect(item: T) {
    onSelect(item)
    setIsOpen(false)
  }

  function handleClear() {
    onClear?.()
    setIsOpen(false)
  }

  return (
    <Root>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          {isLoading ? <Loader2 size={16} /> : <Search size={16} />}
        </InputGroupAddon>
        <InputGroupInput
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
        {onClear && value.length > 0 && (
          <InputGroupAddon align="inline-end">
            <X size={16} cursor="pointer" onMouseDown={handleClear} />
          </InputGroupAddon>
        )}
      </InputGroup>
      {isOpen && items.length > 0 && (
        <Dropdown>
          {items.map((item) => (
            <DropdownItem key={item.id} onMouseDown={() => handleSelect(item)}>
              {renderItem(item)}
            </DropdownItem>
          ))}
        </Dropdown>
      )}
    </Root>
  )
}

const Root = styled.div`
  position: relative;
  width: 100%;
`

const Dropdown = styled.ul`
  position: absolute;
  inset-block-start: calc(100% + 4px);
  inset-inline-start: 0;
  inset-inline-end: 0;
  background: var(--background);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 4px 0;
  margin: 0;
  list-style: none;
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  max-height: 240px;
  overflow-y: auto;
`

const DropdownItem = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  direction: rtl;

  &:hover {
    background: var(--link-bg-hover);
  }
`
