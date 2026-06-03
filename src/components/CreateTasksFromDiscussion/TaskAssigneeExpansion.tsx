import AssigneeExpansionPanel from "./AssigneeExpansionPanel"
import type { NewTaskRow } from "./TasksColumns"

interface TaskAssigneeExpansionProps {
	row: NewTaskRow
	onUpdateRow: (updates: Partial<NewTaskRow>) => void
	onCollapse: () => void
}

function TaskAssigneeExpansion({
	row,
	onUpdateRow,
	onCollapse,
}: TaskAssigneeExpansionProps) {
	function handleDetailChange(assigneeId: number, value: string) {
		onUpdateRow({
			assigneeDetails: {
				...row.assigneeDetails,
				[assigneeId]: value,
			},
		})
	}

	function handleRemoveAssignee(assigneeId: number) {
		const nextIds = row.assigneeIds.filter((id) => id !== assigneeId)
		const nextDetails = Object.fromEntries(
			Object.entries(row.assigneeDetails).filter(
				([id]) => Number(id) !== assigneeId,
			),
		)

		onUpdateRow({
			assigneeIds: nextIds,
			assigneeDetails: nextDetails,
		})
	}

	return (
		<AssigneeExpansionPanel
			assigneeIds={row.assigneeIds}
			directiveTitle={row.title}
			assigneeDetails={row.assigneeDetails}
			onDetailChange={handleDetailChange}
			onRemoveAssignee={handleRemoveAssignee}
			onCollapse={onCollapse}
		/>
	)
}

export default TaskAssigneeExpansion
