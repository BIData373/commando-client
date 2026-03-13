import * as React from 'react';
import { DropdownMenuContext } from './DropdownMenu';

export default function DropdownMenuTrigger({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen, triggerRef } = React.useContext(DropdownMenuContext);

  return (
    <button
      ref={triggerRef as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setOpen(!open);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
