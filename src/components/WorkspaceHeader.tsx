import styled from "@emotion/styled"
import { useRenderInHeader } from "src/providers/HeaderProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { formatMesibaIcon } from "src/utils/icon-utils"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip"

export function WorkspaceHeader() {
	const {
		workspace: { icon, title },
	} = useWorkspace()

	useRenderInHeader(
		"center",
		<>
			{icon && (
				<WorkspaceIcon src={formatMesibaIcon(icon)} alt="Workspace icon" />
			)}

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<TooltipTrigger asChild>
							<WorkspaceName>{title}</WorkspaceName>
						</TooltipTrigger>
						<TooltipContent>{title}</TooltipContent>
					</TooltipTrigger>
				</Tooltip>
			</TooltipProvider>
		</>,
		[icon, title],
	)

	return null
}

const WorkspaceName = styled.p`
  margin: 0;
  font-size: var(--fs-heading-3);
  font-weight: 500;
  line-height: 32px;
  color: #C7C9CB;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`

const WorkspaceIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`
