import styled from '@emotion/styled'
import { ChevronDown } from 'lucide-react'
import type { UserRole } from '#/types'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

interface SelectDropdownPermissionProps {
    value: UserRole
    ghost?: boolean
    onChange?(role: UserRole): void
}

export function DropdownPermission({ value, ghost, onChange }: SelectDropdownPermissionProps) {
    function onSelectViewer() {
        onChange?.('user')
    }

    function onSelectAdmin() {
        onChange?.('admin')
    }

    return (
        <DropdownMenu>
            <RoleTrigger $ghost={ghost}>
                {value === 'user' ? 'צפייה' : 'ניהול'}
                <ChevronDown size={16} />
            </RoleTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={onSelectViewer}>צפייה</DropdownMenuItem>
                <DropdownMenuItem onSelect={onSelectAdmin}>ניהול</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const RoleTrigger = styled(DropdownMenuTrigger) <{ $ghost?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;
  padding: 3px 16px;

  cursor: pointer;

  ${props => props.$ghost && `
    border-radius: 6px;
    border: 1px solid var(--card-border);
    background: rgba(0, 0, 0, 0.04);
  `}
`