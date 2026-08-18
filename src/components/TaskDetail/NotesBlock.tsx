import styled from "@emotion/styled"

interface NotesBlockProps {
	notes: string
}

function NotesBlock({ notes }: NotesBlockProps) {
	return (
		<NotesSection>
			<SectionLabel>הערות הנחיה</SectionLabel>
			<NotesText dangerouslySetInnerHTML={{ __html: notes }} />
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

const NotesText = styled.div`
  width: 100%;
  overflow-wrap: break-word;
  font-size: var(--fs-btn);
  line-height: 20px;
  color: var(--sea-ink-soft);

  p {
    margin: 0;
  }

  ol {
    margin: 0;
    padding-inline-start: 20px;
    list-style-type: decimal;
  }

  li {
    margin: 0;
  }

  li p {
    display: inline;
  }

  strong {
    font-weight: 600;
  }

  u {
    text-decoration: underline;
  }
`
