import styled from "@emotion/styled"
import { Link } from "@tanstack/react-router"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import { openUserGuide } from "src/utils/redirect-utils"
import createWorkspace from "../../assets/createWorkspace.svg"
import toPersonalSpace from "../../assets/toPersonalSpace.svg"
import { PrimaryButton } from "../shared/PrimaryButton"
import { ButtonGroup as ButtonGroupPrimitive } from "../ui/button-group"
import { GhostButton } from "./GhostButton"

interface OnboardingRedirectPageProps {
	onPrevious: () => void
	onRedirect: () => void
}

export function OnboardingRedirectPage({
	onPrevious,
	onRedirect,
}: OnboardingRedirectPageProps) {
	return (
		<>
			<Main>
				<Title>מוכנים להתחיל?</Title>
				<SubTitle>
					ניהול הנחיות, עדכון בזמן אמת וסנכרון מלא - ממש עוד רגע אצלכם...
				</SubTitle>
				<CardGroup>
					<Link
						to="/personal/tasks"
						search={{ view: TasksView.TABLE }}
						onClick={onRedirect}
					>
						<Card src={toPersonalSpace} />
					</Link>
					<Link to="/new-workspace" onClick={onRedirect}>
						<Card src={createWorkspace} />
					</Link>
				</CardGroup>
			</Main>
			<Notice>
				לא בטוח מה לבחור? אל דאגה ניתן לבקש הרשאת ניהול או ליצור סביבה חדשה בכל
				עת דרך מסך הבית
			</Notice>
			<Footer>
				<Help>
					עדיין לא הבנתם? לא לדאוג יש לנו מארז הדרכה{" "}
					<GuideLink onClick={openUserGuide}>למארז ההדרכה</GuideLink>
				</Help>
				<ButtonGroup>
					<GhostButton onClick={onPrevious}>חזור</GhostButton>
					<Link to="/">
						<PrimaryBtn onClick={onRedirect} title="למסך הראשי"></PrimaryBtn>
					</Link>
				</ButtonGroup>
			</Footer>
		</>
	)
}

const Main = styled.main`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    padding: 0 var(--accomodation-padding);
`

const Title = styled.h1`
    line-height: 1.2;
    font-size: var(--fs-heading-h1);
    font-weight: 600;
    color: var(--Colors-Base-Geekblue-10);
`

const SubTitle = styled.p`
    font-size: var(--fs-heading-2);
    color: var(--Colors-Base-Geekblue-10);
`
const Footer = styled.footer`
	position: sticky;
	bottom: -48vh;

    display: flex;
    align-items:  center;
    justify-content: space-between;

    padding: 0 var(--accomodation-padding);
`

const CardGroup = styled(ButtonGroupPrimitive)`
	align-self: center;
	flex: 1;
    gap: 3rem;
`
const ButtonGroup = styled(ButtonGroupPrimitive)`
	gap: 1rem;
`

const PrimaryBtn = styled(PrimaryButton)`
    padding: 8px 16px;

    font-size: var(--fs-base);
`

const Notice = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: clamp(8px, 1vw, 20px);
    font-weight: 400;
    color: var(--text-color-400);
`

const Help = styled.p`
    font-size: clamp(8px, 1vw, 20px);
`

const GuideLink = styled.a`
cursor: pointer;
  color: var(--Components-Upload-Global-colorPrimary);

  &:hover {
    color: var(--button-color-hover);
  }

  &:visited {
    color: var(--link-visited);
  }
`

const Card = styled.img`
	height: 30vh;
    cursor: pointer;
    transition: box-shadow 0.4s;

    &:hover {
        box-shadow: var(--card-shadow);
    }
`
