import styled from "@emotion/styled"
import { UserPlus } from "lucide-react"
import { useMemo, useState } from "react"
import { type PermissionDto, PermissionType, type UserDto } from "src/api/model"
import {
	useDeletePermission,
	useListPermissions,
	useUpdatePermission,
} from "src/api/permission/permission"
import { DropdownPermission } from "src/components/settings/DropdownPermission"
import { DropdownUsers } from "src/components/settings/DropdownUsers"
import { UserPermissionList } from "src/components/settings/UserPermissionList"
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "src/components/ui/tabs"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { queryClient } from "src/queryClient"
import { concatName } from "src/utils/user-utils"

enum PermissionsTab {
	ALL = "all",
	MANAGERS = "managers",
	VIEWERS = "viewers",
}

const PermissionTabNames: Record<PermissionsTab, string> = {
	[PermissionsTab.ALL]: "כולם",
	[PermissionsTab.MANAGERS]: "מנהלים",
	[PermissionsTab.VIEWERS]: "צופים",
}

export function PermissionsContent() {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	const [search, setSearch] = useState("")
	const [activeTab, setActiveTab] = useState(PermissionsTab.ALL)
	const [selectedUser, setSelectedUser] = useState<UserDto | null>(null)
	const [type, setType] = useState<PermissionType>(PermissionType.VIEWER)

	const { data: permissions = [], queryKey } = useListPermissions({
		workspaceId,
	})
	const { mutate: updatePermission } = useUpdatePermission()
	const { mutate: deletePermission } = useDeletePermission()

	const currentTabUsers = useMemo(() => {
		const taggedType =
			activeTab === PermissionsTab.MANAGERS
				? PermissionType.MANAGER
				: PermissionType.VIEWER

		return activeTab === PermissionsTab.ALL
			? permissions
			: permissions.filter((user) => user.type === taggedType)
	}, [activeTab, permissions])

	function handleSuccess(
		data: PermissionDto,
		mutate: (arr: PermissionDto[], index: number) => void,
	) {
		queryClient.setQueryData(queryKey, (prev) => {
			if (!prev) {
				return
			}

			const updated = [...prev]
			const index = updated.findIndex(({ user: { id } }) => id === data.user.id)

			mutate(updated, index)

			return updated
		})
	}

	function handleSuccessUpsert(data: PermissionDto) {
		handleSuccess(data, (arr, index) =>
			arr.splice(index === -1 ? arr.length : index, index === -1 ? 0 : 1, data),
		)
	}

	function handleUserAdd(type: PermissionType) {
		if (!selectedUser) {
			return
		}

		updatePermission(
			{
				data: { workspaceId, upn: selectedUser.upn, type },
			},
			{
				onSuccess: handleSuccessUpsert,
			},
		)

		setSearch("")
		setSelectedUser(null)
	}

	function handleDeletePermissionUser({ id }: UserDto) {
		deletePermission(
			{
				params: { userId: id, workspaceId },
			},
			{
				onSuccess: (data) =>
					handleSuccess(data, (arr, index) =>
						index >= 0 ? arr.splice(index, 1) : arr,
					),
			},
		)
	}

	function handleTypeChangePermissionUser(
		{ upn }: UserDto,
		type: PermissionType,
	) {
		updatePermission(
			{
				data: { upn, workspaceId, type },
			},
			{
				onSuccess: handleSuccessUpsert,
			},
		)
	}

	function handleTabChange(value: string) {
		setActiveTab(value as PermissionsTab)
	}

	function handleSearchChange(v: string) {
		setSearch(v)
		if (!v) setSelectedUser(null)
	}

	function handleSearchSelect(user: UserDto | null) {
		setSelectedUser(user)
		if (user) {
			setSearch(concatName(user))
		}
	}

	function handleSearchClear() {
		setSearch("")
		setSelectedUser(null)
	}

	return (
		<PermissionsInner>
			<Subtitle>
				מנהל סביבה יוצר הנחיות, מגדיר אחראיים ומבצע בקרה ומעקב אחר סטטוס ההנחיות
				בסביבה
			</Subtitle>

			<SearchSection>
				<DropdownUsers
					value={search}
					onChange={handleSearchChange}
					onSelect={handleSearchSelect}
					onClear={handleSearchClear}
					placeholder="חפש שם/ תפקיד/ מספר אישי"
				/>

				<AddUserRow>
					{search.length > 0 && (
						<DropdownPermission
							ghost
							value={type}
							onChange={setType}
							disabled={!selectedUser}
						/>
					)}

					{selectedUser && (
						<AddAvatarButton onClick={() => handleUserAdd(type)}>
							<UserPlus size={16} />
						</AddAvatarButton>
					)}
				</AddUserRow>
			</SearchSection>

			<StyledTabs value={activeTab} onValueChange={handleTabChange}>
				<StyledTabsList variant="line">
					{Object.entries(PermissionTabNames).map(([key, value]) => (
						<StyledTabsTrigger key={key} value={key}>
							{value}
						</StyledTabsTrigger>
					))}
				</StyledTabsList>

				{Object.values(PermissionsTab).map((tab) => (
					<StyledTabsContent key={tab} value={tab}>
						<UserListScrollArea>
							<UserListInner>
								<UserPermissionList
									permissions={currentTabUsers}
									onDelete={handleDeletePermissionUser}
									onTypeChange={handleTypeChangePermissionUser}
								/>
							</UserListInner>
						</UserListScrollArea>
					</StyledTabsContent>
				))}
			</StyledTabs>
		</PermissionsInner>
	)
}

const PermissionsInner = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 550px;
  padding: 0 12px;
`

const AddUserRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;
`

const AddAvatarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: var(--color-primary-foreground);
  cursor: pointer;
  background: var(--default-linear);
`

const StyledTabs = styled(Tabs)`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`

const UserListScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  direction: ltr;
  padding-inline-end: 8px;
  scrollbar-gutter: stable;
`

const UserListInner = styled.div`
  direction: rtl;
`

const Subtitle = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: var(--text-subtitle-color);
  margin: 0;
`

const StyledTabsList = styled(TabsList)`
  align-self: flex-end;
  direction: rtl;
  border-bottom: 1px solid var(--line);
  gap: 24px;
  `

const StyledTabsContent = styled(TabsContent)`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  `

const StyledTabsTrigger = styled(TabsTrigger)`
  color: var(--text-color-2);
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;

  &[data-state="active"] {
    color: var(--active-color);
  }

  &[data-state="active"]::after {
    background-color: var(--active-color);
  }
`

const SearchSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`
