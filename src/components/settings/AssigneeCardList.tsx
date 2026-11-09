import styled from "@emotion/styled"
import type { AssigneesDto } from "src/api/model"
import noResultsFound from "../../assets/empty-states/no-results-found.svg"
import { EmptyCardState } from "../shared/EmptyCardState"
import { Spinner } from "../ui/spinner"
import { AssigneeCard } from "./AssigneeCard"

interface AssigneeCardListProps {
	assignees: AssigneesDto[]
	isLoading: boolean
	searchQuery: string
}

export function AssigneeCardList({
	assignees,
	isLoading,
	searchQuery,
}: AssigneeCardListProps) {
	if (isLoading) {
		return (
			<LoadingContainer>
				<Spinner />
			</LoadingContainer>
		)
	}

	if (assignees.length === 0) {
		return (
			<CenterContainer>
				<EmptyCardState
					imgSrc={noResultsFound}
					title="לא נמצאו אחראים"
					description={`לא נמצאו אחראים התואמים ל-"${searchQuery}"`}
				/>
			</CenterContainer>
		)
	}

	return (
		<AssigneeCardGrid>
			{assignees.map((assignee) => (
				<AssigneeCard key={assignee.id} assignee={assignee} />
			))}
		</AssigneeCardGrid>
	)
}

const AssigneeCardGrid = styled.div`
  padding: 20px 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  direction: rtl;
`

const CenterContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
`
