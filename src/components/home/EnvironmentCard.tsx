import styled from '@emotion/styled';
import { Clock } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IEnvironmentWithRole } from '../../types';
import { ROLE_LABELS } from '../../types';
import Card from '../shared/Card';
import ArrowButton from './ArrowButton';
import CardMenu from './CardMenu';
import StatBlock from './StatBlock';

interface EnvironmentCardProps {
  environment: IEnvironmentWithRole;
}

interface RoleColors {
  bg: string;
  color: string;
  dot: string;
}

const ROLE_COLORS: Record<string, RoleColors> = {
  manager: {
    bg: 'var(--color-warning-light)',
    color: 'var(--color-warning)',
    dot: 'var(--color-warning)',
  },
  responsible: {
    bg: 'var(--color-info-light)',
    color: 'var(--color-info)',
    dot: 'var(--color-info)',
  },
};

const DEFAULT_ROLE_COLORS: RoleColors = {
  bg: 'var(--color-gray-50)',
  color: 'var(--color-text-secondary)',
  dot: 'var(--color-text-disabled)',
};

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHrs = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return 'עכשיו';
  if (diffMin < 60) return `לפני ${diffMin} דק'`;
  if (diffHrs < 24) return `לפני ${diffHrs} שע'`;
  if (diffDays < 7) return `לפני ${diffDays} ימים`;
  return date.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });
}

function getInitials(name: string): string {
  return name.substring(0, 2);
}

export default function EnvironmentCard({ environment }: EnvironmentCardProps) {
  const navigate = useNavigate();
  const roleColors = ROLE_COLORS[environment.currentUserRole] ?? DEFAULT_ROLE_COLORS;

  function handleSettings() {
    navigate(`/env/${environment.id}/settings`);
  }

  function handleClickNavButton() {
    navigate(`/env/${environment.id}`);
  }

  function handleClickArrowButton(e: MouseEvent<Element>) {
    e.stopPropagation();
    navigate(`/env/${environment.id}`);
  }

  return (
    <StyledCard>
      <TopRow>
        <CardMenu onSettings={handleSettings} />
        <RoleBadge $bg={roleColors.bg} $color={roleColors.color}>
          <RoleDot $dot={roleColors.dot} />
          {ROLE_LABELS[environment.currentUserRole]}
        </RoleBadge>
      </TopRow>

      <NavButton onClick={handleClickNavButton} aria-label={`כניסה לסביבה ${environment.name}`}>
        <AvatarRow>
          <AvatarCircle>
            <AvatarInitials>{getInitials(environment.name)}</AvatarInitials>
          </AvatarCircle>
          <EnvName>{environment.name}</EnvName>
        </AvatarRow>
        <TimestampRow>
          <ClockIcon size={14} />
          <TimestampText>עודכן {getTimeAgo(new Date(environment.updatedAt))}</TimestampText>
        </TimestampRow>
      </NavButton>

      <Footer>
        <FooterSeparator />
        <FooterRow>
          <ArrowButton onClick={handleClickArrowButton} label="כניסה לסביבה" />
          <StatsGroup>
            <StatBlock value={environment.memberCount} label="צוות" />
            <StatBlock value={environment.instructionCount} label="הנחיות" />
          </StatsGroup>
        </FooterRow>
      </Footer>
    </StyledCard>
  );
}

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  transition: box-shadow 150ms;

  &:hover {
    box-shadow: var(--shadow-hover);
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem 0;
`;

const RoleBadge = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;

const RoleDot = styled.span<{ $dot: string }>`
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  background-color: ${({ $dot }) => $dot};
`;

const NavButton = styled.button`
  flex: 1;
  width: 100%;
  text-align: start;
  cursor: pointer;
  background: none;
  border: none;
  padding: 1rem 1.25rem;
`;

const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const AvatarCircle = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: linear-gradient(to bottom right, var(--color-primary-dark), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const AvatarInitials = styled.span`
  color: var(--color-paper);
  font-weight: 700;
  font-size: 0.875rem;
`;

const EnvName = styled.h3`
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 15px;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TimestampRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const ClockIcon = styled(Clock)`
  color: var(--color-text-disabled);
`;

const TimestampText = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-disabled);
`;

const Footer = styled.div`
  padding: 0 1.25rem 1rem;
`;

const FooterSeparator = styled.hr`
  border-color: #e5e7eb;
  margin-bottom: 0.75rem;
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;
