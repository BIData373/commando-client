import styled from '@emotion/styled'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '../ui/dropdown-menu'
import { StatusTag, STATUS_KEYS } from './StatusTag'
import type { DirectiveStatus } from './StatusTag'

interface StatusDropdownProps {
  status: DirectiveStatus
  onStatusChange: (status: DirectiveStatus) => void
}

export function StatusDropdown({ status, onStatusChange }: StatusDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TriggerWrapper tabIndex={0}>
          <StatusTag status={status} interactive />
        </TriggerWrapper>
      </DropdownMenuTrigger>
      <MenuContent align="center" sideOffset={6}>
        {STATUS_KEYS.map((s) => (
          <MenuItem key={s} $selected={s === status} onSelect={() => onStatusChange(s)}>
            <StatusTag status={s} />
          </MenuItem>
        ))}
      </MenuContent>
    </DropdownMenu>
  )
}

const TriggerWrapper = styled.span`
  cursor: pointer;

  &:focus-visible {
    outline: none;
  }
`

const MenuContent = styled(DropdownMenuContent)`
  width: 100px;
  min-width: 100px;
  padding: 8px 4px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px rgba(0, 0, 0, 0.12),
    0px 9px 28px rgba(0, 0, 0, 0.05);
`

const MenuItem = styled(DropdownMenuItem)<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 4px;
  border-radius: 4px;
  background: ${({ $selected }) => ($selected ? 'rgba(230, 244, 255, 1)' : 'transparent')};
  cursor: pointer;
  outline: none;

  &[data-highlighted],
  &:hover {
    background: rgba(230, 244, 255, 1);
    color: inherit;
  }
`
