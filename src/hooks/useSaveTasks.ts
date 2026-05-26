import { startOfDay } from 'date-fns'
import { useTasks, type NewTaskInput } from '../providers/TasksProvider'
import { MOCK_ASSIGNEES } from '../data/Assignees'
import { DeadlineType } from '../components/shared/DeadlineTag'
import type { DirectiveStatus } from '../components/shared/StatusTag'

interface TaskInput {
  title: string
  assigneeIds: number[]
  assigneeDetails: Record<number, string>
  deadlineType: DeadlineType | null
  dueDate: Date | null
  isImportant: boolean
  notes: string
  groupKey?: string
}

interface DiscussionFields {
  discussionName: string
  discussionDate: string
  hasAttachment: boolean
  tags: string[]
}

interface EditTaskInput extends TaskInput {
  assigneeStatuses: Record<number, DirectiveStatus>
  originalStatus: DirectiveStatus
}

function buildSharedFields(input: TaskInput, discussion: DiscussionFields) {
  const today = startOfDay(new Date())
  const isOverdue =
    input.deadlineType === DeadlineType.Date && input.dueDate ? input.dueDate < today : false

  return {
    title: input.title.trim(),
    flagged: input.isImportant,
    deadlineType: input.deadlineType ?? DeadlineType.Ongoing,
    dueDate: input.deadlineType === DeadlineType.Immediate ? null : input.dueDate,
    isOverdue,
    discussionName: discussion.discussionName,
    discussionDate: discussion.discussionDate,
    hasAttachment: discussion.hasAttachment,
    attachmentUrl: null,
    tags: discussion.tags,
    notes: input.notes,
  }
}

function resolveAssignees(assigneeIds: number[]) {
  return assigneeIds.flatMap((id) => {
    const user = MOCK_ASSIGNEES[id]
    return user ? [user] : []
  })
}

export function useSaveTasks() {
  const { addTasks, updateTask } = useTasks()

  function saveTasks(inputs: TaskInput[], discussion: DiscussionFields) {
    const newTasks: NewTaskInput[] = []

    for (const input of inputs) {
      const sharedFields = buildSharedFields(input, discussion)
      const groupAssignees = resolveAssignees(input.assigneeIds)

      if (groupAssignees.length === 0) {
        newTasks.push({ ...sharedFields, status: 'not_started', details: undefined, responsible: null, relatedDirectives: [] })
        continue
      }

      const groupKey = groupAssignees.length > 1 ? (input.groupKey ?? crypto.randomUUID()) : undefined
      for (const responsible of groupAssignees) {
        const perAssigneeDetail = input.assigneeDetails[responsible.id]?.trim() || undefined
        const relatedDirectives = groupAssignees
          .filter((u) => u.id !== responsible.id)
          .map((user) => ({ user, status: 'not_started' as const }))
        newTasks.push({ ...sharedFields, status: 'not_started', groupKey, details: perAssigneeDetail, responsible, relatedDirectives })
      }
    }

    addTasks(newTasks)
  }

  function editTask(taskId: number, input: EditTaskInput, discussion: DiscussionFields) {
    const sharedFields = buildSharedFields(input, discussion)
    const groupAssignees = resolveAssignees(input.assigneeIds)

    if (groupAssignees.length === 0) {
      updateTask(taskId, {
        ...sharedFields,
        status: input.originalStatus,
        details: undefined,
        responsible: null,
        relatedDirectives: [],
      })
      return
    }

    const [primary, ...rest] = groupAssignees
    const primaryDetail = input.assigneeDetails[primary.id]?.trim() || undefined

    updateTask(taskId, {
      ...sharedFields,
      status: input.assigneeStatuses[primary.id] ?? input.originalStatus,
      responsible: primary,
      details: primaryDetail,
      relatedDirectives: rest.map((user) => ({
        user,
        status: input.assigneeStatuses[user.id] ?? 'not_started',
      })),
    })
  }

  return { saveTasks, editTask }
}
