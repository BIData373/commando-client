import styled from '@emotion/styled'
import { StatusDropdown } from '../shared/StatusDropdown'
import type { DirectiveStatus } from '../shared/StatusTag'

interface StatusCellProps {
  status: DirectiveStatus
  taskId: number
  onUpdate: (taskId: number, status: DirectiveStatus) => void
}

export function StatusCell({ status, taskId, onUpdate }: StatusCellProps) {
  function handleStatusChange(newStatus: DirectiveStatus) {
    onUpdate(taskId, newStatus)
  }

  return (
    <CellCenter>
      <StatusDropdown status={status} onStatusChange={handleStatusChange} />
    </CellCenter>
  )
}

const CellCenter = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`
