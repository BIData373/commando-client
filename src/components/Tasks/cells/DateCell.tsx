import type { CellContext } from "@tanstack/react-table"
import type { TaskRowDto } from "src/api/model"
import type { AppTableFeatures } from "src/utils/table-features"
import { formatDateShort } from "../../../functions/date-utils"
import { DateText } from "../../shared/DateText"

export function DateCell<TTask extends TaskRowDto>({
	getValue,
}: CellContext<AppTableFeatures, TTask, Date | null>) {
	const date = getValue()
	return <DateText>{date && formatDateShort(date)}</DateText>
}
