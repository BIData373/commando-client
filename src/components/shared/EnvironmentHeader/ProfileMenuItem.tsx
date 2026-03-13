import styled from '@emotion/styled';
import { ChevronLeft } from 'lucide-react';

interface ProfileMenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export default function ProfileMenuItem({ icon, label, onClick }: ProfileMenuItemProps) {
  return (
    <ProfileMenuItemButton onClick={onClick}>
      <ProfileMenuItemLeft>
        <ProfileMenuItemIcon>{icon}</ProfileMenuItemIcon>
        <ProfileMenuItemLabel>{label}</ProfileMenuItemLabel>
      </ProfileMenuItemLeft>
      <ChevronIcon size={16} />
    </ProfileMenuItemButton>
  );
}

const ProfileMenuItemButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  color: var(--color-gray-700);
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: var(--color-gray-50);
  }
`;

const ProfileMenuItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ProfileMenuItemIcon = styled.span`
  color: var(--color-text-disabled);
`;

const ProfileMenuItemLabel = styled.span`
  font-weight: 500;
`;

const ChevronIcon = styled(ChevronLeft)`
  color: var(--color-gray-300);
`;
