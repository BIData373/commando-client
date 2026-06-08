import styled from "@emotion/styled"
import { EditorContent, useEditor } from "@tiptap/react"
import { EditorExtensions } from "src/utils/tiptap-extensions"

interface NotesCellContentProps {
	notes?: string
}

export default function NotesCellContent({ notes }: NotesCellContentProps) {
	const editor = useEditor({
		...EditorExtensions,
		content: notes,
		editable: false,
	})

	return notes ? (
		<Wrapper>
			<NotesEditorContent editor={editor} />
		</Wrapper>
	) : null
}

const Wrapper = styled.div`
  overflow: hidden;
  max-height: 40px;

  font-size: 14px;
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

const NotesEditorContent = styled(EditorContent)`
  .ProseMirror {
    &:focus {
      outline: none;
    }
  }
`
