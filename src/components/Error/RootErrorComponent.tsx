import { useEffect } from "react"
import { useErrorModal } from "src/providers/ErrorModalProvider"
import { ErrorCode, isErrorCode } from "src/utils/error-utils"

interface RouteError {
	status?: number
	response?: { status?: number }
}

interface RootErrorComponentProps {
	error: Error
}

export function RootErrorComponent({ error }: RootErrorComponentProps) {
	const { setErrorCode } = useErrorModal()

	useEffect(() => {
		const routeError = error as RouteError
		const status = routeError?.status ?? routeError?.response?.status
		const code = status && isErrorCode(status) ? status : ErrorCode.SERVER_ERROR
		setErrorCode(code)
	}, [error, setErrorCode])

	return null
}
