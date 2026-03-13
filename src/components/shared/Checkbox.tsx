import styled from '@emotion/styled';
import { Check, Minus } from 'lucide-react';
import { forwardRef, useEffect, useRef } from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ indeterminate, checked, ...props }, ref) => {
    const innerRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const el = innerRef.current;
      if (el) el.indeterminate = !!indeterminate;
    }, [indeterminate]);

    return (
      <Label>
        <HiddenInput
          type="checkbox"
          ref={(el) => {
            (innerRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
            if (typeof ref === 'function') ref(el);
            else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
          }}
          checked={checked}
          {...props}
        />
        <Box $checked={!!checked} $indeterminate={!!indeterminate}>
          {(checked || indeterminate) &&
            (indeterminate ? (
              <Minus size={12} color="#ffffff" />
            ) : (
              <Check size={12} color="#ffffff" />
            ))}
        </Box>
      </Label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

const Label = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;

const HiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

const Box = styled.div<{ $checked: boolean; $indeterminate: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 0.25rem;
  border: 1px solid #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 150ms, border-color 150ms;

  ${({ $checked, $indeterminate }) =>
    ($checked || $indeterminate)
      ? `background-color: var(--color-primary); border-color: var(--color-primary);`
      : ''}

  ${HiddenInput}:focus-visible + & {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 30%, transparent);
  }
`;

export default Checkbox;
