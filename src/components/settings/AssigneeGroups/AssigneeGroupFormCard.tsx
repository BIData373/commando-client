import styled from "@emotion/styled"
import { Search } from "lucide-react"
import { type ChangeEvent, useState } from "react"
import { TbUsersGroup } from "react-icons/tb"
import { useListAssignees } from "src/api/assignee/assignee"
import {
	getListAssigneeGroupsQueryKey,
	useCreateAssigneeGroup,
	useUpdateAssigneeGroup,
} from "src/api/assignee-group/assignee-group"
import type { AssigneeGroupDto } from "src/api/model"
import { AssigneeOption } from "src/components/shared/AssigneeOption"
import InputWithCount from "src/components/shared/InputWithCount"
import { PrimaryButton } from "src/components/shared/PrimaryButton"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "src/components/ui/input-group"
import {
	createAssigneeGroupMessage,
	updateAssigneeGroupMessage,
} from "src/functions/toast-messages"
import { useFilteredAssignees } from "src/hooks/useFilteredAssignees"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { invalidateQueries } from "src/query-client"

const NAME_MAX_LENGTH = 30

interface AssigneeGroupFormCardProps {
	/** Given, the form edits this group; omitted, it creates a new one. */
	assigneeGroup?: AssigneeGroupDto
	onClose(): void
}

export function AssigneeGroupFormCard({
	assigneeGroup,
	onClose,
}: AssigneeGroupFormCardProps) {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	const [name, setName] = useState(assigneeGroup?.name ?? "")
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedIds, setSelectedIds] = useState<number[]>(
		assigneeGroup?.assignees.map(({ id }) => id) ?? [],
	)

	const { data: assignees = [] } = useListAssignees({ workspaceId })
	const filteredAssignees = useFilteredAssignees(assignees, searchQuery)

	const { mutate: createAssigneeGroup, isPending: isCreatePending } =
		useCreateAssigneeGroup({
			mutation: {
				meta: {
					toast: { success: createAssigneeGroupMessage, error: true },
				},
				onSuccess: handleSaveSuccess,
			},
		})

	const { mutate: updateAssigneeGroup, isPending: isUpdatePending } =
		useUpdateAssigneeGroup({
			mutation: {
				meta: {
					toast: { success: updateAssigneeGroupMessage, error: true },
				},
				onSuccess: handleSaveSuccess,
			},
		})

	const canSave =
		name.trim().length > 0 && (!assigneeGroup || hasChanges(assigneeGroup))

	function hasChanges({ name: initialName, assignees }: AssigneeGroupDto) {
		const initialIds = assignees.map(({ id }) => id)

		return (
			name.trim() !== initialName ||
			selectedIds.length !== initialIds.length ||
			selectedIds.some((id) => !initialIds.includes(id))
		)
	}

	function handleSaveSuccess() {
		invalidateQueries([getListAssigneeGroupsQueryKey({ workspaceId })])
		onClose()
	}

	function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
		setSearchQuery(e.target.value)
	}

	function handleToggleAssignee(id: number) {
		setSelectedIds((prev) =>
			prev.includes(id)
				? prev.filter((selectedId) => selectedId !== id)
				: [...prev, id],
		)
	}

	function handleSave() {
		const values = { name: name.trim(), assigneeIds: selectedIds }

		if (assigneeGroup) {
			updateAssigneeGroup({
				pathParams: { id: assigneeGroup.id },
				data: values,
			})
			return
		}

		createAssigneeGroup({ data: { workspaceId, ...values } })
	}

	return (
		<Card>
			<Header>
				<TbUsersGroup size={24} />
				<InputWithCount
					text={name}
					onChange={setName}
					maxLength={NAME_MAX_LENGTH}
					placeholder="שם הרשימה"
				/>
			</Header>

			<Divider />

			<AssigneesSection>
				<StyledInputGroup>
					<InputGroupAddon align="inline-start">
						<Search size={16} />
					</InputGroupAddon>
					<SearchInput
						value={searchQuery}
						onChange={handleSearchChange}
						placeholder="חפש אחראי"
					/>
				</StyledInputGroup>

				<AssigneeList>
					{filteredAssignees.map((assignee) => (
						<AssigneeOption
							key={assignee.id}
							assignee={assignee}
							selected={selectedIds.includes(assignee.id)}
							onToggle={handleToggleAssignee}
						/>
					))}
				</AssigneeList>
			</AssigneesSection>

			<Divider />

			<Footer>
				<TextButton type="button" onClick={onClose}>
					ביטול
				</TextButton>
				<PrimaryButton
					title="שמור"
					height={32}
					width={80}
					disabled={!canSave}
					loading={isCreatePending || isUpdatePending}
					onClick={handleSave}
				/>
			</Footer>
		</Card>
	)
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 12px 8px;
  background: var(--background);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: var(--card-shadow-default);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  color: var(--sea-ink);
`

const Divider = styled.div`
  height: 1px;
  background: var(--button-hover);
`

const AssigneesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const StyledInputGroup = styled(InputGroup)`
  background: var(--background);
`

const SearchInput = styled(InputGroupInput)`
  &::placeholder {
    color: var(--Text-color-text-placeholder);
  }
`

const AssigneeList = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 240px;
  overflow-y: auto;
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const TextButton = styled.button`
  height: 32px;
  padding-inline: 15px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-color-2);
  font-size: var(--fs-btn);
  line-height: 22px;
  cursor: pointer;

  &:hover {
    background: var(--button-hover);
  }
`
