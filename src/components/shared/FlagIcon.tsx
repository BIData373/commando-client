import type { IconBaseProps } from "react-icons/lib"
import { TbFlag } from "react-icons/tb"

function FlagIcon({ size = 16, ...props }: IconBaseProps) {
	return (
		<TbFlag
			size={size}
			color="var(--Colors-Brand-Warning-colorWarningText)"
			{...props}
		/>
	)
}

export default FlagIcon
