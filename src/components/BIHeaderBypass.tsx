import styled from "@emotion/styled"
import { useLocalStorage } from "@mantine/hooks"
import { isBIKey, requestUsernameKey } from "src/axios"
import { adminUserUpn } from "src/hooks/useCurrentUser"
import { IS_BI, REQUEST_USERNAME, STATIC_TOKEN } from "../utils/env-utils"
import {
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import { Switch } from "./ui/switch"

export function BIHeaderBypass() {
	const [bypassUsername, setBypassUsername] = useLocalStorage({
		key: requestUsernameKey,
		defaultValue: REQUEST_USERNAME ?? "",
	})

	const [bypassIsBI, setBypassIsBI] = useLocalStorage({
		key: isBIKey,
		defaultValue: !!IS_BI,
	})

	return (
		STATIC_TOKEN && (
			<>
				<DropdownMenuLabel>BI Bypass</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
					<BypassRow>
						<BypassLabel>UPN</BypassLabel>

						<Input
							value={bypassUsername}
							onChange={(e) => setBypassUsername(e.target.value)}
							placeholder={adminUserUpn}
						/>
					</BypassRow>
				</DropdownMenuItem>

				<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
					<BypassRow>
						<BypassLabel>Is BI</BypassLabel>

						<Switch
							checked={bypassIsBI}
							onCheckedChange={setBypassIsBI}
							size="sm"
							dir="rtl"
						/>
					</BypassRow>
				</DropdownMenuItem>
			</>
		)
	)
}

const BypassRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
`

const BypassLabel = styled.span`
  font-size: 12px;
  color: var(--muted-foreground);
  white-space: nowrap;
`
