import { AxiosError } from "axios"
import { useMemo } from "react"
import { useErrorHandler } from "src/providers/ErrorModalProvider"
import { ErrorCode, isErrorCode } from "src/utils/error-utils"

interface RootErrorComponentProps {
	error: Error
}

export function RootErrorComponent({ error }: RootErrorComponentProps) {
	const status = useMemo(
		() =>
			error
				? error instanceof AxiosError
					? (Number(
							[error?.code, error?.status, error?.response?.status].find(
								(status) => status && isErrorCode(Number(status)),
							),
						) ?? ErrorCode.SERVER_ERROR)
					: ErrorCode.SERVER_ERROR
				: null,
		[error],
	)

	useErrorHandler(status)
}
