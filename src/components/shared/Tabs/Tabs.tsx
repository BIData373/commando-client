import * as React from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export interface TabsContextValue {
  value: string;
  onValueChange: (v: string) => void;
}

export const TabsContext = React.createContext<TabsContextValue>({
  value: '',
  onValueChange: () => {},
});

// FIX Move to provider
export default function Tabs({ value, onValueChange, children }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}
