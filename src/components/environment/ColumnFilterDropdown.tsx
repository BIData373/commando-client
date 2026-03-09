import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Checkbox, Button } from '@/components/ui';

interface FilterOption {
  value: string;
  label: string;
}

interface ColumnFilterDropdownProps {
  options: FilterOption[];
  selected: string[];
  onApply: (values: string[]) => void;
  onReset: () => void;
  onClose: () => void;
}

export function ColumnFilterDropdown({
  options,
  selected,
  onApply,
  onReset,
  onClose,
}: ColumnFilterDropdownProps) {
  const [pending, setPending] = useState<Set<string>>(new Set(selected));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const toggleOption = (value: string) => {
    setPending((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const handleApply = () => {
    onApply(Array.from(pending));
    onClose();
  };

  const handleReset = () => {
    setPending(new Set());
    onReset();
    onClose();
  };

  return (
    <div
      ref={ref}
      className="absolute top-full mt-1 start-0 z-40 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="max-h-52 overflow-y-auto px-1">
        {options.length === 0 ? (
          <p className="px-3 py-2 text-sm text-text-disabled text-center">אין אפשרויות</p>
        ) : (
          options.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors hover:bg-gray-50',
                pending.has(opt.value) && 'bg-primary/5'
              )}
            >
              <Checkbox
                checked={pending.has(opt.value)}
                onChange={() => toggleOption(opt.value)}
              />
              <span className={cn(pending.has(opt.value) && 'font-medium text-primary')}>
                {opt.label}
              </span>
            </label>
          ))
        )}
      </div>

      <div className="border-t border-gray-100 mt-2 pt-2 px-3 flex items-center gap-2">
        <Button size="sm" onClick={handleApply} className="flex-1">
          החל
        </Button>
        <Button size="sm" variant="ghost" onClick={handleReset} className="flex-1">
          אפס
        </Button>
      </div>
    </div>
  );
}
