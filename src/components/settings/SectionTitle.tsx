import styled from '@emotion/styled'

interface SectionTitleProps {
    title: string
    className?: string
}

export const SectionTitle = ({ title, className }: SectionTitleProps) => {
    return (
        <StyledTitle className={className}>
            {title}
        </StyledTitle>
    )
}

const StyledTitle = styled.h2`
  font-size: 24px;
  font-weight: 500;
  color: var(--sea-ink);
  margin: 0 12px;
`
