import styled from "@emotion/styled"
import { NotesText } from "src/utils/notes-utils"

interface NotesBlockProps {
	notes: string
}

function NotesBlock({ notes }: NotesBlockProps) {
	return (
		<NotesSection>
			<SectionLabel>הערות הנחיה</SectionLabel>
			<FullWidthNotesText dangerouslySetInnerHTML={{ __html: notes }} />
		</NotesSection>
	)
}

export default NotesBlock

const SectionLabel = styled.p`
  font-size: var(--fs-base);
  font-weight: 500;
  line-height: 24px;
  color: var(--sea-ink);
  text-align: end;
  white-space: nowrap;
`

const NotesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  align-items: flex-start;
`

const FullWidthNotesText = styled(NotesText)`
  width: 100%;
  overflow-wrap: break-word;
`
