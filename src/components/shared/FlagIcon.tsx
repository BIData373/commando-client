import styled from "@emotion/styled"
import type { IconBaseProps } from "react-icons/lib"
import { TbFlag } from "react-icons/tb"

function FlagIcon({ size = 16, ...props }: IconBaseProps) {
	return <StyledTbFlag size={size} {...props} />
}

export default FlagIcon

const StyledTbFlag = styled(TbFlag)`
  	flex-shrink: 0;
	color: var(--Colors-Brand-Warning-colorWarningText);
`
