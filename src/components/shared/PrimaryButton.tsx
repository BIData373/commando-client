import styled from "@emotion/styled"
import { Spinner } from "../ui/spinner"

interface PrimaryButtonProps {
	onClick?(): void
	title: string
	tail?: React.ReactNode
	height?: number
	width?: number
	disabled?: boolean
	loading?: boolean
}

export const PrimaryButton = ({
	onClick,
	title,
	tail,
	height,
	width,
	disabled,
	loading,
}: PrimaryButtonProps) => {
	return (
		<Button
			onClick={onClick}
			$height={height}
			$width={width}
			disabled={disabled || loading}
		>
			{title}
			{tail}
			{loading && <Spinner />}
		</Button>
	)
}

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
