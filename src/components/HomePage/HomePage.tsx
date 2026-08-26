import styled from "@emotion/styled"
import backgroundImage from "src/assets/Background-home-page.png"
import logoWithText from "src/assets/logo-with-text-dark.png"
import SpacesContainer from "src/components/SpacesContainer/SpacesContainer"
import { InfoFooter as HomeFooter } from "../shared/InfoFooter"
import PersonalAreaCard from "./PersonalAreaCard"

export default function HomePage() {
	return (
		<PageRoot>
			<TopBar>
				<TitleGroup>
					<MainTitle>וקטור המפקד</MainTitle>
					<Subtitle>מערכת ניהול הנחיות</Subtitle>
				</TitleGroup>
				<Logo src={logoWithText} alt="Vector" />
			</TopBar>
			<ContentWrapper>
				<PersonalAreaCard />
				<SpacesContainer />
			</ContentWrapper>
			<HomeFooter />
		</PageRoot>
	)
}

const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: clamp(32px, 9.3vh, 100px) clamp(32px, 7.8vw, 150px);
  width: 100%;
  height: 100%;
  background: url(${backgroundImage}) no-repeat bottom left;
  background-size: contain;
  overflow: hidden;
`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-bottom: clamp(24px, 5.9vh, 64px);
  flex-shrink: 0;
`

const Logo = styled.img`
  height: 44px;
`

const TitleGroup = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
  color: var(--Colors-Base-Geekblue-10);
  text-align: end;
`

const MainTitle = styled.span`
  font-size: clamp(32px, 3.3vw, 64px);
  font-weight: 500;
  line-height: clamp(24px, 4.3vh, 46px);
  white-space: nowrap;
`

const Subtitle = styled.span`
  font-size: clamp(20px, 2vw, 38px);
  font-weight: 400;
  line-height: clamp(24px, 4.3vh, 46px);
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 26px;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(16px, 4.4vh, 48px);
  align-self: stretch;
  flex: 1;
  min-height: 0;
`
