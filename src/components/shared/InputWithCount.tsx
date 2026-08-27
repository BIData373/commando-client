import styled from "@emotion/styled"

interface InputWithCountProps {
	text: string
	onChange: (value: string) => void
	maxLength: number
	placeholder?: string
	isTextArea?: boolean
}

function InputWithCount({
	text,
	onChange,
	maxLength,
	placeholder,
	isTextArea,
}: InputWithCountProps) {
	const inputProps = {
		value: text,
		onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
			onChange(e.target.value),
		placeholder,
		dir: "rtl",
		maxLength,
	}

	return (
		<FormItem>
			<InputWrapper>
				{isTextArea ? (
					<Textarea {...inputProps} rows={1} />
				) : (
					<Text {...inputProps} />
				)}
				<CharCount>
					{text.length}/{maxLength}
				</CharCount>
			</InputWrapper>
		</FormItem>
	)
}

export default InputWithCount

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
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

const Textarea = styled.textarea`
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

const Text = styled.input`
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
  right: 0;
  direction: ltr;
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
