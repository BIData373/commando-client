import styled from '@emotion/styled'
import type { Updater } from '@tanstack/react-form';
import { UserPlus } from 'lucide-react';
import { useUsers } from "#/hooks/useUsers";
import type { IUser } from "#/types";
import { concatName } from "#/utils/userUtils";
import { SearchDropdown } from "./SearchDropdown";
import { UserItem } from "./UserDropdownItem";

interface DropdownUsersProps {
    selectedUser: IUser | null
    value: string
    onChange(updater: Updater<string>): void
    onSelect(user: IUser | null): void
    onClear(): void
    onAdd(): void
}

export function DropdownUsers({
    value,
    onChange,
    selectedUser,
    onSelect,
    onClear,
    onAdd
}: DropdownUsersProps) {

    const { data: users = [] } = useUsers()

    function userIncludes(value: string) {
        return value.trim()
            ? users.filter((u) => u.name.includes(value) || u.email.includes(value))
            : []
    }

    const filteredUsers = userIncludes(value)

    function handleUserSearch(value: string) {
        onChange(value)
        const userExist = userIncludes(value)
        if (userExist.length === 0) {
            onSelect(null)
        }
    }

    function handleUserSelect(user: IUser) {
        const userConcatName = concatName(user)
        onSelect(user)
        onChange(userConcatName)
    }

    function handleUserClear() {
        onClear()
        onChange('')
    }

    return (
        <>
            <SearchDropdown<IUser>
                items={filteredUsers}
                value={value}
                onChange={handleUserSearch}
                onSelect={handleUserSelect}
                onClear={handleUserClear}
                placeholder="חפש שם/ תפקיד/ מספר אישי"
                renderItem={(item) => <UserItem user={item} />}
            />
            {
                value.length > 0 && (
                    <AddUserButton
                        type="button"
                        $enabled={!!selectedUser}
                        disabled={!selectedUser}
                        onClick={onAdd}
                    >
                        <UserPlus size={16} />
                    </AddUserButton>
                )
            }
        </>
    )
}

const AddUserButton = styled.button<{ $enabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 32px;
  height: 32px;

  cursor: ${({ $enabled }) => ($enabled ? 'pointer' : '')};

  border-radius: 8px;
  border: 1px solid #D9D9D9;

  background: ${({ $enabled }) => ($enabled ? 'linear-gradient(135deg, #615FFF 0%, #9810FA 100%);' : 'rgba(0, 0, 0, 0.04)')};
`
