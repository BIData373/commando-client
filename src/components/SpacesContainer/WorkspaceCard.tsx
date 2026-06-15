import { useNavigate } from "@tanstack/react-router"
import type { WorkspaceDto } from "src/api/model"
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar"
import {
	Card,
	CardAction,
	CardDescription,
	CardHeader,
	CardTitle,
} from "src/components/ui/card"
import { formatMesibaIcon } from "src/utils/icon-utils"

interface WorkspaceCardProps {
	workspace: WorkspaceDto
}

export default function WorkspaceCard({
	workspace: { title, urlName, icon },
}: WorkspaceCardProps) {
	const navigate = useNavigate()

	function handleWorkspaceClick() {
		navigate({
			to: "/workspace/$urlName",
			params: { urlName },
		})
	}

	return (
		<Card className="cursor-pointer" onClick={handleWorkspaceClick}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{/* // FIX Add description */}
				<CardDescription>{title}</CardDescription>

				<CardAction>
					<Avatar>
						<AvatarImage src={formatMesibaIcon(icon)} alt={title} />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</CardAction>
			</CardHeader>
			{/* // FIX Check if needed */}
			{/* <CardFooter>{memberCount} משתמשים</CardFooter> */}
		</Card>
	)
}
