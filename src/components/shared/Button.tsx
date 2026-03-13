import styled from '@emotion/styled';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  default: `background: var(--gradient-primary, var(--color-primary)); color: #ffffff; box-shadow: 0 1px 2px rgba(0,0,0,0.1); &:hover { opacity: 0.9; }`,
  destructive: `background-color: var(--color-error); color: #ffffff; &:hover { opacity: 0.9; }`,
  outline: `border: 1px solid #d1d5db; background-color: #ffffff; color: var(--color-text-primary); &:hover { background-color: #f9fafb; }`,
  secondary: `background-color: #f3f4f6; color: var(--color-text-primary); &:hover { background-color: #e5e7eb; }`,
  ghost: `background: none; color: var(--color-text-secondary); &:hover { background-color: #f3f4f6; }`,
  link: `background: none; color: var(--color-primary); text-underline-offset: 4px; &:hover { text-decoration: underline; }`,
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  default: `height: 2.25rem; padding: 0.5rem 1rem;`,
  sm: `height: 2rem; padding: 0 0.75rem; font-size: 0.75rem; border-radius: 0.375rem;`,
  lg: `height: 2.5rem; padding: 0 1.5rem; border-radius: 0.5rem;`,
  icon: `height: 2.25rem; width: 2.25rem; padding: 0;`,
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', ...props }, ref) => (
    <StyledButton ref={ref} $variant={variant} $size={size} {...props} />
  )
);

Button.displayName = 'Button';

const StyledButton = styled.button<{ $variant: ButtonVariant; $size: ButtonSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  border-radius: 0.5rem;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 150ms, background-color 150ms, opacity 150ms;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 50%, transparent);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  ${({ $variant }) => VARIANT_STYLES[$variant]}
  ${({ $size }) => SIZE_STYLES[$size]}
`;

export default Button;
