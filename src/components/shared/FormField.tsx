import styled from "@emotion/styled"
import type { AnyFieldApi } from "@tanstack/form-core"
import type { ReactNode } from "react"

interface FormFieldProps {
	label?: ReactNode
	required?: boolean
	children: ReactNode
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
			{(field || error !== undefined) && (
				<ErrorText $error={showError}>
					{showError && String(errors[0])}
				</ErrorText>
			)}
		</Wrapper>
	)
}

const Wrapper = styled.div`
  direction: rtl;
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
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
`

const RequiredMark = styled.span`
  color: var(--Error-color-error);
  font-size: var(--fs-btn);
`

const ErrorText = styled.span<{ $error?: boolean }>`
  font-size: var(--fs-sm);
  color: var(--Error-color-error);
  line-height: 18px;
  min-height: 18px;
  padding-inline-start: 10px;
  align-self: flex-start;
  visibility: ${({ $error }) => ($error ? "visible" : "hidden")}
`
