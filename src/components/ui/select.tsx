import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, children, ...props }, ref) => {
    return (
      <div className="relative">
        {label && (
          <label className="block text-xs font-semibold text-text-secondary mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'flex h-9 w-full appearance-none rounded-lg border border-gray-300 bg-white pe-8 ps-3 py-1 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
