import styled from "@emotion/styled"
import { useNavigate, useParams } from "@tanstack/react-router"
import { User } from "lucide-react"
import type { AssigneesDto } from "src/api/model"
import { AssigneeAvatar } from "../shared/AssigneeAvatar"
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

const MAX_VISIBLE_TAGS = 2

interface AssigneeCardProps {
	assignee: AssigneesDto
}

export function AssigneeCard({
	assignee,
	assignee: { users, tasksCount },
}: AssigneeCardProps) {
	const visibleUsers = users.slice(0, MAX_VISIBLE_TAGS)
	const remainingUsers = users.length - MAX_VISIBLE_TAGS

	const { urlName } = useParams({ strict: false })
	const navigate = useNavigate()

	function onCardClick() {
		navigate({
			to: "/workspace/$urlName/settings/assignees/$assigneeId",
			params: { urlName: urlName!, assigneeId: String(assignee.id) },
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
				<Separator />

				<TagRow>
					{visibleUsers.map(({ id, info }) => (
						<StyledBadge key={id} variant="secondary">
							<User size={16} />

							<BageText>{info?.name ?? `#${id}`}</BageText>
						</StyledBadge>
					))}

					{remainingUsers > 0 && (
						<StyledBadge variant="outline">
							<BageText>+{remainingUsers}</BageText>
						</StyledBadge>
					)}
				</TagRow>
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

const TagRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  padding-block-start: 6px;
  min-width: 0;
  overflow: hidden;
`

const StyledBadge = styled(Badge)`
	min-width: 0;
	max-width: 100px;
    border-radius: 9999px;
    font-size: var(--fs-btn);
    padding: 0 7px;
    background: rgba(0, 0, 0, 0.04);
    font-weight: 400;
	flex: 1;

	svg {
		flex-shrink: 0;
	}
`

const BageText = styled.span`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`
