import styled from '@emotion/styled'
import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { useUsers } from '#/hooks/useUsers'
import type { IUser } from '#/types'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'



interface UserSearchInputProps {
    placeholder?: string
    clearInput?: boolean
    value?: string
    onChange?(value: string): void
    onSelect?(user: IUser | null): void
}

function concatName(assignee?: IUser) {
    return `${assignee?.name} ${assignee?.id} ${assignee?.email} / ${assignee?.role}`
}

export function UserSearchInput({ placeholder, clearInput, value, onChange, onSelect }: UserSearchInputProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { data: users = [] } = useUsers()


    const filtered = value && value.trim().length > 0
        ? users.filter((user) =>
            user.name.includes(value) ||
            user.email.includes(value)
        )
        : []

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        onChange?.(value)
        setIsOpen(value.trim().length > 0)
    }

    function onBlur() {
        setIsOpen(false)
    }

    function handleSelect(user: IUser) {
        onChange?.(concatName(user))
        onSelect?.(user)
        setIsOpen(false)
    }

    function onClear() {
        onChange?.('')
        onSelect?.(null)
    }

    return (
        <Root>
            <InputGroup>
                <InputGroupAddon align={clearInput ? "inline-end" : "inline-start"}>
                    {clearInput ?
                        <X
                            onClick={onClear}
                            size={16}
                            cursor={"pointer"}
                        />
                        :
                        <Search size={16} />
                    }
                </InputGroupAddon>
                <InputGroupInput
                    value={value}
                    onChange={handleChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                />
            </InputGroup>
            {isOpen && filtered.length > 0 && (
                <Dropdown>
                    {filtered.map((user) => (
                        <DropdownItem key={user.id} onMouseDown={() => handleSelect(user)}>
                            <UserName>{user.name} - {user.id}</UserName>
                            <UserMeta>{user.email} / {user.role}</UserMeta>
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
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    padding: 10px 14px;
    cursor: pointer;
    direction: rtl;

    &:hover {
        background: var(--link-bg-hover);
    }
`

const UserName = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: var(--sea-ink);
`

const UserMeta = styled.span`
    font-size: 12px;
    color: var(--sea-ink-soft);
`
