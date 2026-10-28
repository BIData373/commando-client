import styled from "@emotion/styled"
import { Plus } from "lucide-react"
import { type ReactNode, useState } from "react"
import { useListAssignees } from "src/api/assignee/assignee"
import { useListAssigneeGroups } from "src/api/assignee-group/assignee-group"
import type { AssigneeDto } from "src/api/model"
import { AssigneeDialog } from "../settings/AssigneeDialog"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { AssigneeGroupOption } from "./AssigneeGroupOption"
import { AssigneeOption } from "./AssigneeOption"

export interface AssigneePickerTriggerProps {
	search: string
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	open: boolean
}

interface AssigneePickerProps {
	workspaceId: number
	selectedAssignees: number[]
	trigger: ReactNode | ((props: AssigneePickerTriggerProps) => ReactNode)
	onToggle: (id: number) => void
	onGroupSelect?: (assigneeIds: number[]) => void
	closeOnFirstSelect?: boolean
	showGroupAvatars?: boolean
}

function AssigneePicker({
	workspaceId,
	selectedAssignees,
	trigger,
	onToggle,
	onGroupSelect,
	closeOnFirstSelect = false,
	showGroupAvatars = true,
}: AssigneePickerProps) {
	const [open, setOpen] = useState(false)
	const [search, setSearch] = useState("")
	const [dialogOpen, setDialogOpen] = useState(false)

	const { data: assignees = [] } = useListAssignees({ workspaceId })
	const { data: assigneeGroups = [] } = useListAssigneeGroups({ workspaceId })

	const filteredGroups = assigneeGroups.filter(
		(group) => group.assignees.length > 0,
	)

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

	function handleGroupSelect(assigneeIds: number[]) {
		const newIds = assigneeIds.filter((id) => !selectedAssignees.includes(id))
		if (newIds.length === 0) return
		onGroupSelect?.(newIds)

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

	function handleCreateAssignee(assignee: AssigneeDto) {
		onToggle(assignee.id)
	}

	return (
		<>
			<Popover open={open} onOpenChange={handleOpenChange}>
				<PopoverTrigger asChild>
					{typeof trigger === "function"
						? trigger({ search, onSearchChange: handleSearchChange, open })
						: trigger}
				</PopoverTrigger>

				<AssigneeDropdown
					sideOffset={4}
					onOpenAutoFocus={(e) => e.preventDefault()}
					onWheel={(e) => e.stopPropagation()}
				>
					{filteredGroups.length > 0 && (
						<>
							<SectionLabel>רשימות תפוצה</SectionLabel>
							{filteredGroups.map((group) => (
								<AssigneeGroupOption
									key={group.id}
									group={group}
									onSelect={handleGroupSelect}
									showAvatars={showGroupAvatars}
								/>
							))}
							<SectionLabel>אחראים</SectionLabel>
						</>
					)}

					{filteredAssignees.map((assignee) => (
						<AssigneeOption
							key={assignee.id}
							assignee={assignee}
							selected={assignee.selected}
							onToggle={handleAssigneeClick}
						/>
					))}

					<CreateNewButton type="button" onClick={handleCreateNew}>
						צור אחראי חדש
						<Plus size={14} />
					</CreateNewButton>
				</AssigneeDropdown>
			</Popover>

			{dialogOpen && (
				<AssigneeDialog
					workspaceId={workspaceId}
					open={dialogOpen}
					onOpenChange={setDialogOpen}
					onCreate={handleCreateAssignee}
				/>
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

const SectionLabel = styled.div`
  font-size: var(--fs-sm);
  color: var(--sea-ink-soft);
  padding: 4px 12px 0;
  line-height: 22px;
  text-align: start;
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
  color: var(--text-color);
  font-size: var(--fs-btn);
  line-height: 32px;
  white-space: nowrap;

  &:hover {
    background: var(--link-bg-hover);
  }
`
