import styled from "@emotion/styled"
import backgroundImage from "src/assets/Background-home-page.png"
import logoWithText from "src/assets/logo-with-text-dark.png"
import SpacesContainer from "src/components/SpacesContainer/SpacesContainer"
import HomeFooter from "./HomeFooter"
import PersonalAreaCard from "./PersonalAreaCard"

export default function HomePage() {
	const userName = "יובל" // TODO: fetch the user's name from the auth context or API

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
				<PersonalAreaCard userName={userName} />

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
  padding: 100px 150px;
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
  padding-bottom: 64px;
`

const Logo = styled.img`
  height: 44px;
`

const TitleGroup = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
  color: #030852;
  text-align: end;
`

const MainTitle = styled.span`
  font-size: 64px;
  font-weight: 500;
  line-height: 46px;
  white-space: nowrap;
`

const Subtitle = styled.span`
  font-size: 38px;
  font-weight: 400;
  line-height: 46px;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 48px;
  align-self: stretch;
`
