import type { UserDto } from "src/api/model"
import { useListUsers } from "src/api/user/user"
import { SearchDropdown } from "./SearchDropdown"
import { UserItem } from "./UserDropdownItem"

interface DropdownUsersProps {
	value: string
	onChange(value: string): void
	onSelect(user: UserDto | null): void
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
	const { data: users = [], isLoading } = useListUsers()

	function filterUsers(query: string) {
		return query.trim()
			? users.filter(
					(u) => u.info?.displayName?.includes(query) || u.upn.includes(query),
				)
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
		<SearchDropdown<UserDto>
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
