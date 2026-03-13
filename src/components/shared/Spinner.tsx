import styled from '@emotion/styled';
import { Loader2 } from 'lucide-react';

const DEFAULT_SIZE = 24;

const Spinner = styled(Loader2)<{ $size: number }>`
  width: ${({ $size = DEFAULT_SIZE }) => $size}px;
  height: ${({ $size = DEFAULT_SIZE }) => $size}px;
  color: var(--color-primary);
  animation: spin 1s linear infinite;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
`;

export default Spinner;
