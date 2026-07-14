import styled from "@emotion/styled"
import { useNavigate } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { WorkspaceStatusType } from "src/api/model"
import { useListPersonalTaskRows } from "src/api/task/task"
import { PrimaryButton } from "src/components/shared/PrimaryButton"
import { STATUS_DEFAULTS } from "src/functions/status-defaults"
import { TasksView } from "src/routes/workspace/$urlName/tasks"

interface PersonalAreaCardProps {
	userName: string
}

export default function PersonalAreaCard({ userName }: PersonalAreaCardProps) {
	const navigate = useNavigate()
	const { data: allTaskRows = [] } = useListPersonalTaskRows()

	const totalCount = allTaskRows.length

	const completedCount = allTaskRows.filter(
		(t) => t.status?.type === WorkspaceStatusType.COMPLETED,
	).length

	const inProgressCount = allTaskRows.filter(
		(t) => t.status?.type === WorkspaceStatusType.IN_PROGRESS,
	).length

	const notStartedCount = allTaskRows.filter(
		(t) => t.status?.type === WorkspaceStatusType.NOT_STARTED,
	).length

	function handleNavigateToPersonal() {
		navigate({ to: "/personal", search: { view: TasksView.TABLE } })
	}

	return (
		<CardRoot onClick={handleNavigateToPersonal}>
			<Header>
				<TitleRow>
					<NewTaskCount>({totalCount} הנחיות חדשות)</NewTaskCount>
					<Title>אזור אישי</Title>
				</TitleRow>
				<Greeting>
					<GreetingBold>שלום {userName}</GreetingBold>
					<GreetingText>
						, באזור האישי תוכל לצפות בכל ההנחיות שקיבלת
					</GreetingText>
				</Greeting>
			</Header>

			<Footer>
				<PrimaryButton
					title={
						<>
							כניסה לאזור האישי
							<ArrowLeft size={18} />
						</>
					}
					onClick={handleNavigateToPersonal}
				/>

				{totalCount > 0 ? (
					<StatsRow>
						<StatItem>
							<StatNumber>{completedCount}</StatNumber>
							<StatTag
								$color={STATUS_DEFAULTS[WorkspaceStatusType.COMPLETED].color}
							>
								{STATUS_DEFAULTS[WorkspaceStatusType.COMPLETED].name}
							</StatTag>
						</StatItem>
						<StatItem>
							<StatNumber>{inProgressCount}</StatNumber>
							<StatTag
								$color={STATUS_DEFAULTS[WorkspaceStatusType.IN_PROGRESS].color}
							>
								{STATUS_DEFAULTS[WorkspaceStatusType.IN_PROGRESS].name}
							</StatTag>
						</StatItem>
						<StatItem>
							<StatNumber>{notStartedCount}</StatNumber>
							<StatTag
								$color={STATUS_DEFAULTS[WorkspaceStatusType.NOT_STARTED].color}
							>
								{STATUS_DEFAULTS[WorkspaceStatusType.NOT_STARTED].name}
							</StatTag>
						</StatItem>
					</StatsRow>
				) : (
					<EmptyText>טרם שויכו אליך משימות</EmptyText>
				)}
			</Footer>
		</CardRoot>
	)
}

const CardRoot = styled.button`
  direction: ltr;
  display: flex;
  height: 229px;
  padding: 24px 48px 32px 48px;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  align-self: stretch;
  border-radius: 8px;
  background: var(--background);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03),
    0 1px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px 0 rgba(0, 0, 0, 0.02);
  cursor: pointer;

  :hover {
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  }
`

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
  color: #1d293d;
  font-size: 34px;
  font-weight: 400;
  line-height: 46px;
`

const NewTaskCount = styled.span`
  direction: rtl;
  color: rgba(0, 0, 0, 0.45);
  font-size: 20px;
  font-weight: 400;
  line-height: 38px;
`

const Greeting = styled.div`
  display: flex;
  direction: rtl;
`

const GreetingBold = styled.span`
  color: rgba(0, 0, 0, 0.65);
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
`

const GreetingText = styled.span`
  color: rgba(0, 0, 0, 0.65);
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
`

const Footer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
`

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`

const StatNumber = styled.span`
  font-size: 24px;
  font-weight: 400;
  line-height: 32px;
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
`

const EmptyText = styled.span`
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  color: rgba(0, 0, 0, 0.88);
  direction: rtl;
  white-space: nowrap;
`

const StatTag = styled.span<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 76px;
  padding: 1px 8px;
  border-radius: 35px;
  background: rgb(from ${({ $color }) => $color} r g b / 0.1);
  color: ${({ $color }) => $color};
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  white-space: nowrap;
`
