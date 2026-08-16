import styled from "@emotion/styled"

interface CancleButtonProps {
	title: string
	onClick?(): void
	ref?: React.Ref<HTMLButtonElement>
}

export const CancelButton = ({ title, onClick, ref }: CancleButtonProps) => {
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
  border-radius: 8px;
  background: white;
  border: 1px solid var(--card-border);
  color: rgba(0, 0, 0, 0.88);
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 24px;
  cursor: pointer;
  white-space: nowrap;
  position: relative;

  &:hover {
    background: var(--button-hover);
  }

  &:active {
    background: var(--button-active);
  }
`
