import styled from "@emotion/styled"
import { History } from "lucide-react"
import type { TaskWithWorkspaceDto } from "src/api/model"
import { DueDateGroup } from "src/components/shared/DueDateGroup"
import { TagsRow } from "src/components/shared/TagsRow"
import { formatDateMonthYear, formatMinutesHours } from "src/utils/time-format"

interface MobileTaskDryInfoProps {
	task: TaskWithWorkspaceDto
}

export function MobileTaskDryInfo({
	task: {
		serialId,
		title,
		deadlineType,
		dueDate,
		updatedAt,
		createdAt,
		source,
		notes,
		tags,
	},
}: MobileTaskDryInfoProps) {
	return (
		<Wrapper>
			<TaskHeader as="header">
				<MetaData>
					<TaskIdLabel>#{serialId}</TaskIdLabel>
					<LastUpdate>
						<History size={18} />
						{formatMinutesHours(updatedAt)} - {formatDateMonthYear(updatedAt)}
					</LastUpdate>
				</MetaData>
				<TaskTitle>{title}</TaskTitle>
				<SectionWrapper>
					<SectionLabel>תג"ב</SectionLabel>
					<DueDateGroup
						createdAt={createdAt}
						dueDate={dueDate}
						source={source}
						deadlineType={deadlineType}
					/>
				</SectionWrapper>
			</TaskHeader>
			<TaskDetails>
				{!!notes && (
					<SectionWrapper>
						<SectionLabel>הערה</SectionLabel>
						<SectionDescription>{notes}</SectionDescription>
					</SectionWrapper>
				)}
				{!!source && (
					<SectionWrapper>
						<SectionLabel>מקור</SectionLabel>
						<SectionDescription>
							{source.name}
							<LightSectionDescriptionText>
								{source.date && <>{formatDateMonthYear(source.date)}</>}
							</LightSectionDescriptionText>
						</SectionDescription>
					</SectionWrapper>
				)}
				{!!tags && (
					<SectionWrapper>
						<SectionLabel>תגיות</SectionLabel>
						<TagsRow isMobile source={source} tags={tags}></TagsRow>
					</SectionWrapper>
				)}
			</TaskDetails>
		</Wrapper>
	)
}

const Wrapper = styled.div`
    font-size: var(--fs-btn);
    border-radius: 8px;
    background: white;
`

const TaskDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
`

const TaskHeader = styled(TaskDetails)`
    border-bottom: 1px solid var(--line);
`

const MetaData = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--text-color-400);
`

const TaskTitle = styled.h1`
    display: flex;
    align-items: center;
    font-size: var(--fs-heading-3);
    font-weight: 500;
    color: var(--text-color-2);
`

const SectionWrapper = styled.section`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    align-items: flex-start;
    min-width: 0;
`

const SectionLabel = styled.h2`
    font-size: var(--fs-lg);
    color: var(--text-color);
    font-weight: 500;
`

const SectionDescription = styled.p`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-color-2);
`

const LightSectionDescriptionText = styled.p`
    color: var(--text-color);
`

const TaskIdLabel = styled.span`
    margin-inline-end: auto;
    font-weight: 400;
    line-height: 22px;
`

const LastUpdate = styled.span`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`
