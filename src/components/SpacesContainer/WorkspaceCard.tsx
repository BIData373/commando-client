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
}

export default function WorkspaceCard({
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
		<CardRoot onClick={handleWorkspaceClick}>
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
				<BigAvatarImage src={formatMesibaIcon(icon)} alt={title} />
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
  width: 205px;
  height: 219px;
  padding: 16px;
  flex-direction: column;
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
  justify-content: flex-end;
  width: 100%;
  min-height: 16px;
`

const PermissionBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
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
  width: 85px;
  height: 119px;
`

const BigAvatarImage = styled(MesibaAvatarImage)`
  object-fit: contain;
`

const WorkspaceInitials = styled(MesibaAvatarFallback)`
  font-size: var(--fs-heading-1);
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
