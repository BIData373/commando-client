import type { Assignee } from '#/types'
import type { DirectiveStatus } from '../components/shared/StatusTag'
import type { RelatedDirective } from '../components/Tasks/ResponsibleCell'
import { MOCK_ASSIGNEES } from './Assignees'

type DeadlineType = 'date' | 'immediate' | 'ongoing'

export interface Task {
  id: number
  title: string
  details?: string
  flagged: boolean
  status: DirectiveStatus
  responsible: Assignee | null
  relatedDirectives: RelatedDirective[]
  deadlineType: DeadlineType
  dueDate: Date | null
  isOverdue: boolean
  discussionName: string
  discussionDate: string
  hasAttachment: boolean
  attachmentUrl: string | null
  tags: string[]
  notes: string
  createdAt: Date
  updatedAt: Date
}

export const INITIAL_TASKS: Task[] = [
  {
    id: 56,
    title: 'בדיקת כשירות רכבים מבצעיים',
    details: 'בדיקת רכבי פלוגה א׳',
    flagged: false,
    status: 'not_started',
    responsible: MOCK_ASSIGNEES[1],
    relatedDirectives: [
      { user: MOCK_ASSIGNEES[2], status: 'not_started' },
      { user: MOCK_ASSIGNEES[3], status: 'in_progress' },
      { user: MOCK_ASSIGNEES[4], status: 'in_progress' },
      { user: MOCK_ASSIGNEES[5], status: 'in_progress' },
    ],
    deadlineType: 'ongoing',
    dueDate: new Date('2026-12-03'),
    isOverdue: false,
    discussionName: 'ישיבת מפקדים',
    discussionDate: '15/01',
    hasAttachment: false,
    attachmentUrl: null,
    tags: ['ביטחון'],
    notes: '',
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-03-15'),
  },
  {
    id: 1,
    title: 'סיור ביטחוני - מחסום צפון',
    flagged: true,
    status: 'in_progress',
    responsible: MOCK_ASSIGNEES[2],
    relatedDirectives: [],
    deadlineType: 'date',
    dueDate: new Date('2026-03-30'),
    isOverdue: false,
    discussionName: 'ישיבת מפקדים',
    discussionDate: '10/03',
    hasAttachment: true,
    attachmentUrl: 'https://example.com/files/sior-north.pdf',
    tags: ['ביטחון', 'מבצעים', 'סיורים', 'מחסומים', 'צפון'],
    notes: 'יש לתאם עם מפקד הסיור לפני יציאה',
    createdAt: new Date('2026-03-10'),
    updatedAt: new Date('2026-03-11'),
  },
  {
    id: 8,
    title: 'הכנת ציוד לאימון שטח',
    details: 'הקצאת ערכת מגא"ס מול ענף כשירויות',
    flagged: true,
    status: 'not_started',
    responsible: MOCK_ASSIGNEES[3],
    relatedDirectives: [
      { user: MOCK_ASSIGNEES[4], status: 'not_started' },
    ],
    deadlineType: 'immediate',
    dueDate: null,
    isOverdue: false,
    discussionName: 'ישיבת פיקוד',
    discussionDate: '12/03',
    hasAttachment: false,
    attachmentUrl: null,
    tags: ['אימון'],
    notes: 'לוודא ציוד מלא',
    createdAt: new Date('2026-03-12'),
    updatedAt: new Date('2026-03-12'),
  },
  {
    id: 10,
    title: 'דוח מצב שבועי',
    flagged: false,
    status: 'completed',
    responsible: MOCK_ASSIGNEES[5],
    relatedDirectives: [],
    deadlineType: 'date',
    dueDate: new Date('2026-03-19'),
    isOverdue: true,
    discussionName: 'דיון שבועי',
    discussionDate: '14/03',
    hasAttachment: false,
    attachmentUrl: null,
    tags: ['דיווח', 'שבועי', 'מצב', 'דוח', 'דוחות'],
    notes: 'יש לכלול נתוני נוכחות ומשימות פתוחות',
    createdAt: new Date('2026-03-14'),
    updatedAt: new Date('2026-03-15'),
  },
  {
    id: 21,
    title: 'הערכות לחורף',
    flagged: false,
    status: 'in_progress',
    responsible: MOCK_ASSIGNEES[6],
    relatedDirectives: [
      { user: MOCK_ASSIGNEES[1], status: 'not_started' },
      { user: MOCK_ASSIGNEES[2], status: 'in_progress' },
      { user: MOCK_ASSIGNEES[3], status: 'not_started' },
    ],
    deadlineType: 'ongoing',
    dueDate: new Date('2026-12-01'),
    isOverdue: false,
    discussionName: 'ישיבת מפקדים',
    discussionDate: '15/02',
    hasAttachment: true,
    attachmentUrl: 'https://example.com/files/winter-prep.pdf',
    tags: ['לוגיסטיקה', 'תשתיות'],
    notes: '',
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-03-01'),
  },
  {
    id: 89,
    title: 'בדיקת ציוד - מחסן 4',
    flagged: true,
    status: 'not_started',
    responsible: null,
    relatedDirectives: [],
    deadlineType: 'date',
    dueDate: new Date('2026-03-18'),
    isOverdue: true,
    discussionName: 'בדיקה שוטפת',
    discussionDate: '15/03',
    hasAttachment: false,
    attachmentUrl: null,
    tags: ['לוגיסטיקה'],
    notes: '',
    createdAt: new Date('2026-03-15'),
    updatedAt: new Date('2026-03-15'),
  },
]
