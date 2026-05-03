import styled from '@emotion/styled'
import { ChevronDown } from 'lucide-react'
import { UserRole } from '#/types'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

interface SelectDropdownPermissionProps {
    value: UserRole
    ghost?: boolean
    disabled?: boolean
    onChange?(role: UserRole): void
}

export function DropdownPermission({ value, ghost, disabled, onChange }: SelectDropdownPermissionProps) {

    function onSelectViewer() {
        onChange?.(UserRole.VIEWER)
    }

    function onSelectAdmin() {
        onChange?.(UserRole.ADMIN)
    }

    return (
        <DropdownMenu>
            <RoleTrigger $ghost={ghost} disabled={disabled}>
                {value === UserRole.VIEWER ? 'צפייה' : 'ניהול'}
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
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);

   ${({ $ghost }) => $ghost && `
    border-radius: 6px;
    border: 1px solid var(--card-border);
    background: rgba(0, 0, 0, 0.04);
  `}
`;
