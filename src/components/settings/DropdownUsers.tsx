import { debounce } from "lodash";
import { useMemo, useState } from "react";
import type { UserDto } from "src/api/model";
import { useSearchUsers } from "src/api/user/user";
import { SearchDropdown } from "./SearchDropdown";
import { UserItem } from "./UserDropdownItem";
import { useEffect } from 'react'

interface DropdownUsersProps {
	value: string;
	onChange(value: string): void;
	onSelect(user: UserDto | null): void;
	onClear(): void;
	placeholder?: string;
}

export function DropdownUsers({
	value,
	onChange,
	onSelect,
	onClear,
	placeholder,
}: DropdownUsersProps) {
	const [localValue, setLocalValue] = useState(value)

	const { data: users = [], isLoading } = useSearchUsers(
		{ search: value },
		{ query: { enabled: value.length > 0 } }
	);

	const onChangeDebounced = useMemo(
		() => debounce(onChange, 300),
		[onChange]
	)

	useEffect(() => {
		setLocalValue(value)
	}, [value])

	function handleChange(value: string) {
		setLocalValue(value)
		onChangeDebounced(value)
	}

	return (
		<SearchDropdown<UserDto>
			items={users}
			value={localValue}
			onChange={handleChange}
			onSelect={onSelect}
			onClear={onClear}
			placeholder={placeholder}
			isLoading={isLoading}
			renderItem={(item) => <UserItem user={item} />}
		/>
	);
}
