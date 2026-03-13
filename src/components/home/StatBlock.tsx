import styled from '@emotion/styled';

interface StatBlockProps {
  value: number;
  label: string;
}

export default function StatBlock({ value, label }: StatBlockProps) {
  return (
    <Wrapper>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  text-align: center;
  min-width: 48px;
`;

const Label = styled.span`
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
`;

const Value = styled.span`
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.25;
`;
