import styled from '@emotion/styled';

interface ToolbarButtonProps {
  icon: React.ElementType;
  label: string;
}

export default function ToolbarButton({ icon: Icon, label }: ToolbarButtonProps) {
  return (
    <StyledButton type="button" aria-label={label}>
      <Icon size={16} />
    </StyledButton>
  );
}

const StyledButton = styled.button`
  padding: 0.375rem;
  border-radius: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  transition: background-color 150ms;

  &:hover {
    background-color: #e2e8f0;
  }
`;
