import styled from "@emotion/styled"
import { ArrowLeft } from "lucide-react"
import { InfoFooter } from "../shared/InfoFooter"
import { PrimaryButton } from "../shared/PrimaryButton"

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
				<SystemPreview src="../../public/systemPreview.svg" />
			</Main>
			<Footer />
		</>
	)
}

const Description = styled.p`
	max-width: 35ch;

	margin-bottom: 0.5rem;

	color: var(--Colors-Base-Geekblue-10);
    font-size: clamp(1.25rem, 2vw, 2.25rem);
`
const Invite = styled.p`
	font-size: clamp(0.5rem, 1vw, 1rem);
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

	max-width: clamp(30rem, 50vw, 60rem);
	padding: 10vh var(--accomodation-padding) 7.5vh 0;
`

const Title = styled.h1`
	margin-bottom: 0.5rem;

	line-height: 1.2;
    font-size: clamp(3rem, 5vw, 6rem);
	color: var(--Colors-Base-Geekblue-10);
`

const GradientText = styled.span`
    background: var(--default-linear);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;    
`

const BoldText = styled.span`
    font-weight: 600;
`

const Footer = styled(InfoFooter)`
    margin-top: auto;
    padding: 0 var(--accomodation-padding);
`

const PrimaryBtn = styled(PrimaryButton)`
	padding: 0.5em 1em;

	font-size: clamp(0.75rem, 1.5vw, 1.5rem);
`
