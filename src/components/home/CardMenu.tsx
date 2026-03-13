import styled from '@emotion/styled';
import { MoreVertical, Pencil, Settings, Trash2 } from 'lucide-react';
import DropdownMenu from '../shared/DropdownMenu/DropdownMenu';
import DropdownMenuContent from '../shared/DropdownMenu/DropdownMenuContent';
import DropdownMenuItem from '../shared/DropdownMenu/DropdownMenuItem';
import DropdownMenuSeparator from '../shared/DropdownMenu/DropdownMenuSeparator';
import DropdownMenuTrigger from '../shared/DropdownMenu/DropdownMenuTrigger';

interface CardMenuProps {
  onEdit?: () => void;
  onSettings?: () => void;
  onDelete?: () => void;
}

export default function CardMenu({ onEdit, onSettings, onDelete }: CardMenuProps) {
  return (
    <DropdownMenu>
      <Trigger aria-label="אפשרויות">
        <MoreVertical size={16} />
      </Trigger>
      <DropdownMenuContent align="start">
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil size={14} />
            עריכה
          </DropdownMenuItem>
        )}
        {onSettings && (
          <DropdownMenuItem onClick={onSettings}>
            <Settings size={14} />
            הגדרות
          </DropdownMenuItem>
        )}
        {(onEdit || onSettings) && onDelete && <DropdownMenuSeparator />}
        {onDelete && (
          <DropdownMenuItem destructive onClick={onDelete}>
            <Trash2 size={14} />
            מחיקה
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const Trigger = styled(DropdownMenuTrigger)`
  padding: 0.25rem;
  border-radius: 0.375rem;
  color: var(--color-text-disabled);
  cursor: pointer;
  transition: color 150ms, background-color 150ms;

  &:hover {
    color: var(--color-text-secondary);
    background-color: var(--color-gray-100);
  }
`;
