import styled from '@emotion/styled';
import {
  AlertCircle,
  Archive as ArchiveIcon,
  ArrowRight,
  CheckCircle2,
  Clock,
  History,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { IInstruction, InstructionStatus } from '../../types';

interface InstructionHeaderProps {
  instruction: IInstruction;
  envId: string;
  onOpenActivity: () => void;
}

interface StatusStyle {
  label: string;
  icon: React.ReactNode;
  bg: string;
  color: string;
  border: string;
}

const STATUS_BADGE: Record<InstructionStatus, StatusStyle> = {
  open: {
    label: 'ממתין לביצוע',
    icon: <AlertCircle size={12} />,
    bg: 'var(--color-info-light)',
    color: 'var(--color-info)',
    border: 'color-mix(in srgb, var(--color-info) 30%, transparent)',
  },
  inProgress: {
    label: 'בביצוע',
    icon: <Clock size={12} />,
    bg: 'var(--color-warning-light)',
    color: 'var(--color-warning)',
    border: 'color-mix(in srgb, var(--color-warning) 30%, transparent)',
  },
  completed: {
    label: 'בוצע',
    icon: <CheckCircle2 size={12} />,
    bg: 'var(--color-success-light)',
    color: 'var(--color-success)',
    border: 'color-mix(in srgb, var(--color-success) 30%, transparent)',
  },
  archived: {
    label: 'בארכיון',
    icon: <ArchiveIcon size={12} />,
    bg: 'var(--color-gray-50)',
    color: 'var(--color-text-disabled)',
    border: 'var(--color-gray-200)',
  },
};

export default function InstructionHeader({
  instruction,
  envId,
  onOpenActivity,
}: InstructionHeaderProps) {
  const navigate = useNavigate();
  const badge = STATUS_BADGE[instruction.status];

  function handleClickBackButton() {
    navigate(`/env/${envId}`);
  }

  return (
    <Header>
      <LeftGroup>
        <BackButton onClick={handleClickBackButton} aria-label="חזרה">
          <ArrowRight size={20} />
        </BackButton>
        <TitleGroup>
          <Title>{instruction.title}</Title>
          <StatusBadge $bg={badge.bg} $color={badge.color} $border={badge.border}>
            {badge.icon}
            {badge.label}
          </StatusBadge>
        </TitleGroup>
      </LeftGroup>

      <ActivityButton onClick={onOpenActivity}>
        <History size={18} />
        יומן פעילות
      </ActivityButton>
    </Header>
  );
}

const Header = styled.div`
  background-color: var(--color-paper);
  border-bottom: 1px solid var(--color-gray-100);
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled.button`
  padding: 0.5rem;
  border-radius: 9999px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-disabled);
  transition: background-color 150ms;

  &:hover {
    background-color: var(--color-gray-50);
  }
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
`;

const StatusBadge = styled.span<{ $bg: string; $color: string; $border: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 11px;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  border: 1px solid ${({ $border }) => $border};
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;

const ActivityButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 150ms;

  &:hover {
    color: var(--color-primary);
  }
`;
