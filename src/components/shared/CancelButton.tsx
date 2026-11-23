import styled from "@emotion/styled"
import { TEST_IDS } from "src/consts/test-ids"

interface CancleButtonProps {
	title: string
	onClick?(): void
	ref?: React.Ref<HTMLButtonElement>
	testId?: string
}

export const CancelButton = ({
	title,
	onClick,
	ref,
	testId = TEST_IDS.form.cancel,
}: CancleButtonProps) => {
	return (
		<Button data-testid={testId} onClick={onClick} ref={ref}>
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
