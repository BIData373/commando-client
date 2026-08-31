import styled from "@emotion/styled"
import { useNavigate } from "@tanstack/react-router"
import type { WorkspaceWithPermissionDto } from "src/api/model"
import {
	MesibaAvatarFallback,
	MesibaAvatarImage,
	MesibaAvatarRoot,
} from "src/components/shared/MesibaAvatar"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "src/components/ui/tooltip"
import { getInitials } from "src/utils/avatar-utils"
import { formatMesibaIcon } from "src/utils/icon-utils"
import { PERMISSION_LABEL } from "src/utils/permissions-utils"

interface WorkspaceCardProps {
	workspace: WorkspaceWithPermissionDto
	className?: string
}

export default function WorkspaceCard({
	className,
	workspace: { title, urlName, icon, permissionType },
}: WorkspaceCardProps) {
	const navigate = useNavigate()

	function handleWorkspaceClick() {
		navigate({
			to: "/workspace/$urlName",
			params: { urlName },
		})
	}

	return (
		<CardRoot onClick={handleWorkspaceClick} className={className}>
			<PermissionRow>
				{permissionType && (
					<PermissionBadge>
						<PermissionText>
							מורשה {PERMISSION_LABEL[permissionType]}
						</PermissionText>
						<PermissionDot />
					</PermissionBadge>
				)}
			</PermissionRow>

			<AvatarWrapper>
				<MesibaAvatarImage src={formatMesibaIcon(icon)} alt={title} />
				<WorkspaceInitials>{getInitials(title)}</WorkspaceInitials>
			</AvatarWrapper>

			<Tooltip>
				<TooltipTrigger asChild>
					<TitleText dir="auto">{title}</TitleText>
				</TooltipTrigger>
				<TooltipContent>{title}</TooltipContent>
			</Tooltip>
		</CardRoot>
	)
}

const CardRoot = styled.div`
  display: flex;
  flex-direction: column;
  aspect-ratio: 205 / 219;
  width: 100%;
  padding: 16px;
  align-items: center;
  gap: 12px;
  border-radius: 8px;
  background: var(--background);
  cursor: pointer;
  box-shadow: var(--card-shadow-default);

  &:hover {
	box-shadow: var(--card-shadow-hover);
  }
`

const PermissionRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  min-height: 16px;
`

const PermissionBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  direction: ltr;
`

const PermissionText = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: var(--text-color);
  white-space: nowrap;
`

const PermissionDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--Success-color-success-border-hover);
`

const AvatarWrapper = styled(MesibaAvatarRoot)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 1rem;
  flex: 1;
  min-height: 0;

  &::after  {
    border: none;
  }
`

const WorkspaceInitials = styled(MesibaAvatarFallback)`
  font-size: var(--fs-heading-1);
  height: clamp(60px, 100%, 119px);
  max-width: 85px;
  border: 1px solid var(--ring);
`

const TitleText = styled.span`
  font-size: var(--fs-xl);
  font-weight: 400;
  line-height: 28px;
  color: var(--Color-Subtitle);
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
`
