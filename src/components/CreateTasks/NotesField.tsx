import styled from "@emotion/styled"
import { NOTES_MAX_LENGTH } from "../../utils/form-utils"

// ─── Types ───────────────────────────────────────────────────────────────────

interface NotesFieldProps {
	notes: string
	onNotesChange: (value: string) => void
}

// ─── Component ───────────────────────────────────────────────────────────────

function NotesField({ notes, onNotesChange }: NotesFieldProps) {
	function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		onNotesChange(e.target.value)
	}

	return (
		<FormItem>
			<FormLabelRow>
				<LabelText>הערה</LabelText>
			</FormLabelRow>
			<InputWrapper>
				<NotesTextarea
					value={notes}
					onChange={handleChange}
					placeholder="הערה"
					dir="rtl"
					maxLength={NOTES_MAX_LENGTH}
					rows={1}
				/>
				<CharCount>
					{notes.length}/{NOTES_MAX_LENGTH}
				</CharCount>
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

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  background: var(--background);
  cursor: text;

  &:focus-within {
    border-color: var(--button-color-hover);
    box-shadow: var(--shadow-textarea-focus);
  }
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
  inset-block-start: 50%;
  inset-inline-start: 8px;
  transform: translateY(-50%);
  font-size: var(--fs-sm);
  line-height: 20px;
  color: var(--sea-ink-soft);
  pointer-events: none;
  display: none;

  ${InputWrapper}:focus-within & {
    display: block;
  }
`
