import styled from "@emotion/styled"
import { Check, Plus } from "lucide-react"
import { type ReactNode, useState } from "react"
import { useListAssignees } from "src/api/assignee/assignee"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { AssigneeDialog } from "../settings/AssigneeDialog"
import type { AvatarColor } from "../Tasks/ResponsibleCell"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

interface AssigneePickerProps {
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
	selectedAssignees,
	trigger,
	onToggle,
	closeOnFirstSelect = false,
}: AssigneePickerProps) {
	const [open, setOpen] = useState(false)
	const [search, setSearch] = useState("")
	const [dialogOpen, setDialogOpen] = useState(false)

	const {
		workspace: { id: workspaceId },
	} = useWorkspace()
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
								<AvatarCircle $color={assignee.color}>
									{assignee.initials}
								</AvatarCircle>

								<AssigneeOptionName $selected={assignee.selected}>
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

			<AssigneeDialog open={dialogOpen} onOpenChange={setDialogOpen} />
		</>
	)
}

export default AssigneePicker

const AssigneeDropdown = styled(PopoverContent)`
  width: var(--radix-popover-trigger-width);
  max-height: 200px;
  overflow-y: auto;
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
`

const AssigneeOptionName = styled.span<{ $selected: boolean }>`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: ${({ $selected }) => ($selected ? "var(--tab-active-color)" : "var(--text-color-2)")};
  white-space: nowrap;
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
  font-size: 14px;
  line-height: 32px;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`
// FIX Use AssigneeAvatar
const AvatarCircle = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: var(--sea-ink);
  flex-shrink: 0;
  ${({ $color }) => {
		switch ($color) {
			case "cyan":
				return "background: #87e8de;"
			case "blue":
				return "background: #91caff;"
			case "green":
				return "background: #b7eb8f;"
			case "orange":
				return "background: #ffd591;"
			case "gray":
				return "background: var(--colors-base-neutral-3);"
		}
	}}
`

const StyleCheck = styled(Check)`
  color: var(--tab-active-color);
`
