import styled from "@emotion/styled"
import type React from "react"
import { GradientText } from "./GradientText"

interface GhostButtonProps extends React.PropsWithChildren {
	onClick: () => void
}

export function GhostButton({ children, onClick }: GhostButtonProps) {
	return (
		<GradientBorderBtn onClick={onClick}>
			<GradientText>{children}</GradientText>
		</GradientBorderBtn>
	)
}

const GradientBorderBtn = styled.button`
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0.5rem 1rem;
    border-radius: 8px;

    background: transparent;

    font-size: var(--fs-base);
    line-height: 24px;
    cursor: pointer;
    

    border: 1px solid transparent;
    background-image: 
        linear-gradient(var(--background), var(--background)), 
        var(--default-linear);
    background-origin: border-box;
    background-clip: padding-box, border-box;

    background-clip: padding-box, border-box;
`
