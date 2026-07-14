import styled from "@emotion/styled"
import { TbBook, TbGridDots, TbMessage } from "react-icons/tb"
import BIDataIcon from "src/assets/biData.png"
import {
	CHAT_CHANNEL_URL,
	PORTAL_CATALOG_URL,
	USER_GUIDE_URL,
} from "src/utils/env-utils"

export default function HomeFooter() {
	function handleOpenLink(url: string) {
		window.open(url, "_blank")
	}

	return (
		<FooterRoot>
			<FooterLeft>
				<FooterIcon src={BIDataIcon} alt="BI DATA" />
				<FooterText>2026©</FooterText>
				<FooterText>וקטור המפקד - פותח ע"י BI DATA</FooterText>
			</FooterLeft>

			<FooterRight>
				<OutlineGradientButton onClick={() => handleOpenLink(USER_GUIDE_URL)}>
					<GradientText>מארז הדרכה</GradientText>
					<GradientBookIcon size={18} />
				</OutlineGradientButton>

				<IconButton onClick={() => handleOpenLink(PORTAL_CATALOG_URL)}>
					<TbGridDots size={18} />
				</IconButton>

				<IconButton onClick={() => handleOpenLink(CHAT_CHANNEL_URL)}>
					<TbMessage size={18} />
				</IconButton>
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
  padding-top: 24px;
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
  font-size: 20px;
  font-weight: 400;
  line-height: 27px;
  color: rgba(0, 0, 0, 0.88);
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
  background: white;
  border: 1px solid #6866ff;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 0 rgba(5, 145, 255, 0.1);
  color: #6866ff;

  &:hover {
    border-color: #9a99ff;
    color: #9a99ff;
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
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.88);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);

  :hover{
    background: var(--link-bg-hover);
  }
`
