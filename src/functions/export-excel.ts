import * as XLSX from 'xlsx-js-style'
import { differenceInDays, startOfToday } from 'date-fns'
import { formatDateShort } from './date-utils'
import { getStatusStyle, STATUS_LABELS } from '../components/shared/StatusTag'
import { DEADLINE_LABELS } from '../components/shared/DeadlineTag'
import type { Task } from '../data/Tasks'

interface CellValue {
  value: string
  fontColor?: string
  bgColor?: string
  link?: string
}

interface ExportColumn<T> {
  header: string
  accessor: (row: T) => string | CellValue
}

function isCellValue(val: string | CellValue): val is CellValue {
  return typeof val === 'object' && val !== null && 'value' in val
}

function hexToArgb(hex: string): string {
  return hex.replace('#', '').toUpperCase().padStart(6, '0')
}

const RTL_ALIGNMENT = {
  horizontal: 'right' as const,
  readingOrder: 2,
}

function getDeadlineDateStyle(task: Task) {
  if (!task.dueDate || task.deadlineType === 'immediate') return {}
  const today = startOfToday()
  const daysUntil = differenceInDays(task.dueDate, today)
  if (daysUntil < 0) return { fontColor: '#f5222d' }
  if (daysUntil < 2) return { fontColor: '#d46b08' }
  return {}
}

const COLUMN_DEFS: Record<string, ExportColumn<Task>> = {
  title: { header: 'ההנחיה', accessor: (t) => t.details ? `${t.title} – ${t.details}` : t.title },
  status: { header: 'סטטוס', accessor: (t) => ({
    value: STATUS_LABELS[t.status],
    ...getStatusStyle(t.status),
  }) },
  responsible: { header: 'אחראי', accessor: (t) => t.responsible?.name ?? '' },
  deadlineType: { header: 'תג"ב', accessor: (t) => {
    const typeStr = DEADLINE_LABELS[t.deadlineType]
    const dateStr = t.dueDate ? formatDateShort(t.dueDate) : ''
    const value = dateStr ? `${typeStr} | ${dateStr}` : typeStr
    return { value, ...getDeadlineDateStyle(t) }
  } },
  discussionName: { header: 'מקור', accessor: (t) => {
    const source = `${t.discussionName} | ${t.discussionDate}`
    return t.attachmentUrl
      ? { value: source, link: t.attachmentUrl }
      : source
  } },
  tags: { header: 'נושא', accessor: (t) => t.tags.join(', ') },
  notes: { header: 'הערות', accessor: (t) => t.notes },
  createdAt: { header: 'תאריך יצירה', accessor: (t) => formatDateShort(t.createdAt) },
  updatedAt: { header: 'עודכן ב', accessor: (t) => formatDateShort(t.updatedAt) },
}

interface ExportOptions {
  columnOrder: string[]
  hiddenColumns: Set<string>
}

export function exportTasksToExcel(tasks: Task[], options: ExportOptions) {
  const { columnOrder, hiddenColumns } = options

  const idColumn: ExportColumn<Task> = { header: 'מס"ד', accessor: (t) => String(t.id) }

  const visibleColumns = columnOrder
    .filter((id) => !hiddenColumns.has(id) && COLUMN_DEFS[id])
    .map((id) => COLUMN_DEFS[id])

  exportToExcel<Task>(tasks, [idColumn, ...visibleColumns], 'הנחיות')
}

function exportToExcel<T>(
  rows: T[],
  columns: ExportColumn<T>[],
  fileName: string,
) {
  const headers = columns.map((col) => col.header)
  const worksheet = XLSX.utils.aoa_to_sheet([headers])

  const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: col })
    if (worksheet[cellRef]) {
      worksheet[cellRef].s = {
        font: { bold: true },
        alignment: RTL_ALIGNMENT,
      }
    }
  }

  rows.forEach((row, rowIdx) => {
    columns.forEach((col, colIdx) => {
      const raw = col.accessor(row)
      const cellRef = XLSX.utils.encode_cell({ r: rowIdx + 1, c: colIdx })
      const cell = isCellValue(raw) ? raw : { value: raw }

      const style: XLSX.CellStyle = { alignment: RTL_ALIGNMENT }

      if (cell.fontColor) {
        style.font = { ...style.font, color: { rgb: hexToArgb(cell.fontColor) } }
      }

      if (cell.bgColor) {
        style.fill = { patternType: 'solid', fgColor: { rgb: hexToArgb(cell.bgColor) } }
      }

      if (cell.link) {
        worksheet[cellRef] = {
          v: cell.value,
          t: 's',
          s: {
            ...style,
            font: { ...style.font, underline: true, color: { rgb: '0563C1' } },
          },
          l: { Target: cell.link, Tooltip: cell.value },
        }
      } else {
        worksheet[cellRef] = { v: cell.value, t: 's', s: style }
      }
    })
  })

  const ref = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: rows.length, c: columns.length - 1 },
  })
  worksheet['!ref'] = ref

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  workbook.Workbook = workbook.Workbook || {}
  workbook.Workbook.Views = [{ RTL: true }]

  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}
