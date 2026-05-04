import { Fragment } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type RowSelectionState,
  type OnChangeFn,
  type TableMeta,
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  onRowClick?: (row: Row<TData>) => void
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  getRowId?: (row: TData) => string
  highlightedRowIds?: Set<string>
  meta?: TableMeta<TData>
  renderRowOverlay?: (row: Row<TData>) => React.ReactNode
  renderRowExpansion?: (row: Row<TData>) => React.ReactNode
}

export function DataTable<TData>({
  columns,
  data,
  onRowClick,
  rowSelection,
  onRowSelectionChange,
  getRowId,
  highlightedRowIds,
  meta,
  renderRowOverlay,
  renderRowExpansion,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(rowSelection !== undefined && { state: { rowSelection }, onRowSelectionChange }),
    ...(getRowId && { getRowId }),
    ...(meta && { meta }),
  })

  const allColumns = table.getAllColumns()
  const totalSize = allColumns.reduce((sum, col) => sum + (col.columnDef.size ?? 0), 0)

  const colgroup = (
    <colgroup>
      {allColumns.map((column) => (
        <col
          key={column.id}
          style={
            column.columnDef.size !== undefined && totalSize > 0
              ? {
                  width: `${(column.columnDef.size / totalSize) * 100}%`,
                  minWidth: `${column.columnDef.size}px`,
                }
              : undefined
          }
        />
      ))}
    </colgroup>
  )

  return (
    <Table>
      {colgroup}
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
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => {
            const expansionContent = renderRowExpansion?.(row)
            return (
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
                    <td
                      colSpan={columns.length}
                      style={{ padding: 0, border: 'none', height: 'auto', background: '#f5f5f5' }}
                    >
                      {expansionContent}
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length}>אין נתונים להצגה</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
