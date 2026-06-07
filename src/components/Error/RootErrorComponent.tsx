import { useEffect } from "react"
import { useErrorModal } from "src/providers/ErrorModalProvider"

interface RootErrorComponentProps {
	error: Error
}

export function RootErrorComponent({ error }: RootErrorComponentProps) {
	const { handleError } = useErrorModal()

	useEffect(() => {
		handleError(error)
	}, [error, handleError])

	return null
}
