import styled from "@emotion/styled"
import type { CellContext } from "@tanstack/react-table"
import type { TaskRowDto } from "src/api/model"
import type { AppTableFeatures } from "src/consts/table-features"
import { formatDateShort } from "../../../functions/date-utils"
import { DateText } from "../../shared/DateText"

export function DateCell<TTask extends TaskRowDto>({
	getValue,
}: CellContext<AppTableFeatures, TTask, Date>) {
	const date = getValue()

	return <StickyDateText>{date && formatDateShort(date)}</StickyDateText>
}

const StickyDateText = styled(DateText)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: var(--table-row-height, 100%);
  position: sticky;
  top: var(--table-header-height, 0px);
`
