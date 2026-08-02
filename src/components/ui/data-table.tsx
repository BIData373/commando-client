import styled from '@emotion/styled'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
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
  Fragment,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { LoadingSpinner } from '../shared/LoadingSpinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    grow?: boolean
  }
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  onCellClick?: (row: Row<TData>, columnId: string) => void
  onRowDoubleClick?: (row: Row<TData>) => void
  onRowContextMenu?: (row: Row<TData>, event: MouseEvent) => void
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  getRowId?: (row: TData) => string
  highlightedRowIds?: Set<string>
  meta?: TableMeta<TData>
  renderRowOverlay?: (row: Row<TData>) => React.ReactNode
  renderRowExpansion?: (row: Row<TData>) => React.ReactNode
  expansionColSpan?: number
  containerClassName?: string
  showHeader?: boolean
  emptyState?: ReactNode
  isLoading?: boolean
}

export function DataTable<TData>({
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
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
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

  // Single pass: partition columns into fixed-width and growable, summing sizes for each group
  const { fixedTotal, growTotal, growColumns } = visibleColumns.reduce(
    (acc, col) => {
      const size = col.columnDef.size ?? 0
      if (col.columnDef.meta?.grow) {
        acc.growTotal += size
        acc.growColumns.push(col)
      } else {
        acc.fixedTotal += size
      }
      return acc
    },
    { fixedTotal: 0, growTotal: 0, growColumns: [] } as {
      fixedTotal: number
      growTotal: number
      growColumns: typeof visibleColumns
    },
  )

  const borderTotal = visibleColumns.length * 0.5
  const growSpace = containerWidth > 0 ? containerWidth - fixedTotal - borderTotal : 0

  // Distribute remaining horizontal space proportionally among grow columns.
  // Uses Math.floor per column and assigns the rounding remainder to the last column.
  const growWidths = useMemo(() => {
    const map = new Map<string, number>()
    if (growSpace <= 0 || growTotal <= 0) return map

    const floored = growColumns.map((col) => ({
      id: col.id,
      width: Math.floor(growSpace * ((col.columnDef.size ?? 0) / growTotal)),
    }))
    const flooredTotal = floored.reduce((sum, col) => sum + col.width, 0)
    floored.forEach(({ id, width }, i) => {
      map.set(id, i === floored.length - 1 ? width + (growSpace - flooredTotal) : width)
    })
    return map
  }, [growSpace, growTotal, growColumns])

  const colgroup = (
    <colgroup>
      {visibleColumns.map((column) => {
        const width = growWidths.get(column.id) ?? column.columnDef.size
        return (
          <col
            key={column.id}
            style={width !== undefined ? { width: `${width}px` } : undefined}
          />
        )
      })}
    </colgroup>
  )

  const totalSize = fixedTotal + growTotal

  const rows = table.getRowModel().rows.map((row) => ({
    row,
    expansionContent: renderRowExpansion?.(row),
  }))

  const tableMinWidth = totalSize > 0 ? totalSize : undefined

  return (
    <Table containerRef={containerRef} containerClassName={containerClassName} style={{ minWidth: tableMinWidth }}>
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
      <TableBody>
        {rows.length ? (
          rows.map(({ row, expansionContent }) => (
            <Fragment key={row.id}>
              <TableRow
                data-state={row.getIsSelected() ? 'selected' : undefined}
                data-highlighted={highlightedRowIds?.has(row.id) ? '' : undefined}
                onContextMenu={
                  onRowContextMenu ? (event) => onRowContextMenu(row, event) : undefined
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    data-column-id={cell.column.id}
                    onClick={onCellClick ? () => onCellClick(row, cell.column.id) : undefined}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                {renderRowOverlay?.(row)}
              </TableRow>
              {expansionContent != null && (
                <tr data-expansion-row="">
                  <ExpansionCell colSpan={expansionColSpan ?? columns.length}>
                    {expansionContent}
                  </ExpansionCell>
                </tr>
              )}
            </Fragment>
          ))
        ) : isLoading ? (
          <EmptyRow>
            <EmptyCell colSpan={columns.length}>
              <LoadingSpinner />
            </EmptyCell>
          </EmptyRow>
        ) : (
          <EmptyRow>
            <EmptyCell colSpan={columns.length}>
              {emptyState}
            </EmptyCell>
          </EmptyRow>
        )}
      </TableBody>
    </Table>
  )
}

// ─── Styled Components ─────────────────────────────────────────────────────

const EmptyRow = styled.tr`
  &:hover {
    background: none !important;
  }
`
const EmptyCell = styled.td`
  text-align: center;
  padding: 72px 0 !important;

`

const ExpansionCell = styled.td`
  padding: 0;
  border: none;
  height: auto;
  background: var(--colors-base-neutral-3) !important;
  outline: none !important;
`

