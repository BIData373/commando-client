import styled from '@emotion/styled';
import * as React from 'react';

export type DropdownAlign = 'start' | 'end';

export interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export const DropdownMenuContext = React.createContext<DropdownMenuContextValue>({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
});

interface DropdownMenuProps {
  children: React.ReactNode;
}

// FIX Split provider & menu
export default function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      <MenuWrapper>{children}</MenuWrapper>
    </DropdownMenuContext.Provider>
  );
}

const MenuWrapper = styled.div`
  position: relative;
  display: inline-block;
`;
