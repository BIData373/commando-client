import styled from '@emotion/styled'
import type { PropsWithChildren } from 'react'


interface EmptyCardStateProps extends PropsWithChildren {
    imgSrc: string
    title: string
    description: string
}

export const EmptyCardState = ({
    imgSrc,
    title,
    description,
    children
}: EmptyCardStateProps) => {
    return (
        <EmptyState>
            <EmptyIconWrapper>
                <img src={imgSrc} alt="" />
            </EmptyIconWrapper>
            <EmptyTitle>{title}</EmptyTitle>
            <EmptyDescription>
                {description.split('\n').map((line) => (
                    <span key={line}>{line}</span>
                ))}
            </EmptyDescription>
            {children}
        </EmptyState>
    )
}

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
  max-width: max-content;
  text-align: center;
`

const EmptyTitle = styled.p`
  font-size: 15px;
  font-weight: 500;
  color: var(--sea-ink);
  margin: 0;
`

const EmptyDescription = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: var(--sea-ink-soft);
  margin: 0 0 12px;
  line-height: 22px;
`

const EmptyIconWrapper = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--purple-start);
  opacity: 0.6;
  margin-bottom: 8px;
`