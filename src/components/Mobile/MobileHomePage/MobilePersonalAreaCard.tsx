import styled from "@emotion/styled"
import { useNavigate } from "@tanstack/react-router"
import { useListPersonalTaskRows } from "src/api/task/task"
import PersonalAreaButton from "src/components/shared/PersonalAreaCard/PersonalAreaButton"
import PersonalAreaHeader from "src/components/shared/PersonalAreaCard/PersonalAreaHeader"
import PersonalAreaStats from "src/components/shared/PersonalAreaCard/PersonalAreaStats"
import { TasksView } from "src/routes/workspace/$urlName/tasks"

export default function MobilePersonalAreaCard() {
	const navigate = useNavigate()
	function handleNavigateToPersonal() {
		navigate({ to: "/personal", search: { view: TasksView.TABLE } })
	}

	const { data: allTaskRows = [] } = useListPersonalTaskRows({
		isArchived: false,
	})
	const totalCount = allTaskRows.length

	return (
		<CardRoot onClick={handleNavigateToPersonal}>
			<PersonalAreaHeader totalTaskRowCount={totalCount} />
			<Footer>
				{totalCount > 0 ? (
					<StatsRow>
						<PersonalAreaStats taskRows={allTaskRows} />
					</StatsRow>
				) : (
					<EmptyText>טרם שויכו אליך משימות</EmptyText>
				)}
				<PersonalAreaButton />
			</Footer>
		</CardRoot>
	)
}

const CardRoot = styled.div`
  direction: ltr;
  display: flex;
  padding: 16px;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  align-self: stretch;
  border-radius: 8px;
  background: var(--background);
  box-shadow: var(--card-shadow-default);
  cursor: pointer;
  gap: 16px;

  :hover {
    box-shadow: var(--card-shadow-hover);
  }
`

const Footer = styled.span`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    gap: 16px;
`

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const EmptyText = styled.span`
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 28px;
  color: var(--text-color-2);
  direction: rtl;
  white-space: nowrap;
`
