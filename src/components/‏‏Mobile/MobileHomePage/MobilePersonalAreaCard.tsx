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
			<PersonalAreaHeader />
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
  /* height: clamp(140px, 21.2vh, 229px); */
  padding: clamp(12px, 2.2vh, 24px) clamp(24px, 2.5vw, 48px) clamp(16px, 3vh, 32px);
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  align-self: stretch;
  border-radius: 8px;
  background: var(--background);
  box-shadow: var(--card-shadow-default);
  cursor: pointer;

  :hover {
    box-shadow: var(--card-shadow-hover);
  }
`

const Footer = styled.span`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    gap: 10px;
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

// const NewTaskCount = styled.span`
//   direction: rtl;
//   color: rgba(0, 0, 0, 0.45);
//   font-size: clamp(14px, 1vw, 20px);
//   font-weight: 400;
//   line-height: clamp(24px, 3.5vh, 38px);
// `
