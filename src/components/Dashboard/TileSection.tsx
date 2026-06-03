import styled from "@emotion/styled"
import { useNavigate, useParams } from "@tanstack/react-router"
import { ChevronDown, Plus, Users } from "lucide-react"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import { NewTaskMode } from "src/routes/workspace/$urlName/tasks/new"

export const TitleSection = () => {
  const { urlName } = useParams({ from: "/workspace/$urlName/dashboard" })
  const navigate = useNavigate()

  function handleNavigateToNewInstruction() {
    navigate({
      to: "/workspace/$urlName/tasks/new",
      params: { urlName },
      search: { view: TasksView.TABLE, mode: NewTaskMode.SINGLE },
    })
  }

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
      <ButtonGroup>
        <AssigneesButton onClick={handleNavigateToAssigneeSettings}>
          <Users size={16} />
          הגדרת מקבלי הנחיות
        </AssigneesButton>
        <CreateButton onClick={handleNavigateToNewInstruction}>
          <Plus size={16} />
          צור הנחייה
          <ChevronDown size={16} />
        </CreateButton>
      </ButtonGroup>
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
  font-size: 24px;
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
  font-size: 38px;
  font-weight: 500;
  color: var(--foreground);
  white-space: nowrap;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`

const CreateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 15px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(165deg, var(--purple-start) 0%, var(--purple-end) 100%);
  color: var(--primary-foreground);
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.9;
  }
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
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover {
    background: var(--chip-bg);
  }
`
