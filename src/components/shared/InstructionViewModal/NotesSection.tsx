import styled from '@emotion/styled';
import { ListChecks } from 'lucide-react';

interface NotesSectionProps {
  description: string | null;
}

export default function NotesSection({ description }: NotesSectionProps) {
  if (!description) return <EmptyText>אין הערות</EmptyText>;

  const lines = description
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('-') || l.startsWith('•') || /^\d+\./.test(l));

  if (lines.length === 0) return <EmptyText>אין הערות</EmptyText>;

  return (
    <List>
      {lines.map((line) => (
        <ListItem key={line}>
          <BulletIcon size={14} />
          <span>{line.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '')}</span>
        </ListItem>
      ))}
    </List>
  );
}

const EmptyText = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-disabled);
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

const BulletIcon = styled(ListChecks)`
  color: var(--color-text-disabled);
  margin-top: 0.125rem;
  flex-shrink: 0;
`;
