import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check, Minus } from 'lucide-react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate, checked, ...props }, ref) => {
    const innerRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      const el = innerRef.current;
      if (el) el.indeterminate = !!indeterminate;
    }, [indeterminate]);

    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          ref={(el) => {
            (innerRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
            if (typeof ref === 'function') ref(el);
            else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
          }}
          checked={checked}
          className="peer sr-only"
          {...props}
        />
        <div
          className={cn(
            'h-4.5 w-4.5 rounded border border-gray-400 transition-colors',
            'flex items-center justify-center',
            'peer-checked:bg-primary peer-checked:border-primary',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30',
            className
          )}
        >
          {(checked || indeterminate) && (
            indeterminate
              ? <Minus className="h-3 w-3 text-white" />
              : <Check className="h-3 w-3 text-white" />
          )}
        </div>
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
