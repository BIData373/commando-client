import styled from "@emotion/styled"
import { debounce } from "lodash"
import { UserPlus } from "lucide-react"
import { type PropsWithChildren, useEffect, useMemo, useState } from "react"
import type { UserDto } from "src/api/model"
import { useSearchUsers } from "src/api/user/user"
import { SearchDropdown } from "./SearchDropdown"
import { UserItem } from "./UserItem"

interface DropdownUsersProps extends PropsWithChildren {
	value: string
	onChange(value: string): void
	onSelect(user: UserDto | null): void
	onClear(): void
	onAdd?: () => void
	selectedUser?: UserDto | null
	showAddButton?: boolean
	placeholder?: string
}

export function DropdownUsers({
	value,
	onChange,
	onSelect,
	onClear,
	onAdd,
	selectedUser,
	placeholder,
	showAddButton,
	children,
}: DropdownUsersProps) {
	const [localValue, setLocalValue] = useState(value)

	const { data: rawUsers = [], isLoading } = useSearchUsers(
		{ search: value },
		{ query: { enabled: value.length > 0 } },
	)

	const onChangeDebounced = useMemo(() => debounce(onChange, 300), [onChange])

	useEffect(() => {
		setLocalValue(value)
	}, [value])

	function handleChange(value: string) {
		setLocalValue(value)
		if (value.length === 0) {
			onClear()
		} else {
			onChangeDebounced(value)
		}
	}

	return (
		<Row>
			<SearchDropdown<UserDto>
				items={rawUsers}
				value={localValue}
				onChange={handleChange}
				onSelect={onSelect}
				onClear={onClear}
				placeholder={placeholder}
				isLoading={isLoading}
				renderItem={(item) => <UserItem user={item} />}
			/>
			{children}
			{onAdd && showAddButton && (
				<AddButton
					type="button"
					$active={!!selectedUser}
					disabled={!selectedUser}
					onClick={onAdd}
				>
					<UserPlus size={16} />
				</AddButton>
			)}
		</Row>
	)
}

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`

const AddButton = styled.button<{ $active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid var(--line);
  overflow: hidden;
  cursor: ${({ $active }) => ($active ? "pointer" : "default")};
  color: ${({ $active }) => ($active ? "#fff" : "rgba(0, 0, 0, 0.25)")};
  background: var(--default-linear);
  transition: color 150ms ease-in-out;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: #D9D9D9;
    opacity: ${({ $active }) => ($active ? 0 : 1)};
    transition: opacity 150ms ease-in-out;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`
