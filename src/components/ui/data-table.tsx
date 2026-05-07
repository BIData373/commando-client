import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type RowSelectionState,
  type OnChangeFn,
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
}

export function DataTable<TData>({
  columns,
  data,
  onRowClick,
  rowSelection,
  onRowSelectionChange,
  getRowId,
  highlightedRowIds,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(rowSelection !== undefined && { state: { rowSelection }, onRowSelectionChange }),
    ...(getRowId && { getRowId }),
  })

  const allColumns = table.getAllColumns()
  const fixedTotal = allColumns.reduce((sum, col) => {
    const grow = (col.columnDef.meta as { grow?: boolean } | undefined)?.grow
    return grow ? sum : sum + (col.columnDef.size ?? 0)
  }, 0)

  const colgroup = (
    <colgroup>
      {allColumns.map((column) => {
        const grow = (column.columnDef.meta as { grow?: boolean } | undefined)?.grow
        const size = column.columnDef.size

      return grow && size !== undefined ? (
            <col
              key={column.id}
              style={{ width: `calc(100% - ${fixedTotal}px)`, minWidth: `${size}px` }}
            />
          ) : (
          <col
            key={column.id}
            style={size !== undefined ? { width: `${size}px` } : undefined}
          />
        )
      })}
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
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() ? 'selected' : undefined}
              data-highlighted={highlightedRowIds?.has(row.id) ? '' : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length}>אין נתונים להצגה</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
