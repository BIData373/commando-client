import styled from "@emotion/styled"
import Placeholder from "@tiptap/extension-placeholder"
import UnderlineExtension from "@tiptap/extension-underline"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Bold, ListOrdered, Underline } from "lucide-react"
import { useEffect, useState } from "react"

// ─── Types ───────────────────────────────────────────────────────────────────

interface NotesFieldProps {
	notes: string
	onNotesChange: (value: string) => void
}

// ─── Component ───────────────────────────────────────────────────────────────

function NotesField({ notes, onNotesChange }: NotesFieldProps) {
	const [isFocused, setIsFocused] = useState(false)
	const [, setTick] = useState(0)

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				bulletList: false,
				blockquote: false,
				codeBlock: false,
				code: false,
				heading: false,
				horizontalRule: false,
				strike: false,
			}),
			UnderlineExtension,
			Placeholder.configure({
				placeholder: "הערות ודגשים",
			}),
		],
		content: notes,
		onUpdate: ({ editor }) => {
			onNotesChange(editor.getHTML())
		},
		onFocus: () => setIsFocused(true),
		onBlur: () => setIsFocused(false),
		onTransaction: () => setTick((t) => t + 1),
	})

	useEffect(() => {
		if (editor && notes !== editor.getHTML()) {
			editor.commands.setContent(notes)
		}
	}, [notes, editor])

	function handleToggleBold() {
		editor?.chain().focus().toggleBold().run()
	}

	function handleToggleUnderline() {
		editor?.chain().focus().toggleUnderline().run()
	}

	function handleToggleOrderedList() {
		editor?.chain().focus().toggleOrderedList().run()
	}

	function handlePreventDefault(e: React.MouseEvent) {
		e.preventDefault()
	}

	return (
		<FormItem>
			<FormLabelRow>
				<LabelText>הערות הנחיה</LabelText>
			</FormLabelRow>
			<NotesEditorWrapper>
				{isFocused && (
					<NotesToolbar onMouseDown={handlePreventDefault}>
						<ToolbarButton
							type="button"
							$active={editor?.isActive("orderedList") ?? false}
							onClick={handleToggleOrderedList}
						>
							<ListOrdered size={16} />
						</ToolbarButton>
						<ToolbarDivider />
						<ToolbarButton
							type="button"
							$active={editor?.isActive("underline") ?? false}
							onClick={handleToggleUnderline}
						>
							<Underline size={16} />
						</ToolbarButton>
						<ToolbarButton
							type="button"
							$active={editor?.isActive("bold") ?? false}
							onClick={handleToggleBold}
						>
							<Bold size={16} />
						</ToolbarButton>
					</NotesToolbar>
				)}
				<StyledEditorContent editor={editor} dir="rtl" />
			</NotesEditorWrapper>
		</FormItem>
	)
}

export default NotesField

// ─── Styled ─────────────────────────────────────────────────────────────────

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
`

const FormLabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  padding-block-end: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
`

const LabelText = styled.span`
  color: rgba(0, 0, 0, 0.88);
`

const NotesEditorWrapper = styled.div`
  position: relative;
  width: 100%;
`

const NotesToolbar = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 16px;
  background: white;
  border-radius: 4px;
  box-shadow:
    0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px rgba(0, 0, 0, 0.12),
    0px 9px 28px rgba(0, 0, 0, 0.05);
  z-index: var(--z-dropdown);
`

const ToolbarButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0 4px;
  background: ${({ $active }) => ($active ? "rgba(22, 119, 255, 0.1)" : "transparent")};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#1677ff" : "rgba(0, 0, 0, 0.88)")};

  &:hover {
    background: ${({ $active }) => ($active ? "rgba(22, 119, 255, 0.15)" : "rgba(0, 0, 0, 0.04)")};
  }
`

const ToolbarDivider = styled.div`
  width: 1px;
  height: 16px;
  background: #d9d9d9;
`

const StyledEditorContent = styled(EditorContent)`
  .tiptap {
    width: 100%;
    height: 52px;
    padding: 4px 11px;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    background: white;
    font-size: 16px;
    font-weight: 400;
    line-height: 20px;
    color: rgba(0, 0, 0, 0.88);
    outline: none;
    box-sizing: border-box;
    overflow-y: auto;

    &:focus {
      border-color: #4096ff;
      box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
    }

    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      color: rgba(0, 0, 0, 0.25);
      pointer-events: none;
      float: inline-start;
      height: 0;
    }

    ol {
      padding-inline-start: 24px;
      margin: 0;
      list-style-type: decimal;
    }
  }
`
