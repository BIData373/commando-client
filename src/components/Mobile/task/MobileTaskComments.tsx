import styled from "@emotion/styled"
import { useState } from "react"
import { useDeleteMessage, useListMessages } from "src/api/message/message"
import { PermissionType, type TaskWithWorkspaceDto } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { GradientGhostButton } from "src/components/shared/GradientGhostButton"
import { GradientText } from "src/components/shared/GradientText"
import TaskComment from "src/components/shared/TaskComment"
import TaskCommentsSection from "src/components/shared/TaskCommentsSection"
import { TEST_IDS } from "src/consts/test-ids"
import { invalidateTaskComments } from "src/functions/comment-utils"
import { useCurrentUser } from "src/hooks/useCurrentUser"
import { MobileDrawer } from "../MobileDrawer"

interface MobileTaskCommentsProps {
	task: TaskWithWorkspaceDto
}

type DrawerMode = "closed" | "view" | "add"

export function MobileTaskComments({
	task: {
		id,
		assigneeStatuses,
		workspace: { id: workspaceId },
	},
}: MobileTaskCommentsProps) {
	const [drawerMode, setDrawerMode] = useState<DrawerMode>("closed")
	const { data: messages = [] } = useListMessages({ taskIds: [id] })

	const currentUser = useCurrentUser()

	const { data: permission } = useGetMyPermission({ workspaceId })

	const isManager = permission?.type === PermissionType.MANAGER
	const { mutate: deleteMessage } = useDeleteMessage({
		mutation: {
			meta: { toast: { error: true } },
			onSettled: () => invalidateTaskComments(id),
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
				<GradientGhostButton
					testId={TEST_IDS.mobile.commentsAdd}
					onClick={() => setDrawerMode("add")}
				>
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
					<ShowMoreButton
						data-testid={TEST_IDS.mobile.commentsShowMore}
						onClick={() => setDrawerMode("view")}
					>
						<GradientText>הצג עוד</GradientText>
					</ShowMoreButton>
				</>
			)}
			<CommentsDrawer
				testId={TEST_IDS.mobile.commentsDrawer}
				open={drawerMode !== "closed"}
				onOpenChange={() => setDrawerMode("closed")}
				title={headerText}
			>
				<TaskCommentsSection
					isManager={isManager}
					taskId={id}
					showInput={drawerMode === "add"}
				/>
			</CommentsDrawer>
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

// TODO: chrome-83 - min-height fallback for dvh not supported
const CommentsDrawer = styled(MobileDrawer)`
	min-height: 80vh;
	min-height: 80dvh;
`

const Seperator = styled.div`
	height: 1px;
	background: var(--button-hover);
`
