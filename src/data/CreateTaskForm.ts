import type { DeadlineType } from '../components/shared/DeadlineTag'
import type { DiscussionSource } from './Discussions'

export interface FormState {
  title: string
  deadlineType: DeadlineType
  dueDate: Date | null
  selectedAssignees: number[]
  assigneeDetails: Record<number, string>
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
  deadlineType: 'date',
  dueDate: null,
  selectedAssignees: [],
  assigneeDetails: {},
  isImportant: false,
  source: '',
  sourceDate: null,
  topics: [],
  notes: '',
  isDetailsExpanded: false,
  linkedSource: null,
}
