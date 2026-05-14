export type HistoryAction = 'update' | 'create' | 'delete'

export interface HistoryChange {
  id: number
  name: string
  userId: string
  action: HistoryAction
  field: string
  value: string
  timestamp: Date
}
