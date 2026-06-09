import { AxiosError } from "axios"
import { createContext, type ReactNode, useContext, useState } from "react"
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

	function handleError(error: Error) {
		if (error instanceof AxiosError) {
			const status = error?.status ?? error?.response?.status
			const code =
				status && isErrorCode(status) ? status : ErrorCode.SERVER_ERROR
			setErrorCode(code)
		}
	}

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
