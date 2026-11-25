import styled from "@emotion/styled"
import { Plus } from "lucide-react"
import {
	type ComponentPropsWithoutRef,
	forwardRef,
	type ReactNode,
} from "react"
import { PrimaryButton } from "./PrimaryButton"

interface CreateButtonProps
	extends Omit<ComponentPropsWithoutRef<typeof PrimaryButton>, "title"> {
	label: string
	endIcon?: ReactNode
}

export const CreateButton = forwardRef<HTMLButtonElement, CreateButtonProps>(
	({ label, endIcon, ...rest }, ref) => {
		return (
			<StyledButton
				ref={ref}
				title={
					<>
						<Plus size={18} />
						{label}
						{endIcon}
					</>
				}
				{...rest}
			/>
		)
	},
)

const StyledButton = styled(PrimaryButton)`
  min-width: 142px;
`
