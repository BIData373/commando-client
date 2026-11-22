import { isValid } from "date-fns"
import { type WorkspaceStatusDto, WorkspaceStatusType } from "src/api/model"
import { formatDateShort } from "./date-utils"

type StatusWithTimes = Pick<
	WorkspaceStatusDto,
	"type" | "createdAt" | "updatedAt"
>

function formatStatusDate(date: Date | undefined): string | undefined {
	if (!date) return undefined
	const parsed = new Date(date)
	return isValid(parsed) ? formatDateShort(parsed) : undefined
}

export function getStatusTimeLabel(
	status: StatusWithTimes,
): string | undefined {
	switch (status.type) {
		case WorkspaceStatusType.IN_PROGRESS: {
			const date = formatStatusDate(status.updatedAt)
			return date && `החל עבודה ב: ${date}`
		}
		case WorkspaceStatusType.COMPLETED: {
			const date = formatStatusDate(status.updatedAt)
			return date && `בוצע ב: ${date}`
		}
		default:
			return undefined
	}
}
