import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
}

function Progress({ value, max = 100, className, ...props }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={max}
      className={cn('relative h-2.5 w-full overflow-hidden rounded-full bg-gray-200', className)}
      {...props}
    >
      <div
        className="h-full rounded-full bg-gradient-to-l from-[#10b981] to-[#34d399] transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export { Progress };
