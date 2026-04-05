import styled from '@emotion/styled'
import { Loader2, Search, X } from 'lucide-react'
import { useState } from 'react'
import type { IMesibaIcon } from '../../hooks/useMesiba'
import { useSearchMesibaIcons } from '../../hooks/useMesiba'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'

interface IconSearchInputProps {
  onChange: (iconName: string) => void
}

export function IconSearchInput({ onChange }: IconSearchInputProps) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const { data: icons = [], isFetching } = useSearchMesibaIcons(search)

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setSearch(val)
    setIsOpen(val.trim().length > 0)
  }

  function handleSelect(icon: IMesibaIcon) {
    onChange(icon.iconName)
    setSearch('')
    setIsOpen(false)
  }

  function handleBlur() {
    setIsOpen(false)
  }

  function handleClearSearch() {
    setSearch('')
    setIsOpen(false)
  }

  return (
    <Root>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          {isFetching ? <Loader2 size={16} /> : <Search size={16} />}
        </InputGroupAddon>
        <InputGroupInput
          value={search}
          onChange={handleSearchChange}
          onBlur={handleBlur}
          placeholder="חפש סמל"
        />
        {search.length > 0 && (
          <InputGroupAddon align="inline-end">
            <X size={16} cursor="pointer" onMouseDown={handleClearSearch} />
          </InputGroupAddon>
        )}
      </InputGroup>
      {isOpen && icons.length > 0 && (
        <Dropdown>
          {icons.map((icon) => (
            <DropdownItem key={icon.id} onMouseDown={() => handleSelect(icon)}>
              <IconThumb src={icon.iconName} alt={icon.heb_name} />
              <IconLabel>{icon.heb_name}</IconLabel>
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
  background: white;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 4px 0;
  margin: 0;
  list-style: none;
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  max-height: 200px;
  overflow-y: auto;
`

const DropdownItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  cursor: pointer;
  direction: rtl;

  &:hover {
    background: var(--link-bg-hover);
  }
`

const IconThumb = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 4px;
  flex-shrink: 0;
  cursor: pointer;
`

const IconLabel = styled.span`
  font-size: 14px;
  color: var(--sea-ink);
  cursor: pointer;
`
