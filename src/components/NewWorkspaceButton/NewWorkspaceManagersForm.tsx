import styled from "@emotion/styled"
import { useState } from "react"
import type { MirageUserDto } from "src/api/model"
import { concatName } from "src/utils/user-utils"
import { DropdownUsers } from "../settings/DropdownUsers"
import { TrashButton } from "../shared/TrashButton"

interface NewWorkspaceManagersFormProps {
	initialManagers: MirageUserDto[]
	onSubmit(managers: MirageUserDto[]): void
}

export function NewWorkspaceManagersForm({
	initialManagers,
	onSubmit,
}: NewWorkspaceManagersFormProps) {
	const [managers, setManagers] = useState(initialManagers)
	const [managerSearch, setManagerSearch] = useState("")
	const [selectedUser, setSelectedUser] = useState<MirageUserDto | null>(null)

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		onSubmit(managers)
	}

	function handleSearchChange(value: string) {
		setManagerSearch(value)
	}

	function handleSearchClear() {
		setManagerSearch("")
		setSelectedUser(null)
	}

	function handleUserSelect(user: MirageUserDto | null) {
		setSelectedUser(user)
		if (user) setManagerSearch(concatName(user))
	}

	function handleAdd() {
		if (!selectedUser) return
		if (managers.some((m) => m.upn === selectedUser.upn)) return
		setManagers((prev) => [...prev, selectedUser])
		setManagerSearch("")
		setSelectedUser(null)
	}

	function handleRemove(upn: string) {
		setManagers((prev) => prev.filter((m) => m.upn !== upn))
	}

	return (
		<Root id="step-two-form" onSubmit={handleSubmit}>
			<Section>
				<LabelRow>
					<Required>*</Required>
					<SectionLabel>הגדירו את מנהלי הסביבה</SectionLabel>
				</LabelRow>
				<Description>
					מנהל סביבה יוצר הנחיות, מגדיר אחראיים ומבצע בקרה ומעקב אחר סטטוס
					ההנחיות בסביבה
				</Description>
				<DropdownUsers
					value={managerSearch}
					onChange={handleSearchChange}
					onSelect={handleUserSelect}
					onClear={handleSearchClear}
					onAdd={handleAdd}
					selectedUser={selectedUser}
					showAddButton
					placeholder="חפש שם/ תפקיד/ מספר אישי"
				/>
			</Section>

			<ManagerList>
				{managers.map((manager, index) => {
					const isCreator = index === 0
					return (
						<ManagerRow key={manager.upn}>
							<ManagerInfo>
								<ManagerHeader>
									<ManagerName>{manager.info?.name}</ManagerName>
									<ManagerUpn> - {manager.upn}</ManagerUpn>
								</ManagerHeader>
								<ManagerSubtext>{manager.info?.displayName}</ManagerSubtext>
							</ManagerInfo>
							<RoleLabel>ניהול</RoleLabel>
							<TrashButton
								visible={!isCreator}
								onClick={() => handleRemove(manager.upn)}
								size={22}
							/>
						</ManagerRow>
					)
				})}
			</ManagerList>
		</Root>
	)
}

const Root = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  min-height: 0;
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-direction: row-reverse;
  justify-content: flex-end;
`

const Required = styled.span`
  color: var(--Error-color-error);
  font-size: var(--fs-base);
`

const SectionLabel = styled.span`
  font-size: var(--fs-base);
  font-weight: 600;
  color: var(--sea-ink);
`

const Description = styled.p`
  font-size: var(--fs-btn);
  color: var(--sea-ink-soft);
  margin: 0;
  line-height: 1.5;
`

const ManagerList = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  gap: 4px;
`

const ManagerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-block-end: 1px solid var(--button-hover);
`

const ManagerInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

const ManagerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const ManagerName = styled.span`
  font-size: var(--fs-base);
  font-weight: 500;
  color: var(--sea-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ManagerUpn = styled.span`
  font-size: var(--fs-base);
  font-weight: 400;
  color: var(--sea-ink);
  white-space: nowrap;
`

const ManagerSubtext = styled.span`
  font-size: var(--fs-sm);
  color: var(--sea-ink-soft);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const RoleLabel = styled.span`
  font-size: var(--fs-base);
  color: var(--text-color);
  flex-shrink: 0;
`
