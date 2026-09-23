import styled from "@emotion/styled"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import Header from "src/components/Header"
import { ContentScrollArea } from "src/components/shared/ContentScrollArea"
import { PageShell } from "src/components/shared/PageShell"
import { useRenderInHeader } from "src/providers/HeaderProvider"

export const Route = createFileRoute("/personal")({
	component: PersonalPage,
})

function PersonalPage() {
	useRenderInHeader("center", "אזור אישי - הנחיות שקיבלתי")

	return (
		<PageShell>
			<StyledHeader />
			<ContentScrollArea>
				<Outlet />
			</ContentScrollArea>
		</PageShell>
	)
}

const StyledHeader = styled(Header)`
	padding-bottom: 24px;
	border-bottom: 2px var(--active-color-button) solid;
	border-image: var(--default-linear) 1;
`
