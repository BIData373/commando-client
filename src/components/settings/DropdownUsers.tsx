import { useRef } from "react";
import { useUsers } from "#/hooks/useUsers";
import type { IUser } from "#/types";
import { SearchDropdown } from "./SearchDropdown";
import { UserItem } from "./UserDropdownItem";

interface DropdownUsersProps {
    value: string
    onChange(value: string): void
    onSelect(user: IUser | null): void
    onClear(): void
    placeholder?: string
}

export function DropdownUsers({
    value,
    onChange,
    onSelect,
    onClear,
    placeholder,
}: DropdownUsersProps) {
    const { data: users = [], isLoading } = useUsers()

    function filterUsers(query: string) {
        return query.trim()
            ? users.filter((u) => u.name.includes(query) || u.email.includes(query))
            : []
    }

    const filteredUsers = filterUsers(value)

    function handleUserSearch(newValue: string) {
        onChange(newValue)
        if (filterUsers(newValue).length === 0) {
            onSelect(null)
        }
    }

    return (
        <SearchDropdown<IUser>
            items={filteredUsers}
            value={value}
            onChange={handleUserSearch}
            onSelect={onSelect}
            onClear={onClear}
            placeholder={placeholder}
            isLoading={isLoading}
            renderItem={(item) => <UserItem user={item} />}
        />
    )
}
