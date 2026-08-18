import styled from "@emotion/styled"
import { CircleUser, Search } from "lucide-react"
import { useState } from "react"
import {} from "react-icons"
import { useListAssignees } from "src/api/assignee/assignee"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import AssingneeDropDown from "./AssingneeDropdown"

interface AssigneeFilterDropdownProps {
	workspaceId: number
	selectedIds: number[]
	onApply: (ids: number[]) => void
}

function AssigneeFilterDropdown({
	workspaceId,
	selectedIds,
	onApply,
}: AssigneeFilterDropdownProps) {
	const [open, setOpen] = useState(false)
	const [search, setSearch] = useState("")
	const [pendingIds, setPendingIds] = useState(selectedIds)

	const { data: assignees = [] } = useListAssignees({ workspaceId })

	const filteredAssignees = assignees.filter((assignee) =>
		search.trim() ? assignee.name.includes(search) : true,
	)

	function handleOpenChange(nextOpen: boolean) {
		setOpen(nextOpen)
		if (nextOpen) {
			setPendingIds(selectedIds)
			setSearch("")
		}
	}

	function handleToggle(id: number) {
		setPendingIds((current) =>
			current.includes(id)
				? current.filter((pendingId) => pendingId !== id)
				: [...current, id],
		)
	}

	function handleReset() {
		setPendingIds([])
	}

	function handleApply() {
		onApply(pendingIds)
		setOpen(false)
	}

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>
				<TriggerButton $active={open || selectedIds.length > 0}>
					<CircleUser size={18} />
					{selectedIds.length > 0 ? (
						<TriggerLabel>אחראי ({selectedIds.length})</TriggerLabel>
					) : (
						<TriggerLabel>סינון אחראי</TriggerLabel>
					)}
				</TriggerButton>
			</PopoverTrigger>

			<StyledPopoverContent align="start" sideOffset={4}>
				<SearchRow>
					<SearchWrapper>
						<SearchField
							placeholder="חפש אחראי"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<Search size={14} />
					</SearchWrapper>
				</SearchRow>

				<AssingneeDropDown
					filteredAssignees={filteredAssignees}
					pendingIds={pendingIds}
					handleToggle={handleToggle}
				/>
				<Footer>
					<ApplyButton onClick={handleApply}>
						החל{pendingIds.length > 0 && ` (${pendingIds.length})`}
					</ApplyButton>
					<ResetButton
						type="button"
						disabled={pendingIds.length === 0}
						onClick={handleReset}
					>
						איפוס
					</ResetButton>
				</Footer>
			</StyledPopoverContent>
		</Popover>
	)
}

export { AssigneeFilterDropdown }

// ─── Styled ─────────────────────────────────────────────────────────────────

const TriggerButton = styled.button<{ $active: boolean }>`
  direction: rtl;
  display: flex;
  padding: 0 15px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid ${({ $active }) => ($active ? "var(--active-color-button)" : "var(--card-border)")};
  background: var(--background);
  box-shadow: var(--shadow-button);
  cursor: pointer;
  white-space: nowrap;
  color: ${({ $active }) => ($active ? "var(--active-color-button)" : "var(--text-color-2)")};
  font-size: var(--fs-base);

  &:hover {
    border-color: ${({ $active }) => ($active ? "var(--active-color-button)" : "var(--button-color-hover)")};
    color: ${({ $active }) => ($active ? "var(--active-color-button)" : "var(--button-color-hover)")};
  }
`

const TriggerLabel = styled.span`
  font-size: var(--fs-base);
`

const StyledPopoverContent = styled(PopoverContent)`
  direction: rtl;
  width: 248px;
  padding: 0;
  gap: 0;
  border-radius: 6px;
  box-shadow:var(--boxShadowSecondary)
`

const SearchRow = styled.div`
  direction: rtl;
  display: flex;
  padding: 7px 8px;
  border-bottom: 1px solid var(--line);
`

const SearchWrapper = styled.div`
  direction: rtl;
  display: flex;
  flex: 1;
  align-items: center;
  height: 32px;
  padding-inline-start: 11px;
  border: 1px solid var(--card-border);
  border-radius: 6px;

  &:focus-within {
    border-color: var(--button-color-hover);
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
  text-align: right;
  direction: rtl;

  &::placeholder {
    color: var(--Text-color-text-placeholder);
  }
`

const Footer = styled.div`
  direction: ltr;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px;
  border-top: 1px solid var(--line);
`

const ApplyButton = styled.button`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 7px;
  border: none;
  border-radius: 4px;
  background: linear-gradient(165deg, var(--purple-start) 0%, var(--purple-end) 100%);
  color: var(--primary-foreground);
  font-size: var(--fs-btn);
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.9;
  }
`

const ResetButton = styled.button`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 7px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--sea-ink-soft);
  font-size: var(--fs-btn);
  cursor: pointer;

  &:disabled {
    color: var(--Text-color-text-placeholder);
    cursor: default;
  }

  &:hover:not(:disabled) {
    background: var(--link-bg-hover);
  }
`
