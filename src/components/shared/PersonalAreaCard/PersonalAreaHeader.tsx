import styled from "@emotion/styled"
import { useCurrentUser } from "src/hooks/useCurrentUser"

export default function PersonalAreaHeader() {
	const user = useCurrentUser()
	const userName = user.info?.name || user.upn

	return (
		<Header>
			<TitleRow>
				{/* <NewTaskCount>({totalCount} הנחיות חדשות)</NewTaskCount> */}
				<Title>אזור אישי</Title>
			</TitleRow>
			<Greeting>
				<GreetingText>
					שלום <GreetingBold>{userName}</GreetingBold>, באיזור האישי תוכל לצפות
					בכל ההנחיות שקיבלת
				</GreetingText>
			</Greeting>
		</Header>
	)
}

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 4px;
`

const TitleRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 8px;
`

const Title = styled.span`
  color: var(--Color-Subtitle);
  font-size: clamp(22px, 1.6vw, 30px);
  font-weight: 400;
  line-height: clamp(30px, 4.3vh, 46px);
`

const Greeting = styled.div`
  display: flex;
  direction: rtl;
`

const GreetingBold = styled.span`
  color: var(--text-color);
  font-size: clamp(14px, 1vw, 20px);
  font-weight: 500;
  line-height: clamp(20px, 2.6vh, 28px);
`

const GreetingText = styled.span`
  color: var(--text-color);
  font-size: clamp(14px, 1vw, 20px);
  font-weight: 400;
  line-height: clamp(20px, 2.6vh, 28px);
`
