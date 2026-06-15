import styled from "@emotion/styled"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import SpacesContainer from "src/components/SpacesContainer/SpacesContainer"
import { UserDropdown } from "src/components/UserDropdown"
import { useRenderInHeader } from "src/providers/HeaderProvider"
import { TasksView } from "src/routes/workspace/$urlName/tasks"

export const Route = createFileRoute("/")({
	component: RouteComponent,
	staticData: {
		header: {
			pageTitle: "סביבות",
			user: false,
		},
	},
})

function RouteComponent() {
	const navigate = useNavigate()

	useRenderInHeader("user", <UserDropdown showPersonalArea={false} />)

	function handlePersonalClick() {
		navigate({ to: "/personal", search: { view: TasksView.TABLE } })
	}

	return (
		<PageRoot>
			<PersonalBanner onClick={handlePersonalClick}>
				<PersonalLabel>אזור אישי</PersonalLabel>
				<PersonalSub>משימות ופעולות אישיות</PersonalSub>
			</PersonalBanner>

			<SpacesContainer />
		</PageRoot>
	)
}

const PageRoot = styled.div`
  padding-block: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const PersonalBanner = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 20px 24px;
  background: var(--chip-bg);
  border: 1px solid var(--chip-line);
  border-radius: 12px;
  cursor: pointer;
  text-align: start;
  transition: background 0.15s;

  &:hover {
    background: var(--link-bg-hover);
  }
`

const PersonalLabel = styled.span`
  font-size: var(--fs-lg);
  font-weight: 600;
  color: var(--sea-ink);
`

const PersonalSub = styled.span`
  font-size: var(--fs-btn);
  color: var(--sea-ink-soft);
`
