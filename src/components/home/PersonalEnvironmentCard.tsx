import styled from '@emotion/styled';
import { Clock, ShieldCheck } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../shared/Card';
import ArrowButton from './ArrowButton';
import CardMenu from './CardMenu';
import StatBlock from './StatBlock';

interface PersonalEnvironmentCardProps {
  instructionCount?: number;
}

export default function PersonalEnvironmentCard({
  instructionCount = 12,
}: PersonalEnvironmentCardProps) {
  const navigate = useNavigate();

  function handleClickNavButton() {
    navigate('/personal');
  }

  function handleClickArrowButton(e: MouseEvent) {
    e.stopPropagation();
    navigate('/personal');
  }

  return (
    <StyledCard>
      <TopRow>
        <CardMenu />
        <PrivateBadge>
          <ShieldCheck size={12} />
          פרטי
        </PrivateBadge>
      </TopRow>

      <NavButton onClick={handleClickNavButton} aria-label="כניסה לסביבה האישית">
        <AvatarRow>
          <AvatarCircle>
            <AvatarInitials>מט</AvatarInitials>
          </AvatarCircle>
          <CardTitle>הסביבה האישית שלי</CardTitle>
        </AvatarRow>
        <TimestampRow>
          <ClockIcon size={14} />
          <TimestampText>עודכן לפני 10 דק'</TimestampText>
        </TimestampRow>
      </NavButton>

      <Spacer />

      <Footer>
        <FooterSeparator />
        <FooterRow>
          <ArrowButton onClick={handleClickArrowButton} label="כניסה לסביבה האישית" />
          <StatBlock value={instructionCount} label="הנחיות" />
        </FooterRow>
      </Footer>
    </StyledCard>
  );
}

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: box-shadow 150ms;

  &:hover {
    box-shadow: var(--shadow-hover);
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.25rem 0;
`;

const PrivateBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background-color: #f5f3ff;
  color: #7c3aed;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
`;

const NavButton = styled.button`
  width: 100%;
  text-align: start;
  cursor: pointer;
  background: none;
  border: none;
  padding: 1.25rem 1.25rem 0;
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
  background-color: #ec4899;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const AvatarInitials = styled.span`
  color: #ffffff;
  font-weight: 700;
  font-size: 0.875rem;
`;

const CardTitle = styled.h3`
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 15px;
  line-height: 1.35;
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

const Spacer = styled.div`
  flex: 1;
  min-height: 200px;
`;

const Footer = styled.div`
  padding: 0 1.25rem 1.25rem;
`;

const FooterSeparator = styled.hr`
  border-color: #e5e7eb;
  margin-bottom: 1rem;
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
