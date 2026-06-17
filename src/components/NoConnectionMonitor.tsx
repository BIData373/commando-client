import { useNetwork } from "@mantine/hooks"
import { useErrorHandler } from "src/providers/ErrorModalProvider"
import { ErrorCode } from "src/utils/error-utils"

export function NoConnectionMonitor() {
	const { online } = useNetwork()

	useErrorHandler(!online ? ErrorCode.SERVER_ERROR : null)

	return null
}
