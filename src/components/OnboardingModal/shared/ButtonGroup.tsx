import styled from "@emotion/styled"
import type { ReactNode } from "react"

interface ButtonGroupProps {
	children: ReactNode
}

export function ButtonGroup({ children }: ButtonGroupProps) {
	return <StyledContainer>{children}</StyledContainer>
}

const StyledContainer = styled.ul`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
`
