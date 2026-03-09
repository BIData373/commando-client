import * as React from 'react';
import { cn } from '@/lib/utils';

interface ToggleGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

const ToggleGroupContext = React.createContext<{
  value: string;
  onValueChange: (v: string) => void;
}>({ value: '', onValueChange: () => {} });

function ToggleGroup({ value, onValueChange, children, className, ...props }: ToggleGroupProps) {
  return (
    <ToggleGroupContext.Provider value={{ value, onValueChange }}>
      <div
        role="group"
        className={cn('inline-flex items-center rounded-lg border border-gray-300 overflow-hidden', className)}
        {...props}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

interface ToggleGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

function ToggleGroupItem({ value, className, children, ...props }: ToggleGroupItemProps) {
  const ctx = React.useContext(ToggleGroupContext);
  const isActive = ctx.value === value;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isActive}
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center p-2 text-sm transition-colors cursor-pointer',
        'border-e border-gray-300 last:border-e-0',
        isActive ? 'bg-primary/10 text-primary' : 'bg-white text-text-secondary hover:bg-gray-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { ToggleGroup, ToggleGroupItem };
