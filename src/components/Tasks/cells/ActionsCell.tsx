import { useDisclosure } from "@mantine/hooks"
import type { CellContext } from "@tanstack/react-table"
import { MoreVertical } from "lucide-react"
import type { TaskRowDto } from "src/api/model"
import { buildRowMenuActions } from "src/functions/row-actions"
import { useTaskTable } from "src/providers/TaskTableProvider"
import type { AppTableFeatures } from "src/utils/table-features"
import { RowActionsTrigger } from "../RowActionsMenu"
import { RowMenu } from "../RowMenu"

export function ActionsCell<TTask extends TaskRowDto, TValue>({
	row: { original },
}: CellContext<AppTableFeatures, TTask, TValue>) {
	const { getHandlers } = useTaskTable()
	const [open, { set }] = useDisclosure()

	const actions = buildRowMenuActions(getHandlers(), original)

	return (
		<RowMenu
			trigger={
				<RowActionsTrigger>
					<MoreVertical size={16} />
				</RowActionsTrigger>
			}
			open={open}
			onOpenChange={set}
			actions={actions}
		/>
	)
}
