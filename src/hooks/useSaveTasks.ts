import { startOfDay } from "date-fns"
import { DeadlineType } from "../components/shared/DeadlineTag"
import {
	type NewTaskInput,
	useTasksFilters,
} from "../providers/TasksFiltersProvider"

interface TaskInput {
	title: string
	assigneeIds: number[]
	assigneeDetails: Record<number, string>
	deadlineType: DeadlineType | null
	dueDate: Date | null
	flagged: boolean
	notes: string
	groupKey?: string
}

interface DiscussionFields {
	discussionName: string
	discussionDate: Date | null
	hasAttachment: boolean
	tags: string[]
}

export function useSaveTasks() {
	const { addTasks } = useTasksFilters()

	function saveTasks(inputs: TaskInput[], discussion: DiscussionFields) {
		const today = startOfDay(new Date())

		const newTasks: NewTaskInput[] = []

		for (const input of inputs) {
			const isOverdue =
				input.deadlineType === DeadlineType.Date && input.dueDate
					? input.dueDate < today
					: false

			const sharedFields = {
				title: input.title.trim(),
				flagged: input.flagged,
				status: "not_started" as const,
				deadlineType: input.deadlineType ?? DeadlineType.Ongoing,
				dueDate:
					input.deadlineType === DeadlineType.Immediate ? null : input.dueDate,
				isOverdue,
				discussionName: discussion.discussionName,
				discussionDate: discussion.discussionDate,
				hasAttachment: discussion.hasAttachment,
				attachmentUrl: null,
				tags: discussion.tags,
				notes: input.notes,
			}

			const groupAssignees = input.assigneeIds.flatMap((id) => {
				const user = MOCK_ASSIGNEES[id]
				return user ? [user] : []
			})

			if (groupAssignees.length === 0) {
				newTasks.push({
					...sharedFields,
					details: undefined,
					responsible: null,
					relatedDirectives: [],
				})
				continue
			}

			const groupKey =
				groupAssignees.length > 1
					? (input.groupKey ?? crypto.randomUUID())
					: undefined
			for (const responsible of groupAssignees) {
				const perAssigneeDetail =
					input.assigneeDetails[responsible.id]?.trim() || undefined
				const relatedDirectives = groupAssignees
					.filter((u) => u.id !== responsible.id)
					.map((user) => ({ user, status: "not_started" as const }))
				newTasks.push({
					...sharedFields,
					groupKey,
					details: perAssigneeDetail,
					responsible,
					relatedDirectives,
				})
			}
		}

		addTasks(newTasks)
	}

	return saveTasks
}
