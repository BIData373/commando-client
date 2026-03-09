import * as React from 'react';
import { cn } from '@/lib/utils';

interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
}

function Separator({ orientation = 'horizontal', className, ...props }: SeparatorProps) {
  return (
    <hr
      className={cn(
        'border-gray-200',
        orientation === 'vertical' ? 'h-full w-px border-0 bg-gray-200' : '',
        className
      )}
      {...props}
    />
  );
}

export { Separator };
