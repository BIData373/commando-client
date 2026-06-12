import styled from "@emotion/styled"
import { useNavigate, useParams } from "@tanstack/react-router"
import { Users } from "lucide-react"
import { PermissionType } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { useListWorkspaces } from "src/api/workspace/workspace"
import { CreateTaskButton } from "src/components/shared/CreateTaskButton"

export const TitleSection = () => {
	const { urlName } = useParams({ from: "/workspace/$urlName/dashboard" })
	const navigate = useNavigate()
	const { data: workspaces = [] } = useListWorkspaces()
	const workspaceId = workspaces.find((w) => w.urlName === urlName)?.id ?? 0
	const { data: myPermission } = useGetMyPermission({ workspaceId })

	const isManager = myPermission?.type === PermissionType.MANAGER

	function handleNavigateToAssigneeSettings() {
		navigate({
			to: "/workspace/$urlName/settings/assignees",
			params: { urlName },
		})
	}

	return (
		<TitleSectionContainer>
			<TitleGroup>
				<PageTitle>מסך המפקד</PageTitle>
				<TitleDivider />
				<WorkspaceName>לשכת מקשא&quot;פ</WorkspaceName>
			</TitleGroup>
			{isManager && (
				<ButtonGroup>
					<AssigneesButton onClick={handleNavigateToAssigneeSettings}>
						<Users size={16} />
						הגדרת מקבלי הנחיות
					</AssigneesButton>
					<CreateTaskButton context="dashboard" />
				</ButtonGroup>
			)}
		</TitleSectionContainer>
	)
}

const TitleSectionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const WorkspaceName = styled.span`
  font-size: var(--fs-heading-3);
  font-weight: 400;
  color: #001225;
  white-space: nowrap;
`

const TitleDivider = styled.div`
  width: 1.5px;
  height: 38px;
  background: rgba(0, 0, 0, 0.65);
  flex-shrink: 0;
`

const PageTitle = styled.h1`
  margin: 0;
  font-size: var(--fs-heading-1);
  font-weight: 500;
  color: var(--foreground);
  white-space: nowrap;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`

const AssigneesButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 15px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--background);
  color: var(--foreground);
  font-size: var(--fs-base);
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover {
    background: var(--chip-bg);
  }
`
