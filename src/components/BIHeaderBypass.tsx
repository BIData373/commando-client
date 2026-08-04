import styled from "@emotion/styled"
import { debounce } from "lodash"
import { type ChangeEvent, useMemo } from "react"
import { useBIBypass } from "src/hooks/useBIBypass"
import { adminUserUpn } from "src/hooks/useCurrentUser"
import { queryClient } from "src/queryClient"
import { STATIC_TOKEN } from "../utils/env-utils"
import { DropdownMenuItem } from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import { Switch } from "./ui/switch"

export function BIHeaderBypass() {
	const { username, setUsername, isBI, setIsBI } = useBIBypass()

	const invalidateQueriesDebounced = useMemo(
		() => debounce(() => queryClient.invalidateQueries(), 300),
		[],
	)

	function handleChangeUsername({
		target: { value },
	}: ChangeEvent<HTMLInputElement>) {
		const cleanValue = value.replace(" ", "")

		setUsername(cleanValue.length > 0 ? cleanValue : null)
		invalidateQueriesDebounced()
	}

	function handleChangeIsBI(checked: boolean) {
		setIsBI(checked)
		invalidateQueriesDebounced()
	}

	return (
		STATIC_TOKEN && (
			<>
				<DropdownMenuItem
					onSelect={(e) => e.preventDefault()}
					onPointerMove={(e) => e.preventDefault()}
					onPointerLeave={(e) => e.preventDefault()}
				>
					<Row>
						<Label>UPN</Label>

						<Input
							value={username ?? undefined}
							onChange={handleChangeUsername}
							placeholder={adminUserUpn}
						/>
					</Row>
				</DropdownMenuItem>

				<DropdownMenuItem
					onSelect={(e) => e.preventDefault()}
					onPointerMove={(e) => e.preventDefault()}
					onPointerLeave={(e) => e.preventDefault()}
				>
					<Row>
						<Label>Is BI</Label>

						<Switch
							checked={isBI ?? true}
							onCheckedChange={handleChangeIsBI}
							size="sm"
							dir="rtl"
						/>
					</Row>
				</DropdownMenuItem>
			</>
		)
	)
}

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  direction: ltr;
`

const Label = styled.span`
  font-size: 12px;
  color: var(--muted-foreground);
  white-space: nowrap;
`
