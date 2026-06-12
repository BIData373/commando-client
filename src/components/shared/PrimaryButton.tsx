import styled from "@emotion/styled"
import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react"
import { Spinner } from "../ui/spinner"

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	title: ReactNode
	height?: number
	width?: number
	loading?: boolean
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
	({ title, height, width, disabled, loading, ...rest }, ref) => {
		return (
			<Button
				ref={ref}
				$height={height}
				$width={width}
				disabled={disabled || loading}
				{...rest}
			>
				{title}
				{loading && <Spinner />}
			</Button>
		)
	},
)

const Button = styled.button<{ $height?: number; $width?: number }>`
  direction: rtl;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${({ $height }) => $height ?? "40"}px;
  width: ${({ $width }) => $width}px;
  padding: 0 15px;
  border: none;
  border-radius: 8px;
  background: var(--default-linear);
  color: white;
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 24px;
  cursor: pointer;
  white-space: nowrap;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
    pointer-events: none;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.85;
  }
`
