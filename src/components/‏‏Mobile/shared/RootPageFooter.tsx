import styled from "@emotion/styled"
import { TbMessage } from "react-icons/tb"
import BIDataIcon from "src/assets/biData.png"
import { openSupportChat } from "src/utils/redirect-utils"

interface RootPageFooterProps {
	className?: string
}

export function RootPageFooter({ className }: RootPageFooterProps) {
	return (
		<FooterRoot className={className}>
			<ContactButton onClick={openSupportChat}>
				<TbMessage size={18} />
				צור קשר
			</ContactButton>
			<Credits>
				<FooterIcon src={BIDataIcon} alt="BI DATA" />
				<CreditsText>
					<FooterText>2026©</FooterText>
					<FooterText>וקטור המפקד - פותח ע"י BI DATA</FooterText>
				</CreditsText>
			</Credits>
		</FooterRoot>
	)
}

const Credits = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--Space-Margin-marginXS, 8px);
`

const CreditsText = styled.div`
  display: flex;
  gap: var(--Space-Margin-marginXS, 8px);
`

const FooterRoot = styled.footer`
  direction: ltr;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: clamp(8px, 2.2vh, 24px);
  flex-shrink: 0;
  gap: var(--Space-Margin-marginXL, 32px);
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

const ContactButton = styled.button`
  display: flex;
  padding: 0 var(--Components-Button-Component-paddingInlineLG, 15px);
  min-height: 40px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  background-color: var(--Components-Button-Global-colorFillTertiary, rgba(0, 0, 0, 0.04));
  border-radius: var(--Components-Button-Global-borderRadiusLG, 8px);
`
