import styled from '@emotion/styled'
import {
  flexRender,
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type TableMeta,
} from '@tanstack/react-table'
import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode
} from 'react'
import { appTableFeatures, type AppTableFeatures } from '../../utils/table-features'
import { DataTableBody } from './data-table-body'
import { Table, TableHead, TableHeader, TableRow } from './table'

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<AppTableFeatures, TData>[]
  data: TData[]
  onCellClick?: (row: Row<AppTableFeatures, TData>, columnId: string) => void
  onRowDoubleClick?: (row: Row<AppTableFeatures, TData>) => void
  onRowContextMenu?: (row: Row<AppTableFeatures, TData>, event: MouseEvent) => void
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  getRowId?: (row: TData) => string
  highlightedRowIds?: Set<string>
  meta?: TableMeta<AppTableFeatures, TData>
  renderRowOverlay?: (row: Row<AppTableFeatures, TData>) => React.ReactNode
  renderRowExpansion?: (row: Row<AppTableFeatures, TData>) => React.ReactNode
  expansionColSpan?: number
  containerClassName?: string
  showHeader?: boolean
  emptyState?: ReactNode
  isLoading?: boolean
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  onCellClick,
  // TODO - maybe implement?
  // onRowDoubleClick,
  onRowContextMenu,
  rowSelection,
  onRowSelectionChange,
  columnFilters,
  onColumnFiltersChange,
  sorting,
  onSortingChange,
  getRowId,
  highlightedRowIds,
  meta,
  renderRowOverlay,
  renderRowExpansion,
  expansionColSpan,
  containerClassName,
  showHeader = true,
  emptyState,
  isLoading,
}: DataTableProps<TData>) {
  const table = useTable({
    features: appTableFeatures,
    data,
    columns,
    state: {
      ...(rowSelection !== undefined && { rowSelection }),
      ...(columnFilters !== undefined && { columnFilters }),
      ...(sorting !== undefined && { sorting }),
    },
    onRowSelectionChange,
    onColumnFiltersChange,
    onSortingChange,
    getRowId,
    meta,
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return

    function updateWidth(width: number) {
      const rounded = Math.round(width)
      setContainerWidth((prev) => (prev === rounded ? prev : rounded))
    }

    updateWidth(el.getBoundingClientRect().width)
    const observer = new ResizeObserver(([entry]) => {
      updateWidth(entry.contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const visibleColumns = table.getVisibleLeafColumns()

  const { fixedTotal, growTotal, growMinTotal, growColumns } = useMemo(
    () =>
      visibleColumns.reduce(
        (acc, col) => {
          const size = col.columnDef.size ?? 0
          if (col.columnDef.meta?.grow) {
            acc.growTotal += size
            acc.growMinTotal += col.columnDef.minSize ?? size
            acc.growColumns.push(col)
          } else {
            acc.fixedTotal += size
          }
          return acc
        },
        { fixedTotal: 0, growTotal: 0, growMinTotal: 0, growColumns: [] } as {
          fixedTotal: number
          growTotal: number
          growMinTotal: number
          growColumns: typeof visibleColumns
        },
      ),
    [visibleColumns],
  )

  const borderTotal = visibleColumns.length * 0.5
  const growSpace = containerWidth > 0 ? containerWidth - fixedTotal - borderTotal : 0

  const growWidths = useMemo(() => {
    const map = new Map<string, number>()
    if (growColumns.length === 0) return map

    if (growSpace <= growMinTotal) {
      growColumns.forEach((col) => {
        map.set(col.id, col.columnDef.minSize ?? col.columnDef.size ?? 0)
      })
      return map
    }

    const usingAuthoredSize = growSpace >= growTotal
    const floored = growColumns.map((col) => {
      const size = col.columnDef.size ?? 0
      if (usingAuthoredSize) {
        const width = growTotal > 0 ? Math.floor(growSpace * (size / growTotal)) : 0
        return { id: col.id, width }
      }

      const minSize = col.columnDef.minSize ?? size
      const shrinkRange = growTotal - growMinTotal
      const ratio = shrinkRange > 0 ? (growSpace - growMinTotal) / shrinkRange : 0
      return { id: col.id, width: Math.floor(minSize + (size - minSize) * ratio) }
    })
    const flooredTotal = floored.reduce((sum, col) => sum + col.width, 0)
    floored.forEach(({ id, width }, i) => {
      map.set(id, i === floored.length - 1 ? width + (growSpace - flooredTotal) : width)
    })
    return map
  }, [growSpace, growTotal, growMinTotal, growColumns])

  const colgroup = useMemo(
    () => (
      <colgroup>
        {visibleColumns.map((column) => (
          <Col key={column.id} $width={growWidths.get(column.id) ?? column.columnDef.size} />
        ))}
      </colgroup>
    ),
    [visibleColumns, growWidths],
  )

  const totalSize = fixedTotal + growMinTotal
  const tableMinWidth = totalSize > 0 ? totalSize : undefined

  return (
    <StyledTable containerRef={containerRef} containerClassName={containerClassName} $minWidth={tableMinWidth}>
      {colgroup}
      {showHeader && (
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
      )}
      <DataTableBody
        rows={table.getRowModel().rows}
        rowSpans={table.getCellSpanIndex().rowSpans}
        columnCount={visibleColumns.length}
        scrollContainerRef={containerRef}
        highlightedRowIds={highlightedRowIds}
        onCellClick={onCellClick}
        onRowContextMenu={onRowContextMenu}
        renderRowOverlay={renderRowOverlay}
        renderRowExpansion={renderRowExpansion}
        expansionColSpan={expansionColSpan}
        emptyState={emptyState}
        isLoading={isLoading}
      />
    </StyledTable>
  )
}

const StyledTable = styled(Table) <{ $minWidth?: number }>`
  min-width: ${({ $minWidth }) => ($minWidth !== undefined ? `${$minWidth}px` : undefined)};

  /* A spanned cell belongs to its first row, so it would otherwise take that row's hover alone */
  td[rowspan] {
    background: var(--background);
  }

  tr[data-highlighted] > td[rowspan] {
    background: inherit;
  }
`

const Col = styled.col<{ $width?: number }>`
  width: ${({ $width }) => ($width !== undefined ? `${$width}px` : undefined)};
`
