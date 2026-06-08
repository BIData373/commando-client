import styled from "@emotion/styled"
import type { AnyFieldApi } from "@tanstack/form-core"

interface FormFieldProps {
	label?: string
	required?: boolean
	children: React.ReactNode
	field?: AnyFieldApi
	error?: string
}

export function FormField({
	label,
	required,
	children,
	field,
	error,
}: FormFieldProps) {
	const errors = field ? field.state.meta.errors : error ? [error] : []
	const isTouched = field ? field.state.meta.isTouched : true
	const showError = isTouched && errors.length > 0

	return (
		<Wrapper>
			{label && (
				<LabelRow>
					{required && <RequiredMark>*</RequiredMark>}
					<LabelText>{label}</LabelText>
				</LabelRow>
			)}
			{children}
			{showError && <ErrorText>{String(errors[0])}</ErrorText>}
		</Wrapper>
	)
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  align-items: flex-start;
`

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const LabelText = styled.span`
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.65);
`

const RequiredMark = styled.span`
  color: #ff4d4f;
  font-size: 14px;
`

const ErrorText = styled.span`
  font-size: 13px;
  color: var(--color-error, #ef4444);
  line-height: 18px;
`
