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

  return (
    <Table>
      <colgroup>
        {table.getAllColumns().map((column) => (
          /* col width is a semantic HTML layout attribute, not an emotion style override */
          <col
            key={column.id}
            style={column.columnDef.size !== undefined ? { width: column.columnDef.size } : undefined}
          />
        ))}
      </colgroup>
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
