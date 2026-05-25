export type HistoryAction = 'update' | 'create' | 'delete'

export interface HistoryChange {
  id: number
  name: string
  userId: number
  action: HistoryAction
  field: string
  value: string
  timestamp: Date
}
