import styled from '@emotion/styled'
import { flexRender, type Cell, type Row, type RowData } from '@tanstack/react-table'
import { isEqual, isEqualWith } from 'lodash'
import { Fragment, memo, type MouseEvent, type ReactNode } from 'react'
import type { AppTableFeatures } from '../../utils/table-features'
import { TableCell, TableRow } from './table'

export const EXPANSION_ROW_ATTR = 'data-expansion-row'

export interface RowRange {
  first: number
  last: number
}

interface DataTableRowProps<TData extends RowData> {
  row: Row<AppTableFeatures, TData>
  /** Passed separately from `row` because rows outlive column changes, while cells don't */
  cells: Cell<AppTableFeatures, TData, unknown>[]
  index: number
  isSelected: boolean
  isHighlighted: boolean
  rowRef?: (node: HTMLTableRowElement | null) => void
  onCellClick?: (row: Row<AppTableFeatures, TData>, columnId: string) => void
  onRowContextMenu?: (row: Row<AppTableFeatures, TData>, event: MouseEvent) => void
  renderRowOverlay?: (row: Row<AppTableFeatures, TData>) => ReactNode
  renderRowExpansion?: (row: Row<AppTableFeatures, TData>) => ReactNode
  expansionColSpan: number
  rowSpans?: Record<string, number>
  onSpanHoverChange?: (range: RowRange | null) => void
}

function DataTableRowInner<TData extends RowData>({
  row,
  cells,
  index,
  isSelected,
  isHighlighted,
  rowRef,
  onCellClick,
  onRowContextMenu,
  renderRowOverlay,
  renderRowExpansion,
  expansionColSpan,
  rowSpans,
  onSpanHoverChange,
}: DataTableRowProps<TData>) {
  const expansionContent = renderRowExpansion?.(row)

  function handleSpanMouseLeave() {
    onSpanHoverChange?.(null)
  }

  // A spanned cell belongs to every row it covers, so it must not trigger this row's menu
  function handleSpanContextMenu(event: MouseEvent) {
    event.stopPropagation()
  }

  function renderCell(cell: Cell<AppTableFeatures, TData, unknown>) {
    const rowSpan = rowSpans?.[cell.column.id] ?? 1
    if (rowSpan === 0) return null

    const isSpanned = rowSpan > 1
    const spanRange = { first: index, last: index + rowSpan - 1 }

    return (
      <TableCell
        key={cell.id}
        rowSpan={isSpanned ? rowSpan : undefined}
        data-column-id={cell.column.id}
        onClick={onCellClick ? () => onCellClick(row, cell.column.id) : undefined}
        onMouseEnter={isSpanned ? () => onSpanHoverChange?.(spanRange) : undefined}
        onMouseLeave={isSpanned ? handleSpanMouseLeave : undefined}
        onContextMenu={isSpanned ? handleSpanContextMenu : undefined}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    )
  }

  return (
    <Fragment>
      <TableRow
        ref={rowRef}
        data-index={index}
        data-state={isSelected ? 'selected' : undefined}
        data-highlighted={isHighlighted ? '' : undefined}
        onContextMenu={onRowContextMenu ? (event) => onRowContextMenu(row, event) : undefined}
      >
        {cells.map(renderCell)}
        {renderRowOverlay?.(row)}
      </TableRow>
      {expansionContent != null && (
        <tr {...{ [EXPANSION_ROW_ATTR]: '' }}>
          <ExpansionCell colSpan={expansionColSpan}>
            {expansionContent}
          </ExpansionCell>
        </tr>
      )}
    </Fragment>
  )
}

// `rowSpans` is rebuilt every scroll frame, so it's compared by value to keep rows memoized while scrolling
function areRowPropsEqual<TData extends RowData>(
  { rowSpans: previousRowSpans, ...previousProps }: DataTableRowProps<TData>,
  { rowSpans: nextRowSpans, ...nextProps }: DataTableRowProps<TData>,
) {
  return (
    isEqual(previousRowSpans, nextRowSpans) &&
    isEqualWith(previousProps, nextProps, (previous, next, key) =>
      key === undefined ? undefined : Object.is(previous, next),
    )
  )
}

export const DataTableRow = memo(DataTableRowInner, areRowPropsEqual) as typeof DataTableRowInner

const ExpansionCell = styled.td`
  padding: 0;
  border: none;
  height: auto;
  background: var(--colors-base-neutral-3) !important;
  outline: none !important;
`
