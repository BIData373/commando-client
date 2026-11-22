import styled from "@emotion/styled"
import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react"

interface SecondaryButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
	title: ReactNode
	height?: number
}

export const SecondaryButton = forwardRef<
	HTMLButtonElement,
	SecondaryButtonProps
>(({ title, height, type = "button", ...rest }, ref) => {
	return (
		<Button ref={ref} type={type} $height={height} {...rest}>
			{title}
		</Button>
	)
})

const Button = styled.button<{ $height?: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${({ $height }) => $height ?? 40}px;
  padding-inline: 16px;
  background: var(--background);
  border: 1px solid var(--primary);
  border-radius: 8px;
  box-shadow: var(--shadow-button-hover);
  color: var(--primary);
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 24px;
  white-space: nowrap;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: var(--hover-primary);
    color: var(--hover-primary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
