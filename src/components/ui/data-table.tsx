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
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  Fragment,
  memo,
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

const EXPANSION_ROW_ATTR = 'data-expansion-row'

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

interface DataTableRowProps<TData> {
  row: Row<TData>
  index: number
  isSelected: boolean
  isHighlighted: boolean
  rowRef?: (node: HTMLTableRowElement | null) => void
  onCellClick?: (row: Row<TData>, columnId: string) => void
  onRowContextMenu?: (row: Row<TData>, event: MouseEvent) => void
  renderRowOverlay?: (row: Row<TData>) => ReactNode
  renderRowExpansion?: (row: Row<TData>) => ReactNode
  expansionColSpan: number
}

function DataTableRowInner<TData>({
  row,
  index,
  isSelected,
  isHighlighted,
  rowRef,
  onCellClick,
  onRowContextMenu,
  renderRowOverlay,
  renderRowExpansion,
  expansionColSpan,
}: DataTableRowProps<TData>) {
  const expansionContent = renderRowExpansion?.(row)

  return (
    <Fragment>
      <TableRow
        ref={rowRef}
        data-index={index}
        data-state={isSelected ? 'selected' : undefined}
        data-highlighted={isHighlighted ? '' : undefined}
        onContextMenu={onRowContextMenu ? (event) => onRowContextMenu(row, event) : undefined}
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
        <tr {...{ [EXPANSION_ROW_ATTR]: '' }}>
          <ExpansionCell colSpan={expansionColSpan}>
            {expansionContent}
          </ExpansionCell>
        </tr>
      )}
    </Fragment>
  )
}

const DataTableRow = memo(DataTableRowInner) as typeof DataTableRowInner

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

  const { fixedTotal, growTotal, growColumns } = useMemo(
    () =>
      visibleColumns.reduce(
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
      ),
    [visibleColumns],
  )

  const borderTotal = visibleColumns.length * 0.5
  const growSpace = containerWidth > 0 ? containerWidth - fixedTotal - borderTotal : 0

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

  const totalSize = fixedTotal + growTotal

  const hasExpansion = renderRowExpansion !== undefined

  const tableRows = table.getRowModel().rows
  const { getVirtualItems, getTotalSize, measureElement } = useVirtualizer({
    count: tableRows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 44,
    overscan: 16,
    useFlushSync: false,
    measureElement: (el) => {
      let height = el.clientHeight
      const next = el.nextElementSibling
      if (next?.hasAttribute(EXPANSION_ROW_ATTR)) {
        height += (next as HTMLElement).clientHeight
      }
      return height
    }
  })

  const rowRef = hasExpansion ? measureElement : undefined

  const tableMinWidth = totalSize > 0 ? totalSize : undefined

  const virtualRows = getVirtualItems()
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0
  const paddingBottom =
    virtualRows.length > 0 ? getTotalSize() - virtualRows[virtualRows.length - 1].end : 0

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
      <TableBody>
        {paddingTop > 0 && (
          <tr>
            <SpacerCell colSpan={columns.length} $height={paddingTop} />
          </tr>
        )}
        {virtualRows.length ? (
          virtualRows.map((virtualRow) => {
            const row = tableRows[virtualRow.index]

            return (
              <DataTableRow
                key={row.id}
                row={row}
                index={virtualRow.index}
                isSelected={row.getIsSelected()}
                isHighlighted={highlightedRowIds?.has(row.id) ?? false}
                rowRef={rowRef}
                onCellClick={onCellClick}
                onRowContextMenu={onRowContextMenu}
                renderRowOverlay={renderRowOverlay}
                renderRowExpansion={renderRowExpansion}
                expansionColSpan={expansionColSpan ?? columns.length}
              />
            )
          })
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
        {paddingBottom > 0 && (
          <tr>
            <SpacerCell colSpan={columns.length} $height={paddingBottom} />
          </tr>
        )}
      </TableBody>
    </StyledTable>
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

const ExpansionCell = styled.td`
  padding: 0;
  border: none;
  height: auto;
  background: var(--colors-base-neutral-3) !important;
  outline: none !important;
`

const StyledTable = styled(Table)<{ $minWidth?: number }>`
  min-width: ${({ $minWidth }) => ($minWidth !== undefined ? `${$minWidth}px` : undefined)};
`

const Col = styled.col<{ $width?: number }>`
  width: ${({ $width }) => ($width !== undefined ? `${$width}px` : undefined)};
`

const SpacerCell = styled.td<{ $height: number }>`
  height: ${({ $height }) => `${$height}px`};
  padding: 0;
  border: none;
`

