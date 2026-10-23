import styled from "@emotion/styled"
import { X } from "lucide-react"
import type { ReactNode } from "react"
import { Drawer, DrawerContent, DrawerTrigger } from "src/components/ui/drawer"

interface MobileDrawerProps extends React.PropsWithChildren {
	open?: boolean
	onOpenChange?(open: boolean): void
	title: string
	trigger?: ReactNode
	className?: string
}

export function MobileDrawer({
	title,
	open,
	onOpenChange,
	children,
	trigger = null,
	className,
}: MobileDrawerProps) {
	function handleClose() {
		onOpenChange?.(false)
	}

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			{trigger && <StyledDrawerTrigger>{trigger}</StyledDrawerTrigger>}
			<StyledDrawerContent className={className}>
				<Header>
					<HeaderTitle>{title}</HeaderTitle>
					<CloseButton onClick={handleClose}>
						<X size={16} />
					</CloseButton>
				</Header>
				{children}
			</StyledDrawerContent>
		</Drawer>
	)
}

const StyledDrawerContent = styled(DrawerContent)`
    border: none;
    outline: none;
	padding-bottom: 1rem;
`

const StyledDrawerTrigger = styled(DrawerTrigger)`
	width: 100%;
`

const CloseButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: var(--sea-ink);
`

const Header = styled.header`
    display: flex;
    align-items: center;
    padding: 1.5rem 1.5rem 1rem;
    border-bottom: 1px solid var(--button-hover);
    box-shadow: var(--card-shadow-default);
`

const HeaderTitle = styled.span`
    align-self: flex-start;
    flex: 1;
    font-size: var(--fs-base);
    font-weight: 400;
    color: var(--sea-ink);
`
