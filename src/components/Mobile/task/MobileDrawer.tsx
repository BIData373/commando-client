import styled from "@emotion/styled"
import { X } from "lucide-react"
import type { ReactNode } from "react"
import { Drawer, DrawerContent, DrawerTrigger } from "src/components/ui/drawer"

interface MobileDrawerProps extends React.PropsWithChildren {
	open?: boolean
	onOpenChange?(): void
	title: string
	trigger?: ReactNode
}

export function MobileDrawer({
	title,
	open,
	onOpenChange,
	children,
	trigger = null,
}: MobileDrawerProps) {
	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			{trigger && <StyledDrawerTrigger>{trigger}</StyledDrawerTrigger>}
			<StyledDrawerContent>
				<CommentsHeader>
					<CommentsHeaderTitle>{title}</CommentsHeaderTitle>
					<CloseButton onClick={onOpenChange}>
						<X size={16} />
					</CloseButton>
				</CommentsHeader>
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

const CommentsHeader = styled.header`
    display: flex;
    align-items: center;
    padding: 1.5rem 1.5rem 1rem;
    border-bottom: 1px solid var(--button-hover);
    box-shadow: var(--card-shadow-default);
`

const CommentsHeaderTitle = styled.span`
    align-self: flex-start;
    flex: 1;
    font-size: var(--fs-base);
    font-weight: 400;
    color: var(--sea-ink);
`
