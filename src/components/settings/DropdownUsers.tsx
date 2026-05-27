import type { UserDto } from "src/api/model";
import { useSearchUsers } from "src/api/user/user";
import { SearchDropdown } from "./SearchDropdown";
import { UserItem } from "./UserDropdownItem";

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
	const { data: users = [], isLoading } = useSearchUsers({ search: value });

	return (
		<SearchDropdown<UserDto>
			items={users}
			value={value}
			onChange={onChange}
			onSelect={onSelect}
			onClear={onClear}
			placeholder={placeholder}
			isLoading={isLoading}
			renderItem={(item) => <UserItem user={item} />}
		/>
	);
}
