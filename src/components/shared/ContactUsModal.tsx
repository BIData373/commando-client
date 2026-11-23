import styled from "@emotion/styled"
import type { ReactNode } from "react"
import { TbPhone } from "react-icons/tb"
import BIDataIcon from "src/assets/biData.png"
import contactUsIllustration from "src/assets/contact-us.png"
import chatIcon from "src/assets/icons/chat.svg"
import { Dialog, DialogTrigger } from "src/components/ui/dialog"
import { SUPPORT_PHONE } from "src/utils/env-utils"
import { openSupportChat } from "src/utils/redirect-utils"
import { ModalContent } from "./ModalContent"

interface ContactUsModalProps {
	trigger: ReactNode
}

export function ContactUsModal({ trigger }: ContactUsModalProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<Panel headerPadding={0}>
				<Illustration src={contactUsIllustration} alt="" />

				<Body>
					<TextBlock>
						<Title>דברו איתנו</Title>
						<Description>
							נתקלתם בבעיה? משהו לא עובד?
							<br />
							יש לך רעיון שיכול להקפיץ אותנו?
						</Description>
					</TextBlock>

					<Channels>
						{SUPPORT_PHONE && (
							<>
								<Channel>
									<PhoneIcon size={18} />
									<PhoneNumber>{SUPPORT_PHONE}</PhoneNumber>
								</Channel>

								<Divider />
							</>
						)}

						<ChatLink onClick={openSupportChat}>
							<ChatIcon src={chatIcon} alt="" />
							לפנייה בצ׳אט
						</ChatLink>
					</Channels>
				</Body>

				<Credit>
					<CreditLogo src={BIDataIcon} alt="BI DATA" />
					<CreditText>פותח ע״י פלוגת BI DATA</CreditText>
				</Credit>
			</Panel>
		</Dialog>
	)
}

const Panel = styled(ModalContent)`
  align-items: center;
  width: 880px;
  max-width: 95vw;
  max-height: 95vh;
  padding-block: 24px 16px;
  overflow-y: auto;
  border: none;
  border-radius: 8px;
`

const Illustration = styled.img`
  width: 372px;
  max-width: 100%;
  height: 248px;
  object-fit: contain;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
`

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  text-align: center;
`

const Title = styled.h2`
  margin: 0;
  font-size: var(--fs-heading-2);
  font-weight: 500;
  line-height: 38px;
  color: var(--text-color-2);
`

const Description = styled.p`
  margin: 0;
  font-size: var(--fs-xl);
  line-height: 32px;
  color: var(--sea-ink-soft);
`

const Channels = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const Channel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const PhoneIcon = styled(TbPhone)`
  color: var(--Colors-Base-Red-6);
`

const PhoneNumber = styled.span`
  font-size: var(--fs-base);
  line-height: 24px;
  color: var(--sea-ink-soft);
`

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: var(--line);
`

const ChatLink = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0;
  border: none;
  background: none;
  font-size: var(--fs-base);
  line-height: 24px;
  color: var(--active-color);
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`

const ChatIcon = styled.img`
  width: 22px;
  height: 22px;
`

const Credit = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  margin-block-start: 36px;
  padding-inline: 36px;
`

const CreditLogo = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`

const CreditText = styled.span`
  font-size: var(--fs-btn);
  color: var(--sea-ink-soft);
`
