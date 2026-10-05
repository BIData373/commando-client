import styled from "@emotion/styled"
import { useNavigate } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import logoIcon from "src/assets/logo-icon.svg"
import WorkspaceIconTitle from "src/components/shared/WorkspaceIconTitle"

interface MobileHeaderProps {
	icon?: string | null
	title: string
	minimal?: boolean
}

export default function MobileHeader({
	icon,
	title,
	minimal,
}: MobileHeaderProps) {
	const navigate = useNavigate()

	function handleLogoClick() {
		navigate({ to: "/" })
	}

	return minimal ? (
		<MinimalRoot>
			<ChevronButton onClick={handleLogoClick}>
				<ChevronRight size={18} />
			</ChevronButton>
		</MinimalRoot>
	) : (
		<HeaderRoot>
			<StyledWorkspaceIconTitle
				icon={icon}
				title={title}
				iconSize={28}
				rounded
			/>

			<Logo src={logoIcon} alt="Vector" onClick={handleLogoClick} />
		</HeaderRoot>
	)
}

const HeaderRoot = styled.header`
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 64px;
	padding: 0 16px;
	background: var(--header-bg);
	flex-shrink: 0;
`

const MinimalRoot = styled.header`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	height: 40px;
	padding: 0 15px;
	background: var(--background-mobile);
	flex-shrink: 0;
`

const ChevronButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	background: none;
	border: none;
	padding: 0;
	color: var(--sea-ink);

	&:active {
		opacity: 0.7;
	}
`

const Logo = styled.img`
	height: 24px;

	&:active {
		opacity: 0.7;
	}
`

const StyledWorkspaceIconTitle = styled(WorkspaceIconTitle)`
	overflow: hidden;
	font-size: 20px;
	font-weight: 500;
	line-height: 28px;
	color: var(--background);
`
