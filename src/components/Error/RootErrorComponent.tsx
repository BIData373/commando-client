import { useErrorHandler } from "src/providers/ErrorModalProvider"

interface RootErrorComponentProps {
	error: Error
}

export function RootErrorComponent({ error }: RootErrorComponentProps) {
	useErrorHandler(error)
}
