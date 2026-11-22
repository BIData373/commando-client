import styled from "@emotion/styled"
import { Search } from "lucide-react"
import { type ChangeEvent, useState } from "react"
import type { AssigneeDto } from "src/api/model"
import { AssigneeOption } from "src/components/shared/AssigneeOption"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "src/components/ui/input-group"
import { useFilteredAssignees } from "src/hooks/useFilteredAssignees"

interface AssigneeSearchListProps {
	assignees: AssigneeDto[]
	selectedIds: number[]
	onToggle(id: number): void
}

export function AssigneeSearchList({
	assignees,
	selectedIds,
	onToggle,
}: AssigneeSearchListProps) {
	const [searchQuery, setSearchQuery] = useState("")
	const filteredAssignees = useFilteredAssignees(assignees, searchQuery)

	function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
		setSearchQuery(e.target.value)
	}

	return (
		<Section>
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
						onToggle={onToggle}
					/>
				))}
			</AssigneeList>
		</Section>
	)
}

const Section = styled.div`
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
