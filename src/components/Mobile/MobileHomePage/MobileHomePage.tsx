import styled from "@emotion/styled"
import logoWithText from "src/assets/logo-with-text-dark.png"
import SpacesContainer from "src/components/SpacesContainer/SpacesContainer"
import { RootPageFooter } from "src/components/shared/RootPageFooter"
import MobilePersonalAreaCard from "./MobilePersonalAreaCard"

export default function MobileHomePage() {
	return (
		<PageRoot>
			<TopBar>
				<MainTitle>וקטור המפקד</MainTitle>
				<Logo src={logoWithText} alt="Vector" />
			</TopBar>
			<ContentWrapper>
				<MobilePersonalAreaCard />
				<SpacesContainer />
				<RootPageFooter />
			</ContentWrapper>
		</PageRoot>
	)
}

const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`

const TopBar = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  width: 100%;
  flex-shrink: 0;
  padding: 20px;
	border-bottom: 2px solid red;
	border-bottom: 1px solid var(--Colors-Neutral-Border-colorSplit, rgba(0, 0, 0, 0.06));
`

const Logo = styled.img`
  height: 40px;
`
const MainTitle = styled.span`
  font-size: clamp(20px, 3.3vw, 64px);
  font-weight: 500;
  line-height: clamp(24px, 4.3vh, 46px);
  white-space: nowrap;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(16px, 4.4vh, 48px);
  align-self: stretch;
  flex: 1;
  min-height: 0;
  overflow: scroll;
  padding: clamp(16px, 5.0vh, 100px) clamp(16px, 5.0vw, 150px);
`
