import styled from "@emotion/styled"
import { User } from "lucide-react"
import { TbBook, TbGridDots, TbMessage } from "react-icons/tb"
import BIDataIcon from "src/assets/biData.png"
import { MOBILE_MEDIA_QUERY, useIsMobile } from "src/hooks/use-mobile"
import { STATIC_TOKEN } from "src/utils/env-utils"
import {
	openMoreOfUs,
	openSupportChat,
	openUserGuide,
} from "src/utils/redirect-utils"
import { UserDropdown } from "../UserDropdown"
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip"

interface RootPageFooterProps {
	className?: string
}

export function RootPageFooter({ className }: RootPageFooterProps) {
	const isMobile = useIsMobile()

	return (
		<FooterRoot className={className}>
			<Credits>
				<FooterIcon src={BIDataIcon} alt="BI DATA" />
				<CreditsText>
					<FooterText>{new Date().getFullYear()}©</FooterText>
					<FooterText>וקטור המפקד - פותח ע"י BI DATA</FooterText>
				</CreditsText>
			</Credits>

			<Actions>
				{!isMobile && (
					<OutlineGradientButton onClick={openUserGuide}>
						<GradientText>מארז הדרכה</GradientText>
						<GradientBookIcon size={18} />
					</OutlineGradientButton>
				)}

				{!isMobile && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<IconButton onClick={openMoreOfUs}>
									<TbGridDots size={18} />
								</IconButton>
							</TooltipTrigger>
							<TooltipContent side="top">עוד מאיתנו</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<ContactButton onClick={openSupportChat}>
								<TbMessage size={18} />
								{isMobile && "צור קשר"}
							</ContactButton>
						</TooltipTrigger>
						<TooltipContent side="top">צור קשר</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				{!isMobile && STATIC_TOKEN && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<IconButton>
								<User size={18} />
							</IconButton>
						</DropdownMenuTrigger>
						<UserDropdown />
					</DropdownMenu>
				)}
			</Actions>
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

  ${MOBILE_MEDIA_QUERY} {
    flex-direction: column-reverse;
    align-items: center;
    gap: 32px;
  }
`

const Credits = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;

  ${MOBILE_MEDIA_QUERY} {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
`

const CreditsText = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;

  ${MOBILE_MEDIA_QUERY} {
    gap: 8px;
  }
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

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${MOBILE_MEDIA_QUERY} {
    align-self: stretch;
  }
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

  &:hover {
    background: var(--link-bg-hover);
  }
`

const ContactButton = styled(IconButton)`
  ${MOBILE_MEDIA_QUERY} {
    flex: 1;
    width: auto;
    gap: 8px;
    padding-inline: 15px;
		background: var(--Components-Button-Global-colorFillTertiary, rgba(0, 0, 0, 0.04));
    border: none;
    box-shadow: none;
  }
`
