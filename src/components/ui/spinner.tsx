import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: number;
  className?: string;
}

function Spinner({ size = 24, className }: SpinnerProps) {
  return <Loader2 className={cn('animate-spin text-primary', className)} style={{ width: size, height: size }} />;
}

export { Spinner };
