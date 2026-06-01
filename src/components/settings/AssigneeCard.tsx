import styled from "@emotion/styled"
import { User } from "lucide-react"
import { useState } from "react"
import type { AssigneeDto } from "src/api/model"
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
import { AssigneeDialog } from "./AssigneeDialog"
import { DeleteAssigneePopconfirm } from "./DeleteAssigneePopconfirm"

const MAX_VISIBLE_TAGS = 2

interface IAssigneeCardProps {
	assignee: AssigneeDto
}

export function AssigneeCard({
	assignee,
	assignee: { users },
}: IAssigneeCardProps) {
	const visibleUsers = users.slice(0, MAX_VISIBLE_TAGS)
	const remainingUsers = users.length - MAX_VISIBLE_TAGS

	const [isUpdateCardOpen, setIsUpdateCardOpen] = useState(false)

	function onCardClick() {
		setIsUpdateCardOpen(true)
	}

	return (
		<>
			<AssigneeDialog
				assignee={assignee}
				open={isUpdateCardOpen}
				onOpenChange={setIsUpdateCardOpen}
			/>

			<StyledCard onClick={onCardClick}>
				<StyledCardHeader>
					<CardHeaderRow>
						<AssigneeAvatar assignee={assignee} />

						<CardWrapper>
							<CardMeta>
								<CardTitle>{assignee.name}</CardTitle>

								<DeleteAssigneePopconfirm assigneeId={assignee.id} />
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

								{info?.name ?? `#${id}`}
							</StyledBadge>
						))}

						{remainingUsers > 0 && (
							<StyledBadge variant="outline">+{remainingUsers}</StyledBadge>
						)}
					</TagRow>
				</CardContent>
			</StyledCard>
		</>
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
  font-size: 14px;
  font-weight: 400;
`

const CardHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 12px;
`

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  gap: 4px;
`

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-block-start: 6px;
`

const StyledBadge = styled(Badge)`
    border-radius: 9999px;
    font-size: 14px;
    padding: 0 7px;
    background: rgba(0, 0, 0, 0.04);
    font-weight: 400;
`
