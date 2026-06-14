import styled from "@emotion/styled"
import { useListWorkspaces } from "src/api/workspace/workspace"
import WorkspaceCard from "./WorkspaceCard"

export default function SpacesContainer() {
	const { data: workspaces = [] } = useListWorkspaces()

	return (
		<>
			<SectionTitle>סביבות עבודה</SectionTitle>

			<WorkspaceGrid>
				{workspaces.map((ws) => (
					<WorkspaceCard key={ws.urlName} workspace={ws} />
				))}
			</WorkspaceGrid>
		</>
	)
}

const SectionTitle = styled.h2`
  font-size: var(--fs-btn);
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
