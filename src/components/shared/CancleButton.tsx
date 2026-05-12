import styled from '@emotion/styled'

interface CancleButtonProps {
    title: string
    onClick?(): void
    ref?: React.Ref<HTMLButtonElement>
}

export const CancleButton = ({ title, onClick, ref }: CancleButtonProps) => {
    return (
        <Button onClick={onClick} ref={ref}>
            {title}
        </Button>
    )
}

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding-inline: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: white;
  color: rgba(0, 0, 0, 0.88);
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
    box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.05);
    pointer-events: none;
  }

  &:hover {
    border-color: var(--button-color-hover);
    color: var(--button-color-hover);
  }
`
