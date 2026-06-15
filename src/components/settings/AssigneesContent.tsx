import styled from "@emotion/styled"
import { useNavigate, useParams } from "@tanstack/react-router"
import { CircleQuestionMarkIcon, Plus, Search } from "lucide-react"
import { type ChangeEvent, useState } from "react"
import { useListAssignees } from "src/api/assignee/assignee"
import { useUpdateWorkspace } from "src/api/workspace/workspace"
import { AssigneeCard } from "src/components/settings/AssigneeCard"
import { PrimaryButton } from "src/components/shared/PrimaryButton"
import { Checkbox } from "src/components/ui/checkbox"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "src/components/ui/input-group"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "src/components/ui/tooltip"
import { useFuse } from "src/hooks/useFuse"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import noResultsFound from "../../assets/empty-states/no-results-found.svg"
import addPerson from "../../assets/icons/add-person.svg"
import { EmptyCardState } from "../shared/EmptyCardState"
import { Spinner } from "../ui/spinner"

export const assigneeStatusEditableId = "allow-status-update"

export function AssigneesContent() {
	const {
		workspace: { id: workspaceId, assigneeStatusEditable },
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

	const filteredAssignees = useFuse(assignees, searchQuery, {
		threshold: 0.3,
		keys: ["name", "users.upn", "users.info.name", "users.info.displayName"],
	})

	function handleCheckboxChange(checked: boolean) {
		updateSettings({
			pathParams: { id: workspaceId },
			data: { assigneeStatusEditable: checked },
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
				<CheckboxRow>
					<StyledCheckbox
						id={assigneeStatusEditableId}
						checked={assigneeStatusEditable}
						onCheckedChange={handleCheckboxChange}
					/>
					<CheckboxLabel htmlFor="allow-status-update">
						אפשר לאחראיים לעדכן סטטוס הנחיות
					</CheckboxLabel>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<QuestionIcon>
									<CircleQuestionMarkIcon size={16} />
								</QuestionIcon>
							</TooltipTrigger>
							<StyledTooltipContent>
								מאפשר לאחראים שקיבלו את ההנחיה לעדכן את הסטטוס שלה. אם האפשרות
								כבויה – עדכון הסטטוס יתאפשר רק למנהלי הלשכה.
							</StyledTooltipContent>
						</Tooltip>
					</TooltipProvider>
				</CheckboxRow>
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

const StyledCheckbox = styled(Checkbox)`
  &:not([data-state="checked"]) {
    background: var(--background);
    border-color: var(--card-border);
  }
`

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

const StyledTooltipContent = styled(TooltipContent)`
  background: var(--background);
  color: var(--text-color-2);

  svg {
    opacity: 0;
  }
`

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
  gap: 8px;
`

const CheckboxLabel = styled.label`
  font-size: var(--fs-btn);
  font-weight: 400;
  color: var(--sea-ink);
  cursor: pointer;
`

const StyledInputGroup = styled(InputGroup)`
  background: var(--background);
`

const QuestionIcon = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  color: rgba(0, 0, 0, 0.25);
  cursor: pointer;
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
