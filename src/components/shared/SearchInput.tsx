import styled from "@emotion/styled"
import { Search, X } from "lucide-react"
import { MOBILE_MEDIA_QUERY } from "src/hooks/use-mobile"

interface SearchInputProps {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	onFocus?: () => void
	onBlur?: () => void
	className?: string
}

export default function SearchInput({
	value,
	onChange,
	placeholder,
	onFocus,
	onBlur,
	className,
}: SearchInputProps) {
	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		onChange(e.target.value)
	}

	function handleClear() {
		onChange("")
	}

	return (
		<Wrapper className={className}>
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
	height: 40px;
	padding: 8px 12px;
	padding-inline-start: 40px;
	border: 1px solid var(--card-border);
	border-radius: 8px;
	background: var(--background);
	font-size: var(--fs-base);
	color: var(--sea-ink);
	outline: none;
	text-align: start;

	&::placeholder {
		color: var(--Text-color-text-placeholder);
	}

	&:focus {
		border-color: var(--primary);
	}

	${MOBILE_MEDIA_QUERY} {
		height: 48px;
		border: 0.5px solid var(--Text-color-text-placeholder);
		font-size: var(--fs-lg);
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
	cursor: pointer;
`
