import { AxiosError } from "axios"
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react"
import { ErrorCode, isErrorCode } from "../utils/error-utils"

interface ErrorModalContextValue {
	errorCode: number | null
	setErrorCode(errorCode: number | null): void
	handleError(error: Error): void
}

const ErrorModalContext = createContext<ErrorModalContextValue | null>(null)

interface ErrorModalProviderProps {
	children: ReactNode
}

export function ErrorModalProvider({ children }: ErrorModalProviderProps) {
	const [errorCode, setErrorCode] = useState<number | null>(null)

	const handleError = useCallback((error: Error) => {
		if (error instanceof AxiosError) {
			const status = error?.status ?? error?.response?.status
			const code =
				status && isErrorCode(status) ? status : ErrorCode.SERVER_ERROR
			setErrorCode(code)
		}
	}, [])

	return (
		<ErrorModalContext.Provider
			value={{ errorCode, setErrorCode, handleError }}
		>
			{children}
		</ErrorModalContext.Provider>
	)
}

export function useErrorModal() {
	const context = useContext(ErrorModalContext)
	if (!context) {
		throw new Error("useErrorModal must be used inside a ErrorModalProvider")
	}
	return context
}

export function useErrorHandler(...errors: (Error | null)[]) {
	const { handleError } = useErrorModal()
	const error = errors.find(Boolean) ?? null

	useEffect(() => {
		if (error) {
			handleError(error)
		}
	}, [error, handleError])
}
