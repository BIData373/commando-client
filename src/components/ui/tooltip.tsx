import * as React from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  className?: string;
}

function Tooltip({ content, children, className }: TooltipProps) {
  const [show, setShow] = React.useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={cn(
            'absolute bottom-full start-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-xs font-medium',
            'bg-gray-800 text-white rounded-md whitespace-nowrap z-50 pointer-events-none',
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export { Tooltip };
