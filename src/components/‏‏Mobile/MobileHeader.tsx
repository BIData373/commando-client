import styled from "@emotion/styled"
import { useNavigate, useRouter } from "@tanstack/react-router"
import { ArrowLeft, ChevronRight } from "lucide-react"
import logoIcon from "src/assets/logo-with-text.svg"
import WorkspaceIconTitle from "src/components/shared/WorkspaceIconTitle"

interface MobileHeaderProps {
	icon?: string | null
	title: string
	minimal?: boolean
	backRedirect?: boolean
}

export default function MobileHeader({
	icon,
	title,
	minimal,
	backRedirect,
}: MobileHeaderProps) {
	const navigate = useNavigate()
	const router = useRouter()

	function onBack() {
		router.history.back()
	}

	function handleLogoClick() {
		navigate({ to: "/" })
	}

	return minimal ? (
		<MinimalRoot>
			<ChevronButton onClick={handleLogoClick}>
				<ChevronRight size={18} />
			</ChevronButton>
		</MinimalRoot>
	) : backRedirect ? (
		<HeaderRoot $isWithoutSpaceBetween={backRedirect}>
			<BackRedirect onClick={onBack}>
				חזרה
				<ArrowLeft size={18} />
			</BackRedirect>
		</HeaderRoot>
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

const HeaderRoot = styled.header<{ $isWithoutSpaceBetween?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: ${({ $isWithoutSpaceBetween }) => ($isWithoutSpaceBetween ? "flex-end" : "space-between")};
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

const BackRedirect = styled.button`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	color: var(--Text-color-text);
`
