import { DeadlineType } from '../components/shared/DeadlineTag'
import type { DirectiveStatus } from '../components/shared/StatusTag'
import type { DiscussionSource } from './Discussions'
import type { Task } from './Tasks'
import { MOCK_DISCUSSIONS } from './Discussions'
import { parseDate } from '../functions/date-utils'

export interface FormState {
  title: string
  deadlineType: DeadlineType
  dueDate: Date | null
  selectedAssignees: number[]
  assigneeDetails: Record<number, string>
  assigneeStatuses: Record<number, DirectiveStatus>
  isImportant: boolean
  source: string
  sourceDate: Date | null
  topics: string[]
  notes: string
  isDetailsExpanded: boolean
  linkedSource: DiscussionSource | null
}

export const INITIAL_FORM: FormState = {
  title: '',
  deadlineType: DeadlineType.Date,
  dueDate: null,
  selectedAssignees: [],
  assigneeDetails: {},
  assigneeStatuses: {},
  isImportant: false,
  source: '',
  sourceDate: null,
  topics: [],
  notes: '',
  isDetailsExpanded: false,
  linkedSource: null,
}

export function buildFormFromTask(task: Task): FormState {
  const selectedAssignees: number[] = []
  const assigneeDetails: Record<number, string> = {}
  const assigneeStatuses: Record<number, DirectiveStatus> = {}

  if (task.responsible) {
    selectedAssignees.push(task.responsible.id)
    assigneeStatuses[task.responsible.id] = task.status
    if (task.details) {
      assigneeDetails[task.responsible.id] = task.details
    }
  }

  for (const rd of task.relatedDirectives) {
    selectedAssignees.push(rd.user.id)
    assigneeStatuses[rd.user.id] = rd.status
  }

  const linkedSource = MOCK_DISCUSSIONS.find((d) => d.name === task.discussionName) ?? null

  let sourceDate: Date | null = null
  if (task.discussionDate) {
    try {
      const parsed = parseDate(task.discussionDate)
      if (!isNaN(parsed.getTime())) {
        sourceDate = parsed
      }
    } catch {
      sourceDate = null
    }
  }

  return {
    title: task.title,
    deadlineType: task.deadlineType,
    dueDate: task.dueDate,
    selectedAssignees,
    assigneeDetails,
    assigneeStatuses,
    isImportant: task.flagged,
    source: task.discussionName,
    sourceDate,
    topics: [...task.tags],
    notes: task.notes,
    isDetailsExpanded: false,
    linkedSource,
  }
}
