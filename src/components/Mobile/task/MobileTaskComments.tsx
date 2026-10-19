import styled from "@emotion/styled"
import { useState } from "react"
import { useDeleteMessage, useListMessages } from "src/api/message/message"
import { PermissionType, type TaskWithWorkspaceDto } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { GradientGhostButton } from "src/components/shared/GradientGhostButton"
import { GradientText } from "src/components/shared/GradientText"
import TaskComment from "src/components/shared/TaskComment"
import TaskCommentsSection from "src/components/shared/TaskCommentsSection"
import { handleSettled } from "src/functions/comment-utils"
import { useCurrentUser } from "src/hooks/useCurrentUser"
import { MobileDrawer } from "../MobileDrawer"

interface MobileTaskCommentsProps {
	task: TaskWithWorkspaceDto
}

export function MobileTaskComments({
	task: {
		id,
		assigneeStatuses,
		workspace: { id: workspaceId },
	},
}: MobileTaskCommentsProps) {
	const [isCommentsOpen, setIsCommentsOpen] = useState(false)
	const { data: messages = [] } = useListMessages({ taskIds: [id] })

	const currentUser = useCurrentUser()

	const { data: permission } = useGetMyPermission({ workspaceId })

	const isManager = permission?.type === PermissionType.MANAGER

	function handleOpenChange() {
		setIsCommentsOpen(!isCommentsOpen)
	}
	const { mutate: deleteMessage } = useDeleteMessage({
		mutation: {
			meta: { toast: { error: true } },
			onSettled: handleSettled(id),
		},
	})

	function handleDeleteComment(id: number) {
		deleteMessage({ pathParams: { id } })
	}

	const headerText = `תגובות (${messages.length})`

	return (
		<Wrapper>
			{assigneeStatuses.length !== 0 && <Seperator />}
			<Header>
				<Title>{headerText}</Title>
				<GradientGhostButton onClick={handleOpenChange}>
					הוספת תגובה
				</GradientGhostButton>
			</Header>
			{messages.length > 0 && (
				<>
					<TaskComment
						canDelete={isManager || messages[0].user.upn === currentUser.upn}
						message={messages[0]}
						onDelete={handleDeleteComment}
					/>
					<ShowMoreButton onClick={handleOpenChange}>
						<GradientText>הצג עוד</GradientText>
					</ShowMoreButton>
				</>
			)}
			<MobileDrawer
				open={isCommentsOpen}
				onOpenChange={handleOpenChange}
				title={headerText}
			>
				<TaskCommentsSection isManager={isManager} taskId={id} />
			</MobileDrawer>
		</Wrapper>
	)
}

const Wrapper = styled.section`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
`

const Header = styled.header`
    display: flex;
    justify-content: space-between;
`

const Title = styled.h2`
    font-size: var(--fs-base);
    font-weight: 500;
    color: black;
`

const ShowMoreButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: absolute;
    bottom: 0;
    left: 50%;
    height: 75px;
    width: 100%;
    padding-bottom: 1rem;
    transform: translateX(-50%);
    background: var(--black-to-background-linear);
`

const Seperator = styled.div`
	height: 1px;
	background: var(--button-hover);
`
