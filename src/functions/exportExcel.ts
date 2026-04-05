import * as XLSX from 'xlsx-js-style'

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

export function exportToExcel<T>(
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
