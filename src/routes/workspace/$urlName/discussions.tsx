import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { DiscussionsLayout } from "../../../components/Discussions/DiscussionsLayout"
import { WorkspaceTabs } from "../../../components/WorkspaceTabs"

export enum DiscussionsView {
	CALENDAR = "CALENDAR",
	CARDS = "CARDS",
}

const DiscussionsSearchSchema = z.object({
	view: z.enum(DiscussionsView).default(DiscussionsView.CALENDAR),
})

export const Route = createFileRoute("/workspace/$urlName/discussions")({
	component: DiscussionsPage,
	validateSearch: DiscussionsSearchSchema,
})

function DiscussionsPage() {
	const { view } = Route.useSearch()
	const navigate = Route.useNavigate()

	function handleViewChange(newView: DiscussionsView) {
		navigate({ search: { view: newView } })
	}

	return (
		<>
			<WorkspaceTabs />
			<DiscussionsLayout view={view} onViewChange={handleViewChange} />
		</>
	)
}
