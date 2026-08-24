import styled from "@emotion/styled"
import { useState } from "react"
import type { MirageUserDto } from "src/api/model"
import { concatName } from "src/utils/user-utils"
import { DropdownUsers } from "../settings/DropdownUsers"
import { UserPermissionList } from "../settings/UserPermissionList"
import { StepFooter } from "./StepFooter"

interface NewWorkspaceManagersFormProps {
	initialManagers: MirageUserDto[]
	onBack(): void
	onSubmit(managers: MirageUserDto[]): void
	onManagersChange(managers: MirageUserDto[]): void
}

export function NewWorkspaceManagersForm({
	initialManagers,
	onBack,
	onSubmit,
	onManagersChange,
}: NewWorkspaceManagersFormProps) {
	const [managers, setManagers] = useState(initialManagers)
	const [managerSearch, setManagerSearch] = useState("")
	const [selectedUser, setSelectedUser] = useState<MirageUserDto | null>(null)

	function handleSubmitClick() {
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
		const updated = [...managers, selectedUser]
		setManagers(updated)
		onManagersChange(updated)
		setManagerSearch("")
		setSelectedUser(null)
	}

	function handleRemove(upn: string) {
		const updated = managers.filter((m) => m.upn !== upn)
		setManagers(updated)
		onManagersChange(updated)
	}

	return (
		<Root>
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

			<ManagerListContainer>
				<UserPermissionList<MirageUserDto>
					items={managers}
					getUser={(m) => m}
					onDelete={(m) => handleRemove(m.upn)}
					canDelete={(_, index) => index !== 0}
				/>
			</ManagerListContainer>

			<StepFooter
				primaryLabel="שלח בקשה"
				onPrimary={handleSubmitClick}
				secondaryLabel="חזור"
				onSecondary={onBack}
				footnote="*ניתן לשנות או לעדכן את מנהלי הסביבה בכל עת דרך הגדרות הסביבה"
			/>
		</Root>
	)
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  min-height: 0;
  min-width: 0;
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

const ManagerListContainer = styled.div`
  flex: 1;
  max-width: 420px;
  min-height: 0;
  overflow: hidden;
`
