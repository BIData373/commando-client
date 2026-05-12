import styled from '@emotion/styled'

interface PrimaryButtonProps {
  onClick?(): void
  title: string
  header?: React.ReactNode
  tail?: React.ReactNode
  height?: number
  width?: number
  disabled?: boolean
}

export const PrimaryButton = ({ onClick, title, header, tail, height, width, disabled }: PrimaryButtonProps) => {
  return (
    <Button onClick={onClick} $height={height} $width={width} disabled={disabled}>
      {header}
      {title}
      {tail}
    </Button>
  )
}

const Button = styled.button<{ $height?: number, $width?: number }>`
  direction: rtl;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${({ $height }) => $height ?? '40'}px;
  width: ${({ $width }) => $width}px;
  padding: 0 15px;
  border: none;
  border-radius: 8px;
  background: var(--gradient);
  color: white;
  font-family: 'Rubik', sans-serif;
  font-size: 16px;
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