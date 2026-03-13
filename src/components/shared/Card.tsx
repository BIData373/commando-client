import styled from '@emotion/styled';
import * as React from 'react';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => <StyledCard ref={ref} {...props} />
);

Card.displayName = 'Card';

const StyledCard = styled.div`
  border-radius: 1rem;
  background-color: var(--color-paper);
  box-shadow: var(--shadow-sm);
`;

export default Card;
