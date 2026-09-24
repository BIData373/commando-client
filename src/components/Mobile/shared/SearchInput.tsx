import styled from "@emotion/styled"
import { Search, X } from "lucide-react"

interface SearchInputProps {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	onFocus?: () => void
	onBlur?: () => void
}

export default function SearchInput({
	value,
	onChange,
	placeholder,
	onFocus,
	onBlur,
}: SearchInputProps) {
	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		onChange(e.target.value)
	}

	function handleClear() {
		onChange("")
	}

	return (
		<Wrapper>
			<Input
				placeholder={placeholder}
				value={value}
				onChange={handleChange}
				onFocus={onFocus}
				onBlur={onBlur}
			/>
			{value ? (
				<ClearButton onClick={handleClear}>
					<X size={18} />
				</ClearButton>
			) : (
				<IconWrapper>
					<Search size={18} />
				</IconWrapper>
			)}
		</Wrapper>
	)
}

const Wrapper = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	flex: 1;
	min-width: 0;
`

const Input = styled.input`
	direction: rtl;
	width: 100%;
	height: 48px;
	padding: 8px 12px;
	padding-inline-end: 40px;
	border: 0.5px solid var(--Text-color-text-placeholder);
	border-radius: 8px;
	background: var(--background);
	font-size: var(--fs-lg);
	color: var(--sea-ink);
	outline: none;
	text-align: start;

	&::placeholder {
		color: var(--Text-color-text-placeholder);
	}

	&:focus {
		border-color: var(--primary);
	}
`

const IconWrapper = styled.span`
	position: absolute;
	inset-inline-end: 12px;
	display: flex;
	color: var(--Text-color-text-placeholder);
	pointer-events: none;
`

const ClearButton = styled.button`
	position: absolute;
	inset-inline-end: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: none;
	border: none;
	padding: 0;
	color: var(--sea-ink-soft);
`
