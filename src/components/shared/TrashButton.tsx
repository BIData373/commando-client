import styled from '@emotion/styled'
import { Trash2 } from 'lucide-react'

interface TrashButtonProps {
  onClick?(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
  size?: number
  ref?: React.Ref<HTMLButtonElement>
  className?: string
}

export const TrashButton = ({ onClick, ref, size, className }: TrashButtonProps) => {
  return (
    <DeleteButton ref={ref} onClick={onClick} className={className}>
      <Trash2 size={size ?? 16} />
    </DeleteButton>
  )
}


const DeleteButton = styled.button<{ $visible?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
  border-radius: 2px;
  color: rgba(0, 0, 0, 0.45);
  transition: opacity 0.3s ease-in-out;
  opacity: ${({ $visible }) => $visible ? '1' : '0'};

  &:hover {
    color: var(--text-color-2);
    background: rgba(0, 0, 0, 0.04);
  }

  &:active {
    color: var(--text-color-2);
    background: rgba(0, 0, 0, 0.15);
  }
`
