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
import { Fragment, type ReactNode, useRef, useState, useLayoutEffect } from 'react'
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
  onRowClick?: (row: Row<TData>) => void
  onRowDoubleClick?: (row: Row<TData>) => void
  disabledClickColumns?: string[]
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
  onRowClick,
  // TODO - maybe implement?
  // onRowDoubleClick,
  disabledClickColumns,
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
  isLoading
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
    setContainerWidth(el.getBoundingClientRect().width)
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const visibleColumns = table.getVisibleLeafColumns()

  const fixedTotal = visibleColumns
    .filter((col) => !col.columnDef.meta?.grow)
    .reduce((sum, col) => sum + (col.columnDef.size ?? 0), 0)

  const growTotal = visibleColumns
    .filter((col) => col.columnDef.meta?.grow)
    .reduce((sum, col) => sum + (col.columnDef.size ?? 0), 0)

  const borderTotal = visibleColumns.length * 0.5
  const growSpace = containerWidth > 0 ? containerWidth - fixedTotal - borderTotal : 0

  const growColumns = visibleColumns.filter((col) => col.columnDef.meta?.grow)
  const growWidths = new Map<string, number>()
  if (growSpace > 0 && growTotal > 0) {
    const floored = growColumns.map((col) => ({
      id: col.id,
      width: Math.floor(growSpace * ((col.columnDef.size ?? 0) / growTotal)),
    }))
    const flooredTotal = floored.reduce((sum, col) => sum + col.width, 0)
    floored.forEach(({ id, width }, i) => {
      growWidths.set(id, i === floored.length - 1 ? width + (growSpace - flooredTotal) : width)
    })
  }

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
                onClick={onRowClick ? (e) => {
                  if (disabledClickColumns?.length) {
                    const td = (e.target as HTMLElement).closest('td')
                    const columnId = td?.getAttribute('data-column-id')
                    if (columnId && disabledClickColumns.includes(columnId)) return
                  }
                  onRowClick(row)
                } : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} data-column-id={cell.column.id}>
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

