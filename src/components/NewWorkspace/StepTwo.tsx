import styled from "@emotion/styled"
import type { MirageUserDto } from "src/api/model"
import { DropdownUsers } from "../settings/DropdownUsers"
import { TrashButton } from "../shared/TrashButton"

interface StepTwoProps {
	managers: MirageUserDto[]
	search: string
	selectedUser: MirageUserDto | null
	onSearchChange(value: string): void
	onSearchClear(): void
	onUserSelect(user: MirageUserDto | null): void
	onAdd(): void
	onRemove(upn: string): void
}

export function StepTwo({
	managers,
	search,
	selectedUser,
	onSearchChange,
	onSearchClear,
	onUserSelect,
	onAdd,
	onRemove,
}: StepTwoProps) {
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
					value={search}
					onChange={onSearchChange}
					onSelect={onUserSelect}
					onClear={onSearchClear}
					onAdd={onAdd}
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
								onClick={() => onRemove(manager.upn)}
								size={22}
							/>
						</ManagerRow>
					)
				})}
			</ManagerList>
		</Root>
	)
}

const Root = styled.div`
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
  color: var(--color-error, #ff4d4f);
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
  border-block-end: 1px solid rgba(0, 0, 0, 0.06);
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
  color: rgba(0, 0, 0, 0.65);
  flex-shrink: 0;
`
