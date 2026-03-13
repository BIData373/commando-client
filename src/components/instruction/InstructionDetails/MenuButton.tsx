import styled from '@emotion/styled';

interface MenuButtonProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

export default function MenuButton({
  icon,
  children,
  onClick,
  variant = 'default',
}: MenuButtonProps) {
  return (
    <StyledButton onClick={onClick} $variant={variant}>
      {icon}
      {children}
    </StyledButton>
  );
}

const StyledButton = styled.button<{ $variant: 'default' | 'danger' }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  background: none;
  border: none;
  transition: background-color 150ms, color 150ms;

  color: ${({ $variant }) => ($variant === 'danger' ? 'var(--color-error)' : 'var(--color-text-secondary)')};

  &:hover {
    background-color: ${({ $variant }) => ($variant === 'danger' ? 'color-mix(in srgb, var(--color-error) 8%, transparent)' : 'var(--color-gray-50)')};
  }
`;
