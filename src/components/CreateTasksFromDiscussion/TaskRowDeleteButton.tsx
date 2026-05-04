import styled from '@emotion/styled'
import { Trash2 } from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

interface TaskRowDeleteButtonProps {
  hasTitle: boolean
  isLast: boolean
  onDelete: () => void
}

// ─── Component ──────────────────────────────────────────────────────────────

function TaskRowDeleteButton({ hasTitle, isLast, onDelete }: TaskRowDeleteButtonProps) {
  if (!hasTitle || isLast) return null

  return (
    <DeleteButton onClick={onDelete}>
      <Trash2 size={14} />
    </DeleteButton>
  )
}

export default TaskRowDeleteButton

// ─── Styles ─────────────────────────────────────────────────────────────────

const DeleteButton = styled.button`
  position: absolute;
  inset-inline-start: -32px;
  inset-block-start: 50%;
  transform: translateY(-50%);
  display: none;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  padding: 0;

  &:hover {
    color: #ff4d4f;
    background: rgba(255, 77, 79, 0.06);
  }

  tr:hover > & {
    display: flex;
  }
`
