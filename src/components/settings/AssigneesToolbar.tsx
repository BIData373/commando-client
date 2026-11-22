import styled from "@emotion/styled"
import { Plus, Search } from "lucide-react"
import type { ChangeEvent } from "react"
import { PrimaryButton } from "../shared/PrimaryButton"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"

interface AssigneesToolbarProps {
	searchQuery: string
	onSearchChange(searchQuery: string): void
	onCreate(): void
}

export function AssigneesToolbar({
	searchQuery,
	onSearchChange,
	onCreate,
}: AssigneesToolbarProps) {
	function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
		onSearchChange(e.target.value)
	}

	return (
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
				onClick={onCreate}
				height={32}
				title={
					<>
						צור אחראי <Plus size={16} />
					</>
				}
			/>
		</ToolbarRow>
	)
}

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  padding-bottom: 12px;
  margin-right: 12px;
  gap: 12px;
`

const SearchWrapper = styled.div`
  max-width: 300px;
  flex: 1;
`

const StyledInputGroup = styled(InputGroup)`
  background: var(--background);
`
