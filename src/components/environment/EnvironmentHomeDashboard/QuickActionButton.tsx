import styled from '@emotion/styled';

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}

export default function QuickActionButton({
  icon,
  label,
  description,
  onClick,
}: QuickActionButtonProps) {
  return (
    <StyledButton onClick={onClick}>
      <IconBox>{icon}</IconBox>
      <TextGroup>
        <Label>{label}</Label>
        <Description>{description}</Description>
      </TextGroup>
    </StyledButton>
  );
}

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem;
  border-radius: 0.75rem;
  border: 1px solid #f1f5f9;
  background: none;
  cursor: pointer;
  text-align: start;
  transition: background-color 150ms, border-color 150ms;

  &:hover {
    background-color: #f8fafc;
    border-color: #e2e8f0;
  }
`;

const IconBox = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background-color: color-mix(in srgb, var(--color-primary) 8%, transparent);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TextGroup = styled.div`
  min-width: 0;
`;

const Label = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
`;

const Description = styled.p`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 0.125rem;
`;
