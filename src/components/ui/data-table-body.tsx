import styled from '@emotion/styled'
import type { Row, RowData } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { isEmpty, mapValues } from 'lodash'
import { useState, type MouseEvent, type ReactNode, type RefObject } from 'react'
import type { AppTableFeatures } from '../../utils/table-features'
import { LoadingSpinner } from '../shared/LoadingSpinner'
import { DataTableRow, EXPANSION_ROW_ATTR, type RowRange } from './data-table-row'
import { TableBody } from './table'

const ESTIMATED_ROW_HEIGHT = 43
const VIRTUAL_OVERSCAN = 16

interface DataTableBodyProps<TData extends RowData> {
  rows: Row<AppTableFeatures, TData>[]
  rowSpans: Record<string, Int32Array>
  columnCount: number
  scrollContainerRef: RefObject<HTMLDivElement | null>
  highlightedRowIds?: Set<string>
  onCellClick?: (row: Row<AppTableFeatures, TData>, columnId: string) => void
  onRowContextMenu?: (row: Row<AppTableFeatures, TData>, event: MouseEvent) => void
  renderRowOverlay?: (row: Row<AppTableFeatures, TData>) => ReactNode
  renderRowExpansion?: (row: Row<AppTableFeatures, TData>) => ReactNode
  expansionColSpan?: number
  emptyState?: ReactNode
  isLoading?: boolean
}

/**
 * Converts the table's row spans into the spans to render inside the virtualized
 * window: runs are cut at the last rendered row, and a run whose anchor scrolled
 * out of view is re-anchored on the first rendered row. `0` means the cell is covered.
 */
function getRenderedRowSpans(
  rowSpans: Record<string, Int32Array>,
  rowIndex: number,
  range: RowRange,
): Record<string, number> {
  return mapValues(rowSpans, (spans) => {
    if (spans[rowIndex] === 0 && rowIndex !== range.first) return 0

    let end = rowIndex + 1
    while (end <= range.last && spans[end] === 0) end++
    return end - rowIndex
  })
}

function isIndexInRange(index: number, range: RowRange | null) {
  return range !== null && index >= range.first && index <= range.last
}

function measureRowWithExpansion(element: Element) {
  const expansion = element.nextElementSibling
  const expansionHeight = expansion?.hasAttribute(EXPANSION_ROW_ATTR) ? expansion.clientHeight : 0
  return element.clientHeight + expansionHeight
}

/** Owns the virtualizer so scroll updates re-render only the body, not the header and column layout */
export function DataTableBody<TData extends RowData>({
  rows,
  rowSpans,
  columnCount,
  scrollContainerRef,
  highlightedRowIds,
  onCellClick,
  onRowContextMenu,
  renderRowOverlay,
  renderRowExpansion,
  expansionColSpan,
  emptyState,
  isLoading,
}: DataTableBodyProps<TData>) {
  const [hoveredSpan, setHoveredSpan] = useState<RowRange | null>(null)

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: VIRTUAL_OVERSCAN,
    useFlushSync: false,
    measureElement: measureRowWithExpansion,
  })

  // Rows are fixed height unless they can expand; measuring them anyway costs a
  // layout read per mounted row and shifts the scroll position while scrolling up
  const measureRow = renderRowExpansion ? rowVirtualizer.measureElement : undefined

  const virtualRows = rowVirtualizer.getVirtualItems()
  const firstVirtualRow = virtualRows.at(0)
  const lastVirtualRow = virtualRows.at(-1)
  const paddingTop = firstVirtualRow?.start ?? 0
  const paddingBottom = lastVirtualRow ? rowVirtualizer.getTotalSize() - lastVirtualRow.end : 0

  const hasRowSpans = !isEmpty(rowSpans)
  const renderedRange: RowRange = {
    first: firstVirtualRow?.index ?? 0,
    last: lastVirtualRow?.index ?? -1,
  }

  if (!rows.length) {
    return (
      <TableBody>
        <EmptyRow>
          <EmptyCell colSpan={columnCount}>
            {isLoading ? <LoadingSpinner /> : emptyState}
          </EmptyCell>
        </EmptyRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {paddingTop > 0 && (
        <tr>
          <SpacerCell data-virtual-spacer colSpan={columnCount} $height={paddingTop} />
        </tr>
      )}
      {virtualRows.map((virtualRow) => {
        const row = rows[virtualRow.index]

        return (
          <DataTableRow
            key={row.id}
            row={row}
            cells={row.getVisibleCells()}
            index={virtualRow.index}
            isSelected={row.getIsSelected()}
            isHighlighted={
              (highlightedRowIds?.has(row.id) ?? false) ||
              isIndexInRange(virtualRow.index, hoveredSpan)
            }
            rowRef={measureRow}
            onCellClick={onCellClick}
            onRowContextMenu={onRowContextMenu}
            renderRowOverlay={renderRowOverlay}
            renderRowExpansion={renderRowExpansion}
            expansionColSpan={expansionColSpan ?? columnCount}
            rowSpans={
              hasRowSpans
                ? getRenderedRowSpans(rowSpans, virtualRow.index, renderedRange)
                : undefined
            }
            onSpanHoverChange={setHoveredSpan}
          />
        )
      })}
      {paddingBottom > 0 && (
        <tr>
          <SpacerCell data-virtual-spacer colSpan={columnCount} $height={paddingBottom} />
        </tr>
      )}
    </TableBody>
  )
}

const EmptyRow = styled.tr`
  &:hover {
    background: none !important;
  }
`

const EmptyCell = styled.td`
  text-align: center;
  padding: 72px 0 !important;
`

const SpacerCell = styled.td<{ $height: number }>`
  height: ${({ $height }) => `${$height}px`} !important;
  max-height: none !important;
  padding: 0 !important;
  border: none !important;
`
