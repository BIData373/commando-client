import styled from "@emotion/styled"
import type { CellContext } from "@tanstack/react-table"
import type { TaskRowDto } from "src/api/model"
import type { AppTableFeatures } from "src/consts/table-features"
import { Checkbox } from "../../ui/checkbox"

export function SelectCell<TTask extends TaskRowDto, TValue>({
	row,
}: CellContext<AppTableFeatures, TTask, TValue>) {
	function handleCheckedChange(checked: boolean | "indeterminate") {
		row.toggleSelected(checked === true)
	}

	return (
		<CheckboxCenter>
			<Checkbox
				checked={row.getIsSelected()}
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
