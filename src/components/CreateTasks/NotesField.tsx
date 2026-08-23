import styled from "@emotion/styled"
import { useRef, useState } from "react"
import { NOTES_MAX_LENGTH } from "../../utils/form-utils"

// ─── Types ───────────────────────────────────────────────────────────────────

interface NotesFieldProps {
	notes: string
	onNotesChange: (value: string) => void
}

// ─── Component ───────────────────────────────────────────────────────────────

function NotesField({ notes, onNotesChange }: NotesFieldProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const [isFocused, setIsFocused] = useState(false)

	function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		onNotesChange(e.target.value)
	}

	function handleWrapperClick() {
		textareaRef.current?.focus()
	}

	return (
		<FormItem>
			<FormLabelRow>
				<LabelText>הערה</LabelText>
			</FormLabelRow>
			<InputWrapper $focused={isFocused} onClick={handleWrapperClick}>
				<NotesTextarea
					ref={textareaRef}
					value={notes}
					onChange={handleChange}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					placeholder="הערה"
					dir="rtl"
					maxLength={NOTES_MAX_LENGTH}
					rows={1}
				/>
				{isFocused && (
					<CharCount>
						{notes.length}/{NOTES_MAX_LENGTH}
					</CharCount>
				)}
			</InputWrapper>
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
  font-size: var(--fs-btn);
  line-height: 22px;
  white-space: nowrap;
`

const LabelText = styled.span`
  color: var(--text-color-2);
`

const InputWrapper = styled.div<{ $focused: boolean }>`
  position: relative;
  width: 100%;
  border: 1px solid ${({ $focused }) => ($focused ? "var(--button-color-hover)" : "var(--card-border)")};
  border-radius: 8px;
  background: var(--background);
  box-shadow: ${({ $focused }) => ($focused ? "var(--shadow-textarea-focus)" : "none")};
  cursor: text;
`

const NotesTextarea = styled.textarea`
  width: 100%;
  display: flex;
  padding: 4px 11px 4px 50px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 24px;
  color: var(--text-color-2);
  outline: none;
  box-sizing: border-box;
  resize: none;

  &::placeholder {
    color: var(--Text-color-text-placeholder);
  }
`

const CharCount = styled.span`
  position: absolute;
  inset-block-end: 4px;
  inset-inline-start: 8px;
  font-size: var(--fs-sm);
  line-height: 20px;
  color: var(--sea-ink-soft);
  pointer-events: none;
`
