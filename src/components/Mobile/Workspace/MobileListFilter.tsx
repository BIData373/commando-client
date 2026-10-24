import styled from "@emotion/styled"
import type { Column } from "@tanstack/react-table"
import { useState } from "react"
import type { AssigneeDto, TaskRowDto } from "src/api/model"
import { AssigneeAvatar } from "src/components/shared/AssigneeAvatar"
import SearchInput from "src/components/shared/SearchInput"
import { Checkbox } from "src/components/ui/checkbox"
import type { FilterOption } from "src/functions/filter-utils"
import type { AppTableFeatures } from "src/utils/table-features"

interface MobileListFilterProps {
	column?: Column<AppTableFeatures, TaskRowDto, unknown>
	options: FilterOption[]
	selected: string[]
	onToggle: (value: string) => void
	placeholder: string
	assignees?: AssigneeDto[]
}

export default function MobileListFilter({
	column,
	options,
	selected,
	onToggle,
	placeholder,
	assignees,
}: MobileListFilterProps) {
	const [search, setSearch] = useState("")

	const availableValues = column?.getFacetedUniqueValues()

	const availableOptions = availableValues
		? options.filter(({ value }) => availableValues.has(value))
		: options

	const filtered = search
		? availableOptions.filter((o) =>
				o.label.toLowerCase().includes(search.toLowerCase()),
			)
		: availableOptions

	function findAssignee(name: string): AssigneeDto | undefined {
		return assignees?.find((a) => a.name === name)
	}

	function handleStopPropagation(e: React.MouseEvent) {
		e.stopPropagation()
	}

	return (
		<Wrapper>
			<SearchInputWrapper>
				<SearchInput
					value={search}
					onChange={setSearch}
					placeholder={placeholder}
				/>
			</SearchInputWrapper>

			<List>
				{filtered.map((option) => (
					<ListItem key={option.value} onClick={() => onToggle(option.value)}>
						<Item>
							<StyledCheckbox
								checked={selected.includes(option.value)}
								onClick={handleStopPropagation}
								onCheckedChange={() => onToggle(option.value)}
							/>
							{assignees && findAssignee(option.label) && (
								<AssigneeAvatar
									assignee={findAssignee(option.label) as AssigneeDto}
									size={24}
								/>
							)}
							<ItemLabel>{option.label}</ItemLabel>
						</Item>
					</ListItem>
				))}
			</List>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	border-radius: 6px;
`

const SearchInputWrapper = styled.div`
	padding: 12px 0;
	align-self: stretch;
	border-bottom: 1px solid var(--button-hover);
`

const List = styled.div`
	display: flex;
	padding: 4px 8px;
	flex-direction: column;
	align-items: flex-end;
	align-self: stretch;
	overflow: hidden;
`

const ListItem = styled.div`
	display: flex;
	padding: 12px 16px;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	gap: 10px;
	align-self: stretch;
`

const Item = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	gap: 10px;
`

const ItemLabel = styled.span`
	flex: 1;
	font-size: var(--fs-base);
	color: var(--sea-ink);
	text-align: start;
`

const StyledCheckbox = styled(Checkbox)`
	width: 20px;
	height: 20px;
	flex-shrink: 0;
`
