import styled from '@emotion/styled';
import {
  ChevronLeft,
  ClipboardList,
  HelpCircle,
  Home,
  Info,
  Settings,
  User,
  UserCircle,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import DropdownMenu from '../DropdownMenu/DropdownMenu';
import DropdownMenuContent from '../DropdownMenu/DropdownMenuContent';
import DropdownMenuItem from '../DropdownMenu/DropdownMenuItem';
import DropdownMenuSeparator from '../DropdownMenu/DropdownMenuSeparator';
import DropdownMenuTrigger from '../DropdownMenu/DropdownMenuTrigger';
import Tooltip from '../Tooltip';

export type SidebarItem = 'home' | 'instructions' | 'settings';

interface NavItem {
  key: SidebarItem;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'בית', icon: <Home size={20} /> },
  { key: 'instructions', label: 'כל ההנחיות', icon: <ClipboardList size={20} /> },
  { key: 'settings', label: 'פרמטרי מערך', icon: <Settings size={20} /> },
];

interface EnvironmentHeaderProps {
  environmentName: string;
  activeItem: SidebarItem;
  onItemChange: (item: SidebarItem) => void;
}

// FIX Rename?
export default function EnvironmentHeader({ activeItem, onItemChange }: EnvironmentHeaderProps) {
  const navigate = useNavigate();
  const { envId } = useParams<{ envId: string }>();

  function handleItemClick(item: SidebarItem) {
    if (item === 'settings') {
      navigate(`/env/${envId}/settings`);
    } else {
      onItemChange(item);
    }
  }

  function handleNavigateHome() {
    navigate('/');
  }

  function handleNavigatePersonal() {
    navigate('/personal');
  }

  return (
    <Header>
      <TopBar>
        <ProfileArea>
          <DropdownMenu>
            <ProfileToggle aria-label="תפריט משתמש">
              <User size={20} />
            </ProfileToggle>
            <DropdownMenuContent align="start">
              <ProfileUserRow>
                <ProfileAvatar>
                  <User size={20} />
                </ProfileAvatar>
                <ProfileUserInfo>
                  <ProfileUserName>סא"ל כהן</ProfileUserName>
                  <ProfileUserEmail>yael@example.com</ProfileUserEmail>
                </ProfileUserInfo>
              </ProfileUserRow>
              <DropdownMenuSeparator />
              <ProfileNavItem onClick={handleNavigatePersonal}>
                <ProfileNavIcon>
                  <UserCircle size={20} />
                </ProfileNavIcon>
                <ProfileNavLabel>אזור אישי</ProfileNavLabel>
                <ChevronLeft size={16} />
              </ProfileNavItem>
              <ProfileNavItem>
                <ProfileNavIcon>
                  <HelpCircle size={20} />
                </ProfileNavIcon>
                <ProfileNavLabel>עזרה ותמיכה</ProfileNavLabel>
                <ChevronLeft size={16} />
              </ProfileNavItem>
              <ProfileNavItem>
                <ProfileNavIcon>
                  <Info size={20} />
                </ProfileNavIcon>
                <ProfileNavLabel>עוד מאיתנו</ProfileNavLabel>
                <ChevronLeft size={16} />
              </ProfileNavItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ProfileArea>

        <NavList>
          {NAV_ITEMS.map((item) => (
            <Tooltip key={item.key} content={item.label}>
              <NavButton
                $active={activeItem === item.key}
                onClick={() => handleItemClick(item.key)}
                aria-label={item.label}
              >
                {item.icon}
              </NavButton>
            </Tooltip>
          ))}
        </NavList>

        <LogoButton onClick={handleNavigateHome} aria-label="חזרה לדף הבית">
          <LogoText>
            Comman<LogoAccent>Do</LogoAccent>
          </LogoText>
        </LogoButton>
      </TopBar>
    </Header>
  );
}

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;
  padding: 0.75rem 1rem 0;
  background-color: var(--color-background);
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 1rem;
  padding: 0 1.5rem;
  height: 60px;
  background: #131629;
  border: 1px solid rgb(255 255 255 / 0.1);
  box-shadow: 0 0 0 1px rgb(0 0 0 / 0.2), 0 4px 50px -12px rgb(0 0 0 / 0.25);
`;

const ProfileArea = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProfileToggle = styled(DropdownMenuTrigger)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: none;
  border: none;
  color: rgb(255 255 255 / 0.5);
  cursor: pointer;
  transition: color 150ms, background-color 150ms;

  &:hover {
    color: var(--color-paper);
    background-color: rgb(255 255 255 / 0.08);
  }
`;

const ProfileUserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-gray-100);
`;

const ProfileAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  flex-shrink: 0;
`;

const ProfileUserInfo = styled.div`
  min-width: 0;
`;

const ProfileUserName = styled.p`
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
`;

const ProfileUserEmail = styled.p`
  font-size: 0.75rem;
  color: var(--color-text-disabled);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
`;

const ProfileNavItem = styled(DropdownMenuItem)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 1rem;
  color: var(--color-text-primary);
`;

const ProfileNavIcon = styled.span`
  color: var(--color-text-disabled);
  display: flex;
`;

const ProfileNavLabel = styled.span`
  flex: 1;
  font-weight: 500;
  margin-inline-start: 0.75rem;
`;

const NavList = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const NavButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 150ms, background-color 150ms;
  background-color: ${({ $active }) => ($active ? 'rgb(255 255 255 / 0.15)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--color-paper)' : 'rgb(255 255 255 / 0.5)')};

  &:hover {
    color: var(--color-paper);
    background-color: ${({ $active }) =>
      $active ? 'rgb(255 255 255 / 0.15)' : 'rgb(255 255 255 / 0.08)'};
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
  color: var(--color-paper);
`;

const LogoAccent = styled.span`
  color: var(--color-secondary-light);
`;
