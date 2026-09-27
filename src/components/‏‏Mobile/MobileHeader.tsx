import styled from "@emotion/styled"
import { useNavigate } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import logoIcon from "src/assets/logo-icon.svg"
import { formatMesibaIcon } from "src/utils/icon-utils"

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
			<TitleGroup>
				{icon && <WorkspaceIcon src={formatMesibaIcon(icon)} alt={title} />}
				<Title dir="auto">{title}</Title>
			</TitleGroup>

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

const TitleGroup = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	min-width: 0;
	overflow: hidden;
`

const Title = styled.span`
	font-size: 20px;
	font-weight: 500;
	line-height: 28px;
	color: var(--background);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`

const WorkspaceIcon = styled.img`
	width: 28px;
	height: 28px;
	border-radius: 50%;
	object-fit: cover;
`
