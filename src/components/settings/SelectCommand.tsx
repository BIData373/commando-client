import styled from "@emotion/styled"
import { useListPikuds } from "src/api/pikud/pikud"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select"

// const COMMAND_OPTIONS = [
// 	"פיקוד צפון",
// 	"פיקוד מרכז",
// 	"פיקוד דרום",
// 	"פיקוד העורף",
// 	"פיקוד העומק",
// 	"מטכ״ל",
// ] as const

interface SelectCommandProps {
	value: number
	onChange(value: number): void
}

export function SelectCommand({ value, onChange }: SelectCommandProps) {
	const { data: pikuds } = useListPikuds()

	function handleChange(value: string) {
		onChange(Number(value))
	}

	return (
		<Select value={String(value)} onValueChange={handleChange}>
			<StyledSelectTrigger>
				<SelectValue placeholder="בחר פיקוד" />
			</StyledSelectTrigger>
			<StyledSelectContent position="popper" side="bottom">
				{pikuds?.map(({ id, name }) => (
					<StyledSelectItem key={id} value={String(id)}>
						{name}
					</StyledSelectItem>
				))}
			</StyledSelectContent>
		</Select>
	)
}

const StyledSelectTrigger = styled(SelectTrigger)`
    width: 100%;
    flex-direction: row-reverse;
    background: var(--background);
`

const StyledSelectContent = styled(SelectContent)`
  & [data-slot="select-scroll-up-button"],
  & [data-slot="select-scroll-down-button"] {
    display: none;
  }
`

const StyledSelectItem = styled(SelectItem)`
    flex-direction: row-reverse;
`
