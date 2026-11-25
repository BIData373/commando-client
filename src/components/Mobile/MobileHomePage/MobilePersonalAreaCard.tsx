import styled from "@emotion/styled"
import { useNavigate } from "@tanstack/react-router"
import { useListPersonalTaskRows } from "src/api/task/task"
import PersonalAreaButton from "src/components/shared/PersonalAreaCard/PersonalAreaButton"
import PersonalAreaHeader from "src/components/shared/PersonalAreaCard/PersonalAreaHeader"
import PersonalAreaStats from "src/components/shared/PersonalAreaCard/PersonalAreaStats"
import { TEST_IDS } from "src/consts/test-ids"

export default function MobilePersonalAreaCard() {
	const navigate = useNavigate()
	function handleNavigateToPersonal() {
		navigate({ to: "/personal" })
	}

	const { data: allTaskRows = [] } = useListPersonalTaskRows({
		isArchived: false,
	})
	const totalCount = allTaskRows.length

	return (
		<CardRoot
			data-testid={TEST_IDS.home.personalCard}
			onClick={handleNavigateToPersonal}
		>
			<PersonalAreaHeader taskRows={allTaskRows} />
			<Footer>
				{totalCount > 0 ? (
					<StatsRow>
						<PersonalAreaStats taskRows={allTaskRows} />
					</StatsRow>
				) : (
					<EmptyText>טרם קיבלת הנחיות</EmptyText>
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
  justify-content: center;
  gap: 8px;

  > * {
    flex: 1;
  }
`

const EmptyText = styled.span`
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 28px;
  color: var(--text-color-2);
  direction: rtl;
  white-space: nowrap;
`
