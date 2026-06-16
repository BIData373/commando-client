import styled from "@emotion/styled"
import { useNavigate } from "@tanstack/react-router"
import type { WorkspaceDto } from "src/api/model"
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar"
import { Card, CardContent } from "src/components/ui/card"
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
		<StyledCard onClick={handleWorkspaceClick}>
			<StyledContent>
				<BigAvatar>
					<BigAvatarImage
						src={
							Math.random() > 0.5
								? formatMesibaIcon(icon)
								: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQENQrEaUft50MRucTsyvb38W6bV58KWHoRyw&s"
						}
						alt={title}
					/>
					<WorkspaceInitials>{getInitials(title)}</WorkspaceInitials>
				</BigAvatar>
				<Tooltip>
					<TooltipTrigger asChild>
						<TitleText>{title}</TitleText>
					</TooltipTrigger>
					<TooltipContent>{title}</TooltipContent>
				</Tooltip>
			</StyledContent>
		</StyledCard>
	)
}

const StyledCard = styled(Card)`
  cursor: pointer;
  width: 160px;
`

const StyledContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
`

const BigAvatar = styled(Avatar)`
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  border-radius: 4px;

  &:has(img) {
    border: 0;

    &::after {
      border: none;
    }
  }
`

const BigAvatarImage = styled(AvatarImage)`
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 0;
`

const WorkspaceInitials = styled(AvatarFallback)`
  font-size: var(--fs-heading-1);
`

const TitleText = styled.span`
  font-size: var(--fs-base);
  font-weight: 600;
  color: var(--sea-ink);
  width: 100%;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
