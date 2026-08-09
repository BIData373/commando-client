import { DeadlineType } from "src/api/model"
import DeadlineTag, { DEADLINE_LABELS } from "./DeadlineTag"

interface DeadlineTypeTagProps {
	type: DeadlineType
}

export function DeadlineTypeTag({ type }: DeadlineTypeTagProps) {
	if (type === DeadlineType.DATE) {
		return null
	}

	return <DeadlineTag $type={type}>{DEADLINE_LABELS[type]}</DeadlineTag>
}
