import styled from "@emotion/styled"
import { Check, Plus } from "lucide-react"
import { type ReactNode, useState } from "react"
import { useListAssignees } from "src/api/assignee/assignee"
import { AssigneeDialog } from "../settings/AssigneeDialog"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { AssigneeAvatar } from "./AssigneeAvatar"

interface AssigneePickerProps {
	workspaceId: number
	selectedAssignees: number[]
	trigger:
		| ReactNode
		| ((props: {
				search: string
				onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
		  }) => ReactNode)
	onToggle: (id: number) => void
	closeOnFirstSelect?: boolean
}

function AssigneePicker({
	workspaceId,
	selectedAssignees,
	trigger,
	onToggle,
	closeOnFirstSelect = false,
}: AssigneePickerProps) {
	const [open, setOpen] = useState(false)
	const [search, setSearch] = useState("")
	const [dialogOpen, setDialogOpen] = useState(false)

	const { data: assignees = [] } = useListAssignees({ workspaceId })

	const filteredAssignees = assignees
		.filter((assignee) => {
			if (!search.trim()) return true
			return assignee.name.includes(search)
		})
		.map((assignee) => ({
			...assignee,
			selected: selectedAssignees.includes(assignee.id),
		}))

	function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
		setSearch(e.target.value)
		if (!open) setOpen(true)
	}

	function handleOpenChange(nextOpen: boolean) {
		setOpen(nextOpen)
		if (!nextOpen) setSearch("")
	}

	function handleAssigneeClick(id: number) {
		onToggle(id)

		if (closeOnFirstSelect && selectedAssignees.length === 0) {
			setOpen(false)
			setSearch("")
		}
	}

	function handleCreateNew() {
		setOpen(false)
		setSearch("")
		setDialogOpen(true)
	}

	return (
		<>
			<Popover open={open} onOpenChange={handleOpenChange}>
				<PopoverTrigger asChild>
					{typeof trigger === "function"
						? trigger({ search, onSearchChange: handleSearchChange })
						: trigger}
				</PopoverTrigger>

				<AssigneeDropdown
					sideOffset={4}
					onOpenAutoFocus={(e) => e.preventDefault()}
					onWheel={(e) => e.stopPropagation()}
				>
					{filteredAssignees.map((assignee) => (
						<AssigneeOption
							key={assignee.id}
							$selected={assignee.selected}
							type="button"
							onClick={() => handleAssigneeClick(assignee.id)}
						>
							<AssigneeOptionEnd>
								<AssigneeAvatar assignee={assignee} size={22} />

								<AssigneeOptionName
									title={assignee.name}
									$selected={assignee.selected}
								>
									{assignee.name}
								</AssigneeOptionName>
							</AssigneeOptionEnd>

							{assignee.selected && <StyleCheck size={18} />}
						</AssigneeOption>
					))}

					<CreateNewButton type="button" onClick={handleCreateNew}>
						צור אחראי חדש
						<Plus size={14} />
					</CreateNewButton>
				</AssigneeDropdown>
			</Popover>

			{dialogOpen && (
				<AssigneeDialog open={dialogOpen} onOpenChange={setDialogOpen} />
			)}
		</>
	)
}

export default AssigneePicker

const AssigneeDropdown = styled(PopoverContent)`
  width: var(--radix-popover-trigger-width);
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4px;
  gap: 1.5px;
  z-index: var(--z-dropdown);
`

const AssigneeOption = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: none;
  background: ${({ $selected }) => ($selected ? "#e6f4ff" : "transparent")};
  cursor: pointer;
  border-radius: 2px;

  &:hover {
    background: ${({ $selected }) => ($selected ? "#e6f4ff" : "rgba(0, 0, 0, 0.04)")};
  }
`

const AssigneeOptionEnd = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 32px;
  width: 100%;
`

const AssigneeOptionName = styled.span<{ $selected: boolean }>`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: ${({ $selected }) => ($selected ? "var(--tab-active-color)" : "var(--text-color-2)")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CreateNewButton = styled.button`
  direction: ltr;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
  padding: 0 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  color: rgba(0, 0, 0, 0.65);
  font-size: var(--fs-btn);
  line-height: 32px;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`

const StyleCheck = styled(Check)`
  color: var(--tab-active-color);
`
