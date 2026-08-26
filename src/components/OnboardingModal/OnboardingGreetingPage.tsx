import styled from "@emotion/styled"
import { ArrowLeft } from "lucide-react"
import systemPreview from "../../assets/systemPreview.svg"
import { PrimaryButton } from "../shared/PrimaryButton"
import { RootPageFooter } from "../shared/RootPageFooter"
import { GradientText } from "./GradientText"

interface OnboardingGreetingPageProps {
	onNext: () => void
}

export function OnboardingGreetingPage({
	onNext,
}: OnboardingGreetingPageProps) {
	return (
		<>
			<Main>
				<Greeting>
					<Title>
						<BoldText>
							מערכת לניהול
							<br /> ומעקב אחר <GradientText>הנחיות</GradientText>
						</BoldText>
					</Title>
					<Description>
						<BoldText>מערכת וקטור המפקד </BoldText>
						<br />
						מאפשרת ניהול סביבות עבודה, מעקב אחר סטטוס הנחיות וסנכרון מלא בין
						המפקד והפקודים
					</Description>
					<PrimaryBtn
						onClick={onNext}
						title={
							<>
								בואו נתחיל <ArrowLeft size={18} />
							</>
						}
					></PrimaryBtn>
					<Invite>
						הצטרפו ל200+ מפקדים שכבר מנהלים את ההנחיות שלהם במערכת
					</Invite>
				</Greeting>
				<SystemPreview src={systemPreview} />
			</Main>
			<Footer />
		</>
	)
}

const Description = styled.p`
	max-width: 35ch;

	margin-bottom: 0.5rem;

	color: var(--Colors-Base-Geekblue-10);
    font-size: clamp(8px, 2vw, 36px);
`
const Invite = styled.p`
	font-size: var(--fs-base);
	font-weight: 400;
    color: var(--text-color-400);
`

const Main = styled.main`
    display: flex;
    justify-content: space-between;
    gap: 2rem;
`

const SystemPreview = styled.img`
    max-width: 37vw;
`

const Greeting = styled.section`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 1rem;

	max-width: clamp(200px, 55vw, 900px);
	padding: 10vh var(--accomodation-padding) 7.5vh 0;
`

const Title = styled.h1`
	margin-bottom: 0.5rem;

	line-height: 1.2;
    font-size: clamp(32px, 4.5vw, 96px);
	color: var(--Colors-Base-Geekblue-10);
`

const BoldText = styled.span`
    font-weight: 600;
`

const Footer = styled(RootPageFooter)`
	position: sticky;
	bottom: -48vh;
	
    margin-top: auto;
    padding: 0 var(--accomodation-padding);
`

const PrimaryBtn = styled(PrimaryButton)`
	padding: 8px 16px;

	font-size: var(--fs-heading-3);
`
