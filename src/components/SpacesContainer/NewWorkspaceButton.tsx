import styled from "@emotion/styled"
import { useNavigate } from "@tanstack/react-router"
import { Plus } from "lucide-react"

export default function NewWorkspaceButton() {
	const navigate = useNavigate()

	function handleClick() {
		navigate({ to: "/new-workspace" })
	}

	return (
		<ButtonRoot onClick={handleClick}>
			<ButtonText>בקשה לסביבה חדשה</ButtonText>
			<ButtonIcon size={18} />
		</ButtonRoot>
	)
}

const ButtonRoot = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 15px;
  background: var(--background);
  border: 1px solid var(--primary);
  border-radius: 8px;
  cursor: pointer;
  box-shadow: var(--shadow-button);
  color: var(--primary);

  &:hover {
    border-color: var(--hover-primary);
    color: var(--hover-primary);
  }
`

const ButtonText = styled.span`
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 24px;
  color: inherit;
  white-space: nowrap;
`

const ButtonIcon = styled(Plus)`
  color: inherit;
`
