import styled from "@emotion/styled"
import { Search, X } from "lucide-react"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"

function TaskSearchInput() {
	const { searchQuery, setSearchQuery } = useTasksFilters()

	return (
		<SearchInputWrapper>
			<SearchField
				placeholder="חפש הנחיה"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>

			<SearchIconBox>
				{searchQuery ? (
					<ClearIcon size={14} onClick={() => setSearchQuery("")} />
				) : (
					<SearchIcon size={16} />
				)}
			</SearchIconBox>
		</SearchInputWrapper>
	)
}

export { TaskSearchInput }

const SearchInputWrapper = styled.div`
  direction: rtl;
  display: flex;
  align-items: center;
  height: 40px;
  width: 222px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: white;
  overflow: hidden;
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);

  &:focus-within {
	border-color: rgba(9, 88, 217, 0.6);
  }
`

const SearchIconBox = styled.div`
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
`

const SearchIcon = styled(Search)`
  color: rgba(0, 0, 0, 0.25);
  animation: scale-in 0.15s ease;
`

const ClearIcon = styled(X)`
  color: white;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  padding: 2px;
  animation: scale-in 0.15s ease;

  &:hover {
	background: rgba(0, 0, 0, 0.35);
  }
`

const SearchField = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  padding: 0 11px 0 0;
  text-align: right;
  direction: rtl;

  &::placeholder {
	color: var(--Text-color-text-placeholder);
  }
`
