import styled from "@emotion/styled"
import { useNavigate } from "@tanstack/react-router"
import { User } from "lucide-react"
import type { AssigneesDto } from "src/api/model"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { AssigneeAvatar } from "../shared/AssigneeAvatar"
import { OverflowRow } from "../shared/OverflowRow"
import { Badge } from "../ui/badge"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card"
import { Separator } from "../ui/separator"
import { DeleteAssigneePopconfirm } from "./DeleteAssigneePopconfirm"

interface AssigneeCardProps {
	assignee: AssigneesDto
}

export function AssigneeCard({
	assignee,
	assignee: { users, tasksCount },
}: AssigneeCardProps) {
	const {
		workspace: { urlName },
	} = useWorkspace()

	const navigate = useNavigate()

	function onCardClick() {
		navigate({
			to: "/workspace/$urlName/settings/assignees/$assigneeId",
			params: { urlName, assigneeId: String(assignee.id) },
		})
	}

	return (
		<StyledCard onClick={onCardClick}>
			<StyledCardHeader>
				<CardHeaderRow>
					<AssigneeAvatar assignee={assignee} />

					<CardWrapper>
						<CardMeta>
							<StyledCardTitle>{assignee.name}</StyledCardTitle>

							<DeleteAssigneePopconfirm
								assigneeId={assignee.id}
								tasksCount={tasksCount}
							/>
						</CardMeta>

						<StyledCardDescription>
							{users.length} משתמשים
						</StyledCardDescription>
					</CardWrapper>
				</CardHeaderRow>
			</StyledCardHeader>

			<CardContent>
				{users.length > 0 && <StyledSeparator />}

				<OverflowRow
					items={users.map(({ id, info, upn }) => (
						<StyledBadge key={id} variant="secondary">
							<User size={16} />

							<BadgeText>{info?.name ?? upn}</BadgeText>
						</StyledBadge>
					))}
					renderOverflow={(remaining) => (
						<StyledBadge variant="secondary">
							<BadgeText>+{remaining}</BadgeText>
						</StyledBadge>
					)}
				/>
			</CardContent>
		</StyledCard>
	)
}

const StyledCard = styled(Card)`
  border-radius: 8px;
  border: 1px solid #F0F0F0;
  box-shadow: var(--card-shadow-default);
  gap: 8px;
  cursor: pointer;
  transition: box-shadow 0.3s ease-in-out;
  width: 275px;

  button {
    opacity: 0;
  }

  &:hover {
    box-shadow: var(--card-shadow-hover);

    button {
        opacity: 1;
    }
  }
`

const StyledCardHeader = styled(CardHeader)`
    padding: 0 8px;
`

const StyledCardDescription = styled(CardDescription)`
  color: #BFBFBF;
  font-size: var(--fs-btn);
  font-weight: 400;
`

const CardHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
`

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 12px;
  min-width: 0;
`

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  gap: 4px;
`

const StyledCardTitle = styled(CardTitle)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const StyledSeparator = styled(Separator)`
  margin-bottom: 6px;
`

const StyledBadge = styled(Badge)`
	min-width: 0;
    border-radius: 9999px;
    font-size: var(--fs-btn);
    padding: 0 7px;
    background: rgba(0, 0, 0, 0.04);
    font-weight: 400;

	svg {
		flex-shrink: 0;
	}
`

const BadgeText = styled.span`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`
