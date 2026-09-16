import type { SourceDto } from "src/api/model"
import { formatDate, formatDateShort } from "./date-utils"

export function formatSourceLabel(source: SourceDto, short = true): string {
	if (!source.date) {
		return source.name
	}

	const dateString = short
		? formatDateShort(source.date)
		: formatDate(source.date)

	return [source.name, dateString].join(" | ")
}
