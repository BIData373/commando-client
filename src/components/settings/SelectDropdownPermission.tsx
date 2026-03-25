import styled from '@emotion/styled'
import { ChevronDown } from 'lucide-react'
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

interface SelectDropdownPermissionProps {
    initialRole: 'viewer' | 'admin'
    ghost?: boolean
}

export function SelectDropdownPermission({ initialRole, ghost }: SelectDropdownPermissionProps) {
    const [role, setRole] = useState<'viewer' | 'admin'>(initialRole)

    function onSelectViewer() {
        setRole('viewer')
    }

    function onSelectAdmin() {
        setRole('admin')
    }

    return (
        <DropdownMenu>
            <RoleTrigger ghost={ghost}>
                {role === 'viewer' ? 'צפייה' : 'ניהול'}
                <ChevronDown size={16} />
            </RoleTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={onSelectViewer}>צפייה</DropdownMenuItem>
                <DropdownMenuItem onSelect={onSelectAdmin}>ניהול</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const RoleTrigger = styled(DropdownMenuTrigger)`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;
  padding: 3px 16px;

  cursor: pointer;

  ${props => props.ghost && `
    border-radius: 6px;
    border: 1px solid var(--card-border);
    background: rgba(0, 0, 0, 0.04);
  `}
`

