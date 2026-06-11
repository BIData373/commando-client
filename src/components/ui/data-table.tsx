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
import { Fragment, type ReactNode } from 'react'

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

const allColumns = table.getAllColumns()
  const totalSize = allColumns.reduce((sum, col) => sum + (col.columnDef.size ?? 0), 0)

  const colgroup = (
    <colgroup>
      {allColumns.map((column) => {
        const size = column.columnDef.size
        return (
          <col
            key={column.id}
            style={size !== undefined && totalSize > 0
              ? { width: `${((size / totalSize) * 100).toFixed(3)}%` }
              : undefined}
          />
        )
      })}
    </colgroup>
  )

  const rows = table.getRowModel().rows.map((row) => ({
    row,
    expansionContent: renderRowExpansion?.(row),
  }))

  const tableMinWidth = totalSize > 0 ? totalSize : undefined

  return (
    <Table containerClassName={containerClassName} style={{ minWidth: tableMinWidth }}>
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
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
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

