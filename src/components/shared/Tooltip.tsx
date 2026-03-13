import styled from '@emotion/styled';
import { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [show, setShow] = useState(false);

  function handleMouseEnter() {
    setShow(true);
  }

  function handleMouseLeave() {
    setShow(false);
  }

  return (
    <Wrapper onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {show && <Popup>{content}</Popup>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const Popup = styled.div`
  position: absolute;
  bottom: 100%;
  inset-inline-start: 50%;
  transform: translateX(-50%);
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: var(--color-text-primary);
  color: var(--color-paper);
  border-radius: 0.375rem;
  white-space: nowrap;
  z-index: 50;
  pointer-events: none;
`;
