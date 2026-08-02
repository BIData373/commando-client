import styled from "@emotion/styled"
import { useEffect, useMemo, useState } from "react"
import { type MirageUserDto, PermissionType, type UserDto } from "src/api/model"
import {
	getListPermissionsQueryKey,
	useDeletePermission,
	useListPermissions,
	useUpsertPermission,
} from "src/api/permission/permission"
import {
	getGetPermittedWorkspacesQueryKey,
	getListWorkspacesQueryKey,
} from "src/api/workspace/workspace"
import { DropdownPermission } from "src/components/settings/DropdownPermission"
import { DropdownUsers } from "src/components/settings/DropdownUsers"
import { UserPermissionList } from "src/components/settings/UserPermissionList"
import { Spinner } from "src/components/ui/spinner"
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "src/components/ui/tabs"
import { useCurrentUser } from "src/hooks/useCurrentUser"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { invalidateQueries } from "src/queryClient"
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

	const currentUser = useCurrentUser()

	const [search, setSearch] = useState("")
	const [activeTab, setActiveTab] = useState(PermissionsTab.ALL)
	const [selectedUser, setSelectedUser] = useState<MirageUserDto | null>(null)
	const [type, setType] = useState<PermissionType>(PermissionType.VIEWER)

	function handleSuccess() {
		invalidateQueries([
			getListPermissionsQueryKey({ workspaceId }),
			getGetPermittedWorkspacesQueryKey(),
			getListWorkspacesQueryKey(),
		])
	}

	const { data: permissions = [], isLoading } = useListPermissions({
		workspaceId,
	})

	const { mutate: upsertPermission } = useUpsertPermission({
		mutation: {
			onSuccess: handleSuccess,
		},
	})

	const { mutate: deletePermission } = useDeletePermission({
		mutation: {
			onSuccess: handleSuccess,
		},
	})

	const userPermissionExist = useMemo(
		() => permissions.find(({ user }) => user.upn === selectedUser?.upn),
		[selectedUser, permissions],
	)

	useEffect(() => {
		if (userPermissionExist) {
			setType(userPermissionExist.type)
		}
	}, [userPermissionExist])

	const currentTabUsers = useMemo(() => {
		const taggedType =
			activeTab === PermissionsTab.MANAGERS
				? PermissionType.MANAGER
				: PermissionType.VIEWER

		return activeTab === PermissionsTab.ALL
			? permissions
			: permissions.filter((user) => user.type === taggedType)
	}, [activeTab, permissions])

	const isSelectedUserMe =
		selectedUser?.upn === currentUser.upn && !currentUser?.info?.isBI

	function clearSearch() {
		setSearch("")
		setSelectedUser(null)
	}

	function handleUserAdd(type: PermissionType) {
		if (!selectedUser) {
			return
		}

		upsertPermission({
			data: { ...selectedUser, workspaceId, type },
		})

		clearSearch()
	}

	function handleDeletePermissionUser({ id }: UserDto) {
		deletePermission(
			{
				params: { userId: id, workspaceId },
			},
			{
				onSuccess: handleSuccess,
			},
		)
	}

	function handleTypeChangePermissionUser(
		{ id, ...dto }: UserDto,
		type: PermissionType,
	) {
		upsertPermission({
			data: { ...dto, workspaceId, type },
		})

		clearSearch()
	}

	function handleTabChange(value: string) {
		setActiveTab(value as PermissionsTab)
	}

	function handleSearchChange(v: string) {
		setSearch(v)
		if (!v) setSelectedUser(null)
	}

	function handleSearchSelect(user: MirageUserDto | null) {
		setSelectedUser(user)
		if (user) {
			setSearch(concatName(user))
		}
	}

	function handleSearchClear() {
		setSearch("")
		setSelectedUser(null)
	}

	function handleUserUpdate() {
		if (!userPermissionExist) return

		handleTypeChangePermissionUser(userPermissionExist?.user, type)
	}

	return (
		<PermissionsInner>
			<Subtitle>
				מנהל סביבה יוצר הנחיות, מגדיר אחראים ומבצע בקרה ומעקב אחר סטטוס ההנחיות
				בסביבה
			</Subtitle>

			<SearchSection>
				<DropdownUsers
					value={search}
					onChange={handleSearchChange}
					onSelect={handleSearchSelect}
					onClear={handleSearchClear}
					onAdd={() => handleUserAdd(type)}
					selectedUser={selectedUser}
					placeholder="חפש שם/ תפקיד/ מספר אישי"
					showAddButton={
						!userPermissionExist && !!selectedUser && !isSelectedUserMe
					}
				>
					{search.length > 0 && (
						<AddUserRow>
							<DropdownPermission
								ghost={!selectedUser}
								value={type}
								onChange={setType}
								disabled={!selectedUser || isSelectedUserMe}
							/>
							{userPermissionExist && !isSelectedUserMe && (
								<UpdateButton
									disabled={userPermissionExist?.type === type}
									onClick={handleUserUpdate}
								>
									עדכון
								</UpdateButton>
							)}
						</AddUserRow>
					)}
				</DropdownUsers>
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
						{isLoading ? (
							<LoadingContainer>
								<Spinner />
							</LoadingContainer>
						) : (
							<UserListScrollArea>
								<UserListInner>
									<UserPermissionList
										permissions={currentTabUsers}
										onDelete={handleDeletePermissionUser}
										onTypeChange={handleTypeChangePermissionUser}
									/>
								</UserListInner>
							</UserListScrollArea>
						)}
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
  font-size: var(--fs-btn);
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
  font-size: var(--fs-btn);
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

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
`

const UpdateButton = styled.button<{ disabled: boolean }>`
  	font-size: var(--fs-base);
  	font-weight: 400;
    padding: 3px 16px;
	color: ${({ disabled }) => (disabled ? "rgba(0, 0, 0, 0.25);" : "rgba(0, 0, 0, 0.65);")};
	cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
	border-radius: 6px;
    border: 1px solid var(--card-border);
    background: rgba(0, 0, 0, 0.04);
`
