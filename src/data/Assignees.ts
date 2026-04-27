import type { Assignee } from '../components/Tasks/ResponsibleCell'

export const MOCK_ASSIGNEES: Record<number, Assignee> = {
  1: { id: 1, initials: 'מג', colorToken: 'cyan', name: 'יוסי לוי', role: 'מג"ד 373', email: 'yosi.levi@idf.il' },
  2: { id: 2, initials: 'דל', colorToken: 'blue', name: 'דן לבנה', role: 'סא"ל 142', email: 'dan.levana@idf.il' },
  3: { id: 3, initials: 'אב', colorToken: 'orange', name: 'אבי בכר', role: 'מ"מ 3', email: 'avi.bachar@idf.il' },
  4: { id: 4, initials: 'רי', colorToken: 'green', name: 'רון ישראלי', role: 'מ"מ 7', email: 'ron.israeli@idf.il' },
  5: { id: 5, initials: 'שמ', colorToken: 'green', name: 'שמואל מזרחי', role: 'קצ"ר', email: 'shmuel.mizrahi@idf.il' },
  6: { id: 6, initials: 'נת', colorToken: 'blue', name: 'נתן אברהם', role: 'מג"ד 375', email: 'natan.avraham@idf.il' },
  7: { id: 7, initials: 'הל', colorToken: 'orange', name: 'הלל שמש', role: 'מג"ד 376', email: 'hillel.shemesh@idf.il' },
  8: { id: 8, initials: 'מי', colorToken: 'cyan', name: 'מיכאל גלעד', role: 'מג"ד 377', email: 'michael.gilead@idf.il' },
  9: { id: 9, initials: 'אל', colorToken: 'green', name: 'אלון פרץ', role: 'מג"ד 378', email: 'alon.peretz@idf.il' },
}

export interface MetaFields {
  id: number
  createdAt: Date
  createdBy: number
  updatedAt: Date
  updatedBy: number
  deletedAt: Date | null
  deletedBy: number | null
}

export interface SettingsAssignee extends MetaFields {
  name: string
  color: string
  userIds?: number[]
  taskStatuses?: AssigneeTaskStatus[]
}

interface AssigneeTaskStatus {
  taskId: number
  assigneeId: number
  statusId: number
}

export const FAKE_USER_NAMES: Record<number, string> = {
  1: 'אבי כהן',
  2: 'מיכל לוי',
  3: 'יוסי גולן',
  4: 'רחל מזרחי',
  5: 'דוד פרץ',
  6: 'נועה ברקוביץ',
  7: 'אורן שפירא',
  8: 'תמר אבידן',
  9: 'גיל נחמן',
  10: 'שרה ויסמן',
  11: 'בנימין חזן',
  12: 'דינה אורן',
}

export const MOCK_SETTINGS_ASSIGNEES: SettingsAssignee[] = [
  {
    id: 1,
    name: 'מחלקת מבצעים',
    color: '#3B82F6',
    userIds: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    createdAt: new Date('2026-01-01'),
    createdBy: 1,
    updatedAt: new Date('2026-01-01'),
    updatedBy: 1,
    deletedAt: null,
    deletedBy: null,
  },
  {
    id: 2,
    name: 'צוות לוגיסטיקה',
    color: '#10B981',
    userIds: [3, 5, 7, 10, 11],
    createdAt: new Date('2026-01-01'),
    createdBy: 1,
    updatedAt: new Date('2026-01-01'),
    updatedBy: 1,
    deletedAt: null,
    deletedBy: null,
  },
  {
    id: 3,
    name: 'קצינת מודיעין',
    color: '#F59E0B',
    userIds: [4],
    createdAt: new Date('2026-01-01'),
    createdBy: 1,
    updatedAt: new Date('2026-01-01'),
    updatedBy: 1,
    deletedAt: null,
    deletedBy: null,
  },
  {
    id: 4,
    name: "פלוגה א'",
    color: '#EF4444',
    userIds: [1, 2, 6, 8, 9, 10, 11, 12],
    createdAt: new Date('2026-01-01'),
    createdBy: 1,
    updatedAt: new Date('2026-01-01'),
    updatedBy: 1,
    deletedAt: null,
    deletedBy: null,
  },
  {
    id: 5,
    name: 'קצין קשר',
    color: '#8B5CF6',
    userIds: [7, 9],
    createdAt: new Date('2026-01-01'),
    createdBy: 1,
    updatedAt: new Date('2026-01-01'),
    updatedBy: 1,
    deletedAt: null,
    deletedBy: null,
  },
  {
    id: 6,
    name: 'מפקדת הגדוד',
    color: '#EC4899',
    userIds: [2, 4, 6, 12],
    createdAt: new Date('2026-01-01'),
    createdBy: 1,
    updatedAt: new Date('2026-01-01'),
    updatedBy: 1,
    deletedAt: null,
    deletedBy: null,
  },
]
