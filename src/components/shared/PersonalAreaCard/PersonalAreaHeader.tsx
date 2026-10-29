import styled from "@emotion/styled"
import { useCurrentUser } from "src/hooks/useCurrentUser"

interface PersonalAreaHeaderProps {
	totalTaskRowCount: number
}

export default function PersonalAreaHeader({
	totalTaskRowCount,
}: PersonalAreaHeaderProps) {
	const user = useCurrentUser()
	const username = user.info?.name || user.upn

	return (
		<Header>
			<TitleRow>
				{totalTaskRowCount > 0 && (
					<NewTaskCount>({totalTaskRowCount} הנחיות חדשות)</NewTaskCount>
				)}
				<Title>אזור אישי</Title>
			</TitleRow>
			<Greeting>
				<GreetingText>
					שלום <GreetingBold>{username}</GreetingBold>, באיזור האישי תוכל לצפות
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
  align-items: center;
  gap: 8px;
`

const Title = styled.span`
  color: var(--Color-Subtitle);
  font-size: clamp(20px, 1.6vw, 30px);
  font-weight: 700;
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

const NewTaskCount = styled.span`
  direction: rtl;
  color: var(--text-color-400);
  font-size: clamp(14px, 1vw, 20px);
  font-weight: 400;
  line-height: clamp(24px, 3.5vh, 38px);
`
