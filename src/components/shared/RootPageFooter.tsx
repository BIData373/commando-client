import styled from "@emotion/styled"
import { User } from "lucide-react"
import { TbBook, TbGridDots, TbMessage } from "react-icons/tb"
import BIDataIcon from "src/assets/biData.png"
import {
	CHAT_CHANNEL_URL,
	PORTAL_CATALOG_URL,
	STATIC_TOKEN,
	USER_GUIDE_URL,
} from "src/utils/env-utils"
import { UserDropdown } from "../UserDropdown"
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu"

interface RootPageFooterProps {
	className?: string
}

export function RootPageFooter({ className }: RootPageFooterProps) {
	function handleOpenUserGuide() {
		window.open(USER_GUIDE_URL, "_blank")
	}

	function handleOpenPortalCatalog() {
		window.open(PORTAL_CATALOG_URL, "_blank")
	}

	function handleOpenChatChannel() {
		window.open(CHAT_CHANNEL_URL, "_blank")
	}

	return (
		<FooterRoot className={className}>
			<FooterLeft>
				<FooterIcon src={BIDataIcon} alt="BI DATA" />
				<FooterText>2026©</FooterText>
				<FooterText>וקטור המפקד - פותח ע"י BI DATA</FooterText>
			</FooterLeft>

			<FooterRight>
				<OutlineGradientButton onClick={handleOpenUserGuide}>
					<GradientText>מארז הדרכה</GradientText>
					<GradientBookIcon size={18} />
				</OutlineGradientButton>

				<IconButton onClick={handleOpenPortalCatalog}>
					<TbGridDots size={18} />
				</IconButton>

				<IconButton onClick={handleOpenChatChannel}>
					<TbMessage size={18} />
				</IconButton>

				{STATIC_TOKEN && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<IconButton>
								<User size={18} />
							</IconButton>
						</DropdownMenuTrigger>
						<UserDropdown />
					</DropdownMenu>
				)}
			</FooterRight>
		</FooterRoot>
	)
}

const FooterRoot = styled.footer`
  direction: ltr;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  padding-top: clamp(8px, 2.2vh, 24px);
  flex-shrink: 0;
`

const FooterLeft = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
`

const FooterIcon = styled.img`
  width: 45px;
  height: 45px;
  object-fit: contain;
`

const FooterText = styled.span`
  direction: rtl;
  font-size: clamp(14px, 1vw, 20px);
  font-weight: 400;
  line-height: clamp(20px, 2.5vh, 27px);
  color: var(--text-color-2);
  white-space: nowrap;
`

const FooterRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const OutlineGradientButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding-inline: 16px;
  background: var(--background);
  border: 1px solid var(--primary);
  border-radius: 8px;
  cursor: pointer;
  box-shadow: var(--shadow-button-hover);
  color: var(--primary);

  &:hover {
    border-color: var(--hover-primary);
    color: var(--hover-primary);
  }
`

const GradientText = styled.span`
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 24px;
  color: inherit;
  white-space: nowrap;
`

const GradientBookIcon = styled(TbBook)`
  color: inherit;
`

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--background);
  border: 1px solid var(--card-border);
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-color-2);
  box-shadow: var(--shadow-button);

  :hover{
    background: var(--link-bg-hover);
  }
`
