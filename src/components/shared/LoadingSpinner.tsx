import { keyframes } from "@emotion/react"
import styled from "@emotion/styled"

const spin = keyframes`
  to { transform: rotate(360deg); }
`

export const LoadingSpinner = () => {
	return (
		<Container>
			<Spinner />
		</Container>
	)
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid var(--line);
  border-top-color: var(--purple-start);
  animation: ${spin} 0.8s linear infinite;
`
