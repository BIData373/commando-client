import styled from "@emotion/styled"
import type { HeaderContext } from "@tanstack/react-table"
import type { TaskRowDto } from "src/api/model"
import type { AppTableFeatures } from "src/utils/table-features"
import { Checkbox } from "../../ui/checkbox"

export function SelectAllHeader<TTask extends TaskRowDto, TValue>({
	table,
}: HeaderContext<AppTableFeatures, TTask, TValue>) {
	function handleCheckedChange(checked: boolean | "indeterminate") {
		const rows = table.getFilteredRowModel().rows

		table.setRowSelection(
			checked === true
				? Object.fromEntries(rows.map((row) => [row.id, true]))
				: {},
		)
	}

	return (
		<CheckboxCenter>
			<Checkbox
				checked={table.getIsAllRowsSelected()}
				onCheckedChange={handleCheckedChange}
			/>
		</CheckboxCenter>
	)
}

const CheckboxCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
