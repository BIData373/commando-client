import styled from "@emotion/styled"
import type { AnyFieldApi } from "@tanstack/form-core"

interface FormFieldProps {
	field: AnyFieldApi
	label?: string
	required?: boolean
	children: React.ReactNode
}

export function FormField({
	field,
	label,
	required,
	children,
}: FormFieldProps) {
	const errors = field.state.meta.errors
	return (
		<Wrapper>
			{label && (
				<LabelRow>
					{required && <RequiredMark>*</RequiredMark>}
					<LabelText>{label}</LabelText>
				</LabelRow>
			)}
			{children}
			{errors.length > 0 && <ErrorText>{String(errors[0])}</ErrorText>}
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
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
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
