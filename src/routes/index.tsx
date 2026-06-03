import styled from "@emotion/styled"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import type { WorkspaceDto } from "src/api/model"
import { useListWorkspaces } from "src/api/workspace/workspace"
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card"
import { TasksView } from "src/routes/workspace/$urlName/tasks"

export const Route = createFileRoute("/")({
  component: RouteComponent,
  staticData: {
    header: {
      title: "סביבות",
      navigation: false,
      user: false,
    },
  },
})

// FIX Move to file?
interface WorkspaceCardProps {
  workspace: WorkspaceDto
}

function WorkspaceCard({
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
    <Card onClick={handleWorkspaceClick}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {/* // FIX Add description */}
        <CardDescription>{title}</CardDescription>

        <CardAction>
          <Avatar>
            <AvatarImage
              src={icon ?? "/workspace-icon.png"}
              alt={title}
              className="grayscale"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </CardAction>
      </CardHeader>
      {/* // FIX Check if needed */}
      {/* <CardFooter>{memberCount} משתמשים</CardFooter> */}
    </Card>
  )
}

function RouteComponent() {
  const navigate = useNavigate()

  const { data: workspaces = [] } = useListWorkspaces()

  function handlePersonalClick() {
    navigate({ to: "/personal", search: { view: TasksView.TABLE } })
  }

  return (
    <PageRoot>
      <PersonalBanner onClick={handlePersonalClick}>
        <PersonalLabel>אזור אישי</PersonalLabel>
        <PersonalSub>משימות ופעולות אישיות</PersonalSub>
      </PersonalBanner>

      <SectionTitle>סביבות עבודה</SectionTitle>

      <WorkspaceGrid>
        {workspaces.map((ws) => (
          <WorkspaceCard key={ws.urlName} workspace={ws} />
        ))}
      </WorkspaceGrid>
    </PageRoot>
  )
}

const PageRoot = styled.div`
  padding-block: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const PersonalBanner = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 20px 24px;
  background: var(--chip-bg);
  border: 1px solid var(--chip-line);
  border-radius: 12px;
  cursor: pointer;
  text-align: start;
  transition: background 0.15s;

  &:hover {
    background: var(--link-bg-hover);
  }
`

const PersonalLabel = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: var(--sea-ink);
`

const PersonalSub = styled.span`
  font-size: 14px;
  color: var(--sea-ink-soft);
`

const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: var(--sea-ink-soft);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
`

const WorkspaceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
`
