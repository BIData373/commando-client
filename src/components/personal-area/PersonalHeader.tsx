import styled from '@emotion/styled';
import { ClipboardList, HelpCircle, Info, User, UserCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownMenu from '../shared/DropdownMenu/DropdownMenu';
import DropdownMenuContent from '../shared/DropdownMenu/DropdownMenuContent';
import DropdownMenuItem from '../shared/DropdownMenu/DropdownMenuItem';
import DropdownMenuTrigger from '../shared/DropdownMenu/DropdownMenuTrigger';
import Tooltip from '../shared/Tooltip';

export type PersonalNavItem = 'instructions';

interface PersonalHeaderProps {
  activeItem: PersonalNavItem;
  onItemChange?: (item: PersonalNavItem) => void;
  userName: string;
}

interface NavItem {
  key: PersonalNavItem;
  label: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { key: 'instructions', label: 'ההנחיות שלי', icon: <ClipboardList size={20} /> },
];

export default function PersonalHeader({
  activeItem,
  onItemChange = () => {},
  userName,
}: PersonalHeaderProps) {
  const navigate = useNavigate();

  const handleLogoClick = () => navigate('/');
  const handlePersonalArea = () => onItemChange('instructions');

  return (
    <TopbarWrapper>
      <TopbarBar>
        {/* Right (RTL start): Profile */}
        <TopbarSection>
          <DropdownMenu>
            <ProfileTrigger aria-label="תפריט משתמש">
              <User size={20} />
            </ProfileTrigger>
            <DropdownMenuContent align="start">
              <UserInfoHeader>
                <UserAvatarCircle>
                  <User size={20} />
                </UserAvatarCircle>
                <UserInfoText>
                  <UserName>{userName}</UserName>
                  <UserEmail>yael@example.com</UserEmail>
                </UserInfoText>
              </UserInfoHeader>
              <MenuItemsSection>
                <DropdownMenuItem onClick={handlePersonalArea}>
                  <UserCircle size={20} /> אזור אישי
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle size={20} /> עזרה ותמיכה
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Info size={20} /> עוד מאיתנו
                </DropdownMenuItem>
              </MenuItemsSection>
            </DropdownMenuContent>
          </DropdownMenu>
        </TopbarSection>

        {/* Center: Nav buttons */}
        <TopbarSection>
          {navItems.map((item) => (
            <Tooltip key={item.key} content={item.label}>
              <NavButton
                $active={activeItem === item.key}
                onClick={() => onItemChange(item.key)}
                aria-label={item.label}
              >
                {item.icon}
              </NavButton>
            </Tooltip>
          ))}
        </TopbarSection>

        {/* Left (RTL end): Logo */}
        <LogoButton onClick={handleLogoClick} aria-label="חזרה לדף הבית">
          <LogoText>
            Comman<LogoAccent>Do</LogoAccent>
          </LogoText>
        </LogoButton>
      </TopbarBar>
    </TopbarWrapper>
  );
}

const TopbarWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  padding: 0.75rem 1rem 0;
  background-color: var(--color-background);
`;

const TopbarBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  border-radius: 1rem;
  padding: 0 1.5rem;
  height: 60px;
  background: #131629;
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.20), 0 4px 50px -12px rgba(0, 0, 0, 0.25);
`;

const TopbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
`;

const ProfileTrigger = styled(DropdownMenuTrigger)`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: color 150ms, background-color 150ms;

  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

const UserInfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-gray-100);
`;

const UserAvatarCircle = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-circle);
  background-color: var(--color-gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-500);
  border: 1px solid var(--color-gray-200);
  flex-shrink: 0;
`;

const UserInfoText = styled.div`
  min-width: 0;
`;

const UserName = styled.p`
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-gray-900);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserEmail = styled.p`
  font-size: 0.75rem;
  color: var(--color-text-disabled);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MenuItemsSection = styled.div`
  padding: 0.25rem 0;
`;

const NavButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: color 150ms, background-color 150ms;
  background-color: ${({ $active }) => ($active ? 'rgba(255, 255, 255, 0.15)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'white' : 'rgba(255, 255, 255, 0.5)')};

  &:hover {
    color: white;
    background-color: ${({ $active }) => ($active ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)')};
  }
`;

const LogoButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity 150ms;

  &:hover {
    opacity: 0.8;
  }
`;

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: white;
`;

const LogoAccent = styled.span`
  color: var(--color-secondary-light);
`;
