import styled from "@emotion/styled"
import { useNavigate, useParams } from "@tanstack/react-router"
import { Mail, Pencil, Plus, Search } from "lucide-react"
import { type ChangeEvent, useState } from "react"
import { useListAssignees } from "src/api/assignee/assignee"
import { useUpdateWorkspace } from "src/api/workspace/workspace"
import { AssigneeCard } from "src/components/settings/AssigneeCard"
import { PrimaryButton } from "src/components/shared/PrimaryButton"
import { SettingToggleRow } from "src/components/shared/SettingToggleRow"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "src/components/ui/input-group"
import { useFuse } from "src/hooks/useFuse"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import noResultsFound from "../../assets/empty-states/no-results-found.svg"
import addPerson from "../../assets/icons/add-person.svg"
import chatIcon from "../../assets/icons/chat.svg"
import { EmptyCardState } from "../shared/EmptyCardState"
import { Spinner } from "../ui/spinner"

const fuseOptions = {
	threshold: 0.3,
	keys: ["name", "users.upn", "users.info.name", "users.info.displayName"],
}

export const assigneeStatusEditableId = "allow-status-update"

export function AssigneesContent() {
	const {
		workspace: {
			id: workspaceId,
			assigneeStatusEditable,
			chatNotification,
			mailNotification,
		},
		setWorkspace,
	} = useWorkspace()

	const { mutateAsync: updateSettings } = useUpdateWorkspace({
		mutation: {
			onSuccess(data) {
				setWorkspace(data)
			},
		},
	})

	const { urlName } = useParams({ strict: false })
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery] = useState("")

	const { data: assignees = [], isLoading } = useListAssignees({ workspaceId })

	const filteredAssignees = useFuse(assignees, searchQuery, fuseOptions)

	function handleStatusEditableChange(checked: boolean) {
		updateSettings({
			pathParams: { id: workspaceId },
			data: { assigneeStatusEditable: checked },
		})
	}

	function handleChatNotificationsChange(checked: boolean) {
		updateSettings({
			pathParams: { id: workspaceId },
			data: { chatNotification: checked },
		})
	}

	function handleMailNotificationsChange(checked: boolean) {
		updateSettings({
			pathParams: { id: workspaceId },
			data: { mailNotification: checked },
		})
	}

	function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
		setSearchQuery(e.target.value)
	}

	function handleOpenCreateDialog() {
		navigate({
			to: "/workspace/$urlName/settings/assignees/new",
			params: { urlName: urlName! },
		})
	}

	return (
		<ContentRoot>
			<StyledContent>
				<SettingsSection>
					<SettingToggleRow
						label="אפשר לאחראים לעדכן סטטוס"
						tooltip="מאפשר לאחראים שקיבלו את ההנחיה לעדכן את הסטטוס שלה. אם האפשרות כבויה – עדכון הסטטוס יתאפשר רק למנהלי הלשכה."
						icon={<Pencil size={18} />}
						checked={assigneeStatusEditable}
						onCheckedChange={handleStatusEditableChange}
					/>

					<Divider />

					<SettingToggleRow
						label="שלח התראות בצ'אט למכותבים"
						tooltip="שליחת התראות בצ'אט למכותבים בעת עדכון הנחיות"
						icon={<img src={chatIcon} alt="" width={18} height={18} />}
						checked={chatNotification}
						onCheckedChange={handleChatNotificationsChange}
					/>

					<SettingToggleRow
						label="שלח התראות במייל למכותבים"
						tooltip="שליחת התראות במייל למכותבים בעת עדכון הנחיות"
						icon={<Mail size={18} />}
						checked={mailNotification}
						onCheckedChange={handleMailNotificationsChange}
					/>
				</SettingsSection>
				<ToolbarRow>
					<SearchWrapper>
						<StyledInputGroup>
							<InputGroupAddon align="inline-start">
								<Search size={16} />
							</InputGroupAddon>
							<InputGroupInput
								value={searchQuery}
								onChange={handleSearchChange}
								placeholder="חפש קבוצת אחראים"
							/>
						</StyledInputGroup>
					</SearchWrapper>
					<PrimaryButton
						onClick={handleOpenCreateDialog}
						height={32}
						title={
							<>
								צור אחראי <Plus size={16} />
							</>
						}
					/>
				</ToolbarRow>
			</StyledContent>

			<CardScroller>
				{isLoading ? (
					<LoadingContainer>
						<Spinner />
					</LoadingContainer>
				) : assignees.length === 0 ? (
					<CenterContainer>
						<EmptyCardState
							imgSrc={addPerson}
							title="טרם הוגדרו אחראים"
							description="לא נמצאו אחראים כדי להציג נתונים"
						/>
					</CenterContainer>
				) : filteredAssignees.length === 0 ? (
					<CenterContainer>
						<EmptyCardState
							imgSrc={noResultsFound}
							title="לא נמצאו אחראים"
							description={`לא נמצאו אחראים התואמים ל-"${searchQuery}"`}
						/>
					</CenterContainer>
				) : (
					<AssigneeCardGrid>
						{filteredAssignees.map((assignee) => (
							<AssigneeCard key={assignee.id} assignee={assignee} />
						))}
					</AssigneeCardGrid>
				)}
			</CardScroller>
		</ContentRoot>
	)
}

const SearchWrapper = styled.div`
  max-width: 300px;
  flex: 1;
`

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  padding-bottom: 12px;
  margin-right: 12px;
  gap: 12px;
`

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`

const SettingsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 360px;
  gap: 8px;
  padding: 8px;
  background: var(--background);
  border-radius: 8px;
`

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: var(--button-hover);
`

const StyledInputGroup = styled(InputGroup)`
  background: var(--background);
`

const ContentRoot = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`

const CardScroller = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: none;
  direction: ltr;
`

const AssigneeCardGrid = styled.div`
  padding: 20px 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  direction: rtl;
`

const CenterContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
`
