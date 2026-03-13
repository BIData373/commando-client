import styled from '@emotion/styled';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </div>
  );
}

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-primary);
`;

const Subtitle = styled.p`
  font-size: 0.75rem;
  color: var(--color-text-disabled);
  margin-top: 0.25rem;
`;
