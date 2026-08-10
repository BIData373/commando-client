import { DeadlineType, type SourceDto } from "src/api/model"

export function getImmediateReferenceDate(
	source: Pick<SourceDto, "date"> | null | undefined,
	createdAt: Date,
): Date {
	return source?.date ?? createdAt
}

export function getDeadlineDisplayDate(
	deadlineType: DeadlineType,
	dueDate: Date | null | undefined,
	source: Pick<SourceDto, "date"> | null | undefined,
	createdAt: Date,
): Date | null {
	return deadlineType === DeadlineType.IMMEDIATE
		? getImmediateReferenceDate(source, createdAt)
		: (dueDate ?? null)
}
