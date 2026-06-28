import { useNetwork } from "@mantine/hooks"
import { useErrorHandler } from "src/providers/ErrorModalProvider"
import { IS_DEV } from "src/utils/env-utils"
import { ErrorCode } from "src/utils/error-utils"

export function NoConnectionMonitor() {
	const { online } = useNetwork()

	useErrorHandler(!online && !IS_DEV ? ErrorCode.SERVER_ERROR : null)

	return null
}
