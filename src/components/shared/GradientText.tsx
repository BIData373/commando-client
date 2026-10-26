import styled from "@emotion/styled"
import type React from "react"

interface GradientTextProps extends React.PropsWithChildren {}

export function GradientText({ children }: GradientTextProps) {
	return <StyledText>{children}</StyledText>
}

const StyledText = styled.span`
    background: var(--default-linear);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;    
`
