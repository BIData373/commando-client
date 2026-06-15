import styled from "@emotion/styled"
import { useLocalStorage } from "@mantine/hooks"
import { debounce } from "lodash"
import type { ChangeEvent } from "react"
import { isBIKey, requestUsernameKey } from "src/axios"
import { adminUserUpn } from "src/hooks/useCurrentUser"
import { queryClient } from "src/queryClient"
import { IS_BI, REQUEST_USERNAME, STATIC_TOKEN } from "../utils/env-utils"
import { DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import { Switch } from "./ui/switch"

export function BIHeaderBypass() {
	const [username, setUsername] = useLocalStorage({
		key: requestUsernameKey,
		defaultValue: REQUEST_USERNAME ?? "",
	})

	const [isBI, setIsBI] = useLocalStorage({
		key: isBIKey,
		defaultValue: !!IS_BI,
	})

	function handleChangeUsername({
		target: { value },
	}: ChangeEvent<HTMLInputElement>) {
		const cleanValue = value.replace(" ", "")

		setUsername(cleanValue.length > 0 ? cleanValue : undefined)
	}

	function handleChangeIsBI(checked: boolean) {
		setIsBI(checked)
		queryClient.invalidateQueries()
	}

	const handleChangeIsBIDebounced = debounce(handleChangeIsBI, 300)

	return (
		STATIC_TOKEN && (
			<>
				<DropdownMenuSeparator />

				<DropdownMenuItem
					onSelect={(e) => e.preventDefault()}
					onPointerMove={(e) => e.preventDefault()}
					onPointerLeave={(e) => e.preventDefault()}
				>
					<Row>
						<Label>UPN</Label>

						<Input
							value={username}
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
							checked={isBI}
							onCheckedChange={handleChangeIsBIDebounced}
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
`

const Label = styled.span`
  font-size: 12px;
  color: var(--muted-foreground);
  white-space: nowrap;
`
