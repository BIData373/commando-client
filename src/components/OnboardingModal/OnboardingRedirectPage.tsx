import styled from "@emotion/styled"
import { Link } from "@tanstack/react-router"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import { USER_GUIDE_URL } from "src/utils/env-utils"
import { PrimaryButton } from "../shared/PrimaryButton"
import { ButtonGroup } from "./shared/ButtonGroup"
import { GhostButton } from "./shared/GhostButton"

interface OnboardingRedirectPageProps {
	onNext: () => void
	onPrevious: () => void
	onRedirect: () => void
}

export function OnboardingRedirectPage({
	onPrevious,
	onRedirect,
}: OnboardingRedirectPageProps) {
	function handleOpenUserGuide() {
		window.open(USER_GUIDE_URL, "_blank")
	}
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
						<Card src="../../public/toPersonalSpace.svg" />
					</Link>
					<Link to="/new-workspace" onClick={onRedirect}>
						<Card src="../../public/createWorkspace.svg" />
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
					<GuideLink onClick={handleOpenUserGuide}>למארז ההדרכה</GuideLink>
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
    font-size: clamp(1.75rem, 2.5vw, 3rem);
    font-weight: 600;
    color: var(--Colors-Base-Geekblue-10);
`

const SubTitle = styled.p`
    font-size: clamp(1rem, 2vw, 2.25rem);
    color: var(--Colors-Base-Geekblue-10);
`
const Footer = styled.footer`
    display: flex;
    align-items:  center;
    justify-content: space-between;

    padding: 0 var(--accomodation-padding);
`

const CardGroup = styled(ButtonGroup)`
	flex: 1;
    gap: 3rem;
`
const PrimaryBtn = styled(PrimaryButton)`
    padding: 0.5em 1em;

    font-size: var(--fs-base);
`

const Notice = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: clamp(0.5rem, 1vw, 1.25rem);
    font-weight: 400;
    color: var(--text-color-400);
`

const Help = styled.p`
    font-size: clamp(0.5rem, 1vw, 1.25rem);
`

const GuideLink = styled.a`
cursor: pointer;
  color: var(--Components-Upload-Global-colorPrimary);

  &:hover {
    color: var(--button-color-hover);
  }

  &:visited {
    color: #0958D9;
  }
`

const Card = styled.img`
	height: 40vh;
    cursor: pointer;
    transition: box-shadow 0.4s;

    &:hover {
        box-shadow: var(--card-shadow);
    }
`
