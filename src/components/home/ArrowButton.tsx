import styled from '@emotion/styled';
import { ChevronLeft } from 'lucide-react';

interface ArrowButtonProps {
  onClick: (e: React.MouseEvent) => void;
  label: string;
}

export default function ArrowButton({ onClick, label }: ArrowButtonProps) {
  return (
    <ArrowButtonWrapper onClick={onClick} aria-label={label}>
      <ArrowChevronIcon />
    </ArrowButtonWrapper>
  );
}

const ArrowButtonWrapper = styled.button`
	width: 2rem;
	height: 2rem;

	border-color: var(--color-gray-200);

	display: flex;
	align-items: center;
	justify-content: center;

	transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
    
	cursor: pointer;
`;

const ArrowChevronIcon = styled(ChevronLeft)`
	width: 1rem;
	height: 1rem;
`;
