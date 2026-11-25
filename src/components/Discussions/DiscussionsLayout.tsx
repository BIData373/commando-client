import styled from "@emotion/styled"
import { TEST_IDS } from "../../consts/test-ids"
import { DiscussionsView } from "../../routes/workspace/$urlName/discussions"
import { CreateButton } from "../shared/CreateButton"
import { ViewToggle, type ViewToggleOption } from "../shared/ViewToggle"
import { DiscussionsToolbar } from "./DiscussionsToolbar"

const VIEW_OPTIONS: ViewToggleOption<DiscussionsView>[] = [
	{
		value: DiscussionsView.CARDS,
		label: "כרטיסיות",
		testId: TEST_IDS.discussions.viewToggleCards,
	},
	{
		value: DiscussionsView.CALENDAR,
		label: "לוח שנה",
		testId: TEST_IDS.discussions.viewToggleCalendar,
	},
]

interface DiscussionsLayoutProps {
	view: DiscussionsView
	onViewChange: (view: DiscussionsView) => void
}

export function DiscussionsLayout({
	view,
	onViewChange,
}: DiscussionsLayoutProps) {
	return (
		<Root data-testid={TEST_IDS.discussions.page}>
			<DiscussionsToolbar
				startContent={
					<ViewToggle
						options={VIEW_OPTIONS}
						view={view}
						onViewChange={onViewChange}
					/>
				}
				endContent={
					<CreateButton
						data-testid={TEST_IDS.discussions.createButton}
						label="צור דיון"
					/>
				}
			/>
		</Root>
	)
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  padding-block: 24px;
  box-sizing: border-box;
  overflow: hidden;
`
