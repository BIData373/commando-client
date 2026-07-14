import styled from "@emotion/styled"
import { useNavigate } from "@tanstack/react-router"
import type { WorkspaceDto } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import {
	MesibaAvatarFallback,
	MesibaAvatarImage,
	MesibaAvatarRoot,
} from "src/components/shared/MesibaAvatar"
import { PERMISSION_LABEL } from "src/components/UserDropdown"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "src/components/ui/tooltip"
import { getInitials } from "src/utils/avatar-utils"
import { formatMesibaIcon } from "src/utils/icon-utils"

interface WorkspaceCardProps {
	workspace: WorkspaceDto
}

export default function WorkspaceCard({
	workspace: { id, title, urlName, icon },
}: WorkspaceCardProps) {
	const navigate = useNavigate()
	const { data: myPermission } = useGetMyPermission({ workspaceId: id })

	function handleWorkspaceClick() {
		navigate({
			to: "/workspace/$urlName",
			params: { urlName },
		})
	}

	return (
		<CardRoot onClick={handleWorkspaceClick}>
			<PermissionRow>
				{myPermission && (
					<PermissionBadge>
						<PermissionText>
							מורשה {PERMISSION_LABEL[myPermission.type]}
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
					<TitleText>{title}</TitleText>
				</TooltipTrigger>
				<TooltipContent>{title}</TooltipContent>
			</Tooltip>
		</CardRoot>
	)
}

const CardRoot = styled.div`
  display: flex;
  width: 205px;
  padding: 16px;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03),
    0 1px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px 0 rgba(0, 0, 0, 0.02);

  &:hover {
	box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
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
  color: rgba(0, 0, 0, 0.65);
  white-space: nowrap;
`

const PermissionDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #95DE64;
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
  color: #1d293d;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
`
