import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

const TabsContext = React.createContext<{ value: string; onValueChange: (v: string) => void }>({
  value: '',
  onValueChange: () => {},
});

function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center gap-1 border-b border-gray-200',
        className
      )}
      {...props}
    />
  );
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

function TabsTrigger({ value, className, ...props }: TabsTriggerProps) {
  const ctx = React.useContext(TabsContext);
  const isActive = ctx.value === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center px-3 pb-2.5 pt-2 text-sm font-medium transition-colors',
        'border-b-[3px] -mb-px cursor-pointer',
        isActive
          ? 'border-primary text-primary'
          : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300',
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger };
