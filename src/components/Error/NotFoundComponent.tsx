import { useEffect } from "react"
import { useErrorModal } from "src/providers/ErrorModalProvider"
import { ErrorCode } from "src/utils/error-utils"

export function NotFoundComponent() {
	const { setErrorCode } = useErrorModal()
	useEffect(() => {
		setErrorCode(ErrorCode.NOT_FOUND)
	}, [setErrorCode])
	return null
}
